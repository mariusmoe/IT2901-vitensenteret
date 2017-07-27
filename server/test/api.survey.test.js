process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let status = require('../status');
let val = require('../libs/validation.js');
let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);

let mongoose = require('mongoose');
let Survey  = require('../models/survey');
let Response  = require('../models/response');
let Nickname  = require('../models/nickname');
let Center  = require('../models/center');
let User  = require('../models/user');
let Referral  = require('../models/referral');

// testing variables

var jwt = '';
var surveyId = '';
var preSurveyId = '';
var postSurveyId = '';

let validJsonObject = {
  "name": "måneraketten3",
  "date": "2012-04-23T18:25:43.511Z",
  "activationDate": "2012-04-23T18:25:43.511Z",
  "deactivationDate": "2012-04-23T18:25:43.511Z",
  // "center": "centerref", this gets filled in by the API itself
  // "madeBy": "userref", this gets filled in by the API itself
  "active": true,
  "isPost": false,
  "questionlist": [{
    "mode": "smiley",
    "required": true,
    // no comment property here. Admin only. see its own test below.
    "lang": {
      "en": {
          "txt": "what do you think about mars?",
          "options": ["AWSOME","coooool","blody iron planet"]
      },
      "no": {
        "txt": "Hva synes du om Mars?",
        "options": ["UTROLIG","kuuuuul","teit jernplanet"]
      },
    }
  }],
  "endMessage": {
    "no": "Takk for at du gjennomførte denne undersøkelsen!"
  }
}

let postValidJsonObject = {
  "name": "måneraketten3",
  "date": "2012-04-23T18:25:43.511Z",
  "activationDate": "2012-04-23T18:25:43.511Z",
  "deactivationDate": "2012-04-23T18:25:43.511Z",
  "active": true,
  "isPost": true,
  "questionlist": [{
    "mode": "smiley",
    "required": true,
    // no comment property here. Admin only. see its own test below.
    "lang": {
      "en": {
          "txt": "what do you think about mars?",
          "options": ["AWSOME","coooool","blody iron planet"]
      },
      "no": {
        "txt": "Hva synes du om Mars?",
        "options": ["UTROLIG","kuuuuul","teit jernplanet"]
      },
    }
  }],
  "endMessage": {
    "no": "Takk for at du gjennomførte denne undersøkelsen!"
  }
}

let responsesToSurvey = [
  {
    "nickname": "Ruffsetufs",
    "surveyId": null, // set manually below.
    "questionlist": [0, 3, 4, 5, "hello", [1,2,4], -1, 4]
  },
  {
    "nickname": "Ruffsetufsetuffs",
    "surveyId": null, // set manually below.
    "questionlist": [0, 3, 4, 5, "hello", [1,2,4], -1, 4]
  }
]

let responsesToSurveyPrepost = [
  {
    "nickname": "prepostnick1",
    "surveyId": null, // set manually below.
    "questionlist": [0, 3, 4, 5, "hello", [1,2,4], -1, 4]
  },
  {
    "nickname": "prepostnick2",
    "surveyId": null, // set manually below.
    "questionlist": [0, 3, 4, 5, "hello", [1,2,4], -1, 4]
  }
]

describe('Survey API', () => {

  // BEFORE
  before( (done) => {
    // yeah.
    Survey.remove({}).lean().then( Response.remove({}).lean().then(
      Nickname.remove({}).lean().then( Center.remove({}).lean().then(
        User.remove({}).lean().then( Referral.remove({}).lean().then( () => {
          chai.request(server).post('/api/auth/register_testdata').send('{}').end(function(err,res) {
            centerId = res.body.center._id;
            validJsonObject.madeBy = res.body.user._id;
            validJsonObject.center = res.body.center._id;
            done();
          });
        }))
      ))
    ))
  });


  // BEFORE / AFTER EACH
  beforeEach( (done) => {
        chai.request(server)
        .post('/api/auth/login')
        .send({'email': 'testuser@test.test', 'password': 'test'})
        .end((err, res) => {
          jwt = res.body.token;   // Should be globaly avaliable before each test.
          res.should.have.status(200);
          done();
        });
  });


  // tests
  describe('/api/survey/ POST',() => {
    // POST: CREATE SURVEY
    it('should create a survey given valid input /api/survey/ POST', (done) => {
      chai.request(server)
      .post('/api/survey')
      .set('Authorization', jwt)
      .send(validJsonObject)
      .end( (err1, res1) => {
        // DO NOT REMOVE: USED FOR THE OTHER TESTS
        surveyId = res1.body._id;
        // DO NOT REMOVE

        // verify that the returned object is valid
        expect(val.surveyValidation(res1.body)).to.equal(true);
        res1.should.have.status(200);


        let tasksCompleted = false;
        for (let response of responsesToSurvey) {
          response["surveyId"] = surveyId;
          chai.request(server)
          .post('/api/survey/' + surveyId)
          .set('Authorization', jwt)
          .send(response)
          .end( (err2, res2) => {
            // verify that the returned object is valid
            res2.body.should.have.property('message');
            res2.body.message.should.equal(status.SURVEY_RESPONSE_SUCCESS.message);
            res2.body.should.have.property('status');
            res2.body.status.should.equal(status.SURVEY_RESPONSE_SUCCESS.code);
            res2.should.have.status(200);
            if (tasksCompleted) {
              done();
            } else {
              tasksCompleted = true;
            }
          });
        }


      });
    });

    // POST: CREATE SURVEY - BAD
    it('should return 400 given non-existent survey json object /api/survey/surveyId POST', (done) => {
      chai.request(server)
        .post('/api/survey/')
        .set('Authorization', jwt)
        .send() // nothing!
        .end( (err, res) => {
          res.body.should.have.property('message');
          res.body.message.should.equal(status.SURVEY_OBJECT_MISSING.message);
          res.body.should.have.property('status');
          res.body.status.should.equal(status.SURVEY_OBJECT_MISSING.code);
          res.should.have.status(400);
          done();
        });
    });
    it('should return 422 given bad survey json object /api/survey/surveyId POST', (done) => {
      // alter our object
      let clone = JSON.parse(JSON.stringify(validJsonObject));
      delete clone.questionlist[0].mode; // This should make the object not pass the validator
      chai.request(server)
        .post('/api/survey/')
        .set('Authorization', jwt)
        .send(clone) // send our modified object
        .end( (err, res) => {
          res.body.should.have.property('message');
          res.body.message.should.equal(status.SURVEY_UNPROCESSABLE.message);
          res.body.should.have.property('status');
          res.body.status.should.equal(status.SURVEY_UNPROCESSABLE.code);
          res.should.have.status(422);
          done();
        });
    });

    // POST: NO AUTHORIZATION
    it('should return 401 when unauthorized - wrong jwt /api/survey/surveyId POST', (done) => {
      chai.request(server)
        .post('/api/survey/')
        .set('Authorization', 'badcode') // bad code
        .send(validJsonObject) // send our modified object
        .end( (err, res) => {
          res.should.have.status(401);
          done();
        });
    });
    it('should return 401 when unauthorized - omitted auth property /api/survey/surveyId POST', (done) => {
      chai.request(server)
        .post('/api/survey/')
        // .set('Authorization', 'badcode') // omitted authorization property
        .send(validJsonObject) // send our modified object
        .end( (err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  }); // end describe /api/survey/ POST


  describe('/api/survey/ GET',() => {
    // GET: LIST OF SURVEYS
    it('should retrieve all surveys /api/survey/all/[centerId] GET', (done) => {
    chai.request(server)
      .get('/api/survey/all/' + centerId)
      .end((err, res) => {
        // verify that the returned object (containing surveys) is valid
        let listOfSurveys = res.body;
        listOfSurveys.should.not.be.empty;
        listOfSurveys[0].should.have.property('_id');
        listOfSurveys[0].should.have.property('name');
        listOfSurveys[0].should.have.property('date');
        listOfSurveys[0].should.have.property('active');
        res.should.have.status(200);
        done();
      });
    });

    // GET: GET A SURVEY
    it('should retrieve the survey of the id given /api/survey/surveyId GET', (done) => {
    chai.request(server)
      .get('/api/survey/' + surveyId)
      .end((err, res) => {
        // verify that the returned object is valid
        expect(val.surveyValidation(res.body.survey)).to.equal(true);
        expect(val.responseValidation(res.body.response)).to.equal(true);
        res.should.have.status(200);
        done();
      });
    });

    // GET: GET SURVEY BAD
    it('should return 404 given surveyId not found in DB /api/survey/surveyId GET', (done) => {
      chai.request(server)
        .get('/api/survey/' + 'aaaaaaaaaaaaaaaaaaaaaaaa') // send non-existent (but valid) survey ID (24 chars)
        .send(validJsonObject)
        .end( (err, res) => {
          res.body.should.have.property('message');
          res.body.message.should.equal(status.SURVEY_NOT_FOUND.message);
          res.body.should.have.property('status');
          res.body.status.should.equal(status.SURVEY_NOT_FOUND.code);
          res.should.have.status(404);
          done();
        });
    });

    // GET: GET SURVEY BAD
    it('should return 400 given bad surveyId format /api/survey/surveyId GET', (done) => {
      chai.request(server)
        .get('/api/survey/' + 'InvalidID') // send badly formatted ID
        .send(validJsonObject)
        .end( (err, res) => {
          res.body.should.have.property('message');
          res.body.message.should.equal(status.SURVEY_BAD_ID.message);
          res.body.should.have.property('status');
          res.body.status.should.equal(status.SURVEY_BAD_ID.code);
          res.should.have.status(400);
          done();
        });
    });


  }); // end describe /api/survey/ GET



  // copy tests
  describe('/api/survey/copy/surveyId POST',() => {
    it('should return 400 given bad surveyId format /api/survey/copy/surveyId POST', (done) => {
      // alter our object
      let body = { 'includeResponses': true, 'copyLabel': 'COPY' };
      chai.request(server)
        .post('/api/survey/copy/' + 'InvalidID')
        .set('Authorization', jwt)
        .send(body) // send our modified object
        .end( (err, res) => {
          res.body.should.have.property('message');
          res.body.message.should.equal(status.SURVEY_BAD_ID.message);
          res.body.should.have.property('status');
          res.body.status.should.equal(status.SURVEY_BAD_ID.code);
          res.should.have.status(400);
          done();
        });
    });

    it('should return 404 given surveyId not found in DB /api/survey/copy/surveyId POST', (done) => {
      // alter our object
      let body = { 'includeResponses': true, 'copyLabel': 'COPY' };
      chai.request(server)
        .post('/api/survey/copy/' + 'aaaaaaaaaaaaaaaaaaaaaaaa')
        .set('Authorization', jwt)
        .send(body) // send our modified object
        .end( (err, res) => {
          res.body.should.have.property('message');
          res.body.message.should.equal(status.SURVEY_NOT_FOUND.message);
          res.body.should.have.property('status');
          res.body.status.should.equal(status.SURVEY_NOT_FOUND.code);
          res.should.have.status(404);
          done();
        });
    });

    it('should return 200 given valid id, without responses /api/survey/copy/surveyId POST', (done) => {
      // alter our object
      let body = { 'includeResponses': false, 'copyLabel': 'COPY' };
      chai.request(server)
        .post('/api/survey/copy/' + surveyId)
        .set('Authorization', jwt)
        .send(body) // send our modified object
        .end( (err, res) => {
          res.should.have.status(200);
          expect(val.surveyValidation(res.body)).to.equal(true);
          done();
        });
    });
    it('should return 200 given valid id, with responses /api/survey/copy/surveyId POST', (done) => {
      // alter our object
      let body = { 'includeResponses': true, 'copyLabel': 'COPY' };
      chai.request(server)
        .post('/api/survey/copy/' + surveyId)
        .set('Authorization', jwt)
        .send(body) // send our modified object
        .end( (err, res) => {
          res.should.have.status(200);
          expect(val.surveyValidation(res.body)).to.equal(true);
          done();
        });
    });
  });

  describe('/api/survey/ PATCH',() => {
    // PATCH: PATCH SURVEY
    it('should patch the survey of the id given /api/survey/surveyId PATCH', (done) => {
      // alter our object
      let clone = JSON.parse(JSON.stringify(validJsonObject));
      clone.name = 'plutorakett';
    chai.request(server)
      .patch('/api/survey/' + surveyId)
      .set('Authorization', jwt)
      .send(clone) // send the altered object
      .end((err, res) => {
        // codes
        res.body.should.have.property('message');
        res.body.message.should.equal(status.SURVEY_UPDATED.message);
        res.body.should.have.property('status');
        res.body.status.should.equal(status.SURVEY_UPDATED.code);
        res.should.have.status(200);

        // survey object
        res.body.should.have.property('survey');
        res.body.survey.should.not.be.empty;
        // verify that the returned object is valid
        expect(val.surveyValidation(res.body.survey)).to.equal(true);
        res.body.survey.should.have.property('name');
        res.body.survey.name.should.equal(clone.name); // should reflect the change we made

        done();
      });
    });

    // PATCH: PATCH SURVEY BAD
    it('should return 404 given non-existent surveyId /api/survey/surveyId PATCH', (done) => {
      // router should handle this. Status message and code applied in the error controller.
      chai.request(server)
        .patch('/api/survey/') // send no id
        .set('Authorization', jwt)
        .send(validJsonObject)
        .end( (err, res) => {
          res.body.should.have.property('message');
          res.body.message.should.equal(status.ROUTE_INVALID.message);
          res.body.should.have.property('status');
          res.body.status.should.equal(status.ROUTE_INVALID.code);
          res.should.have.status(404);
          done();
        });
    });
    it('should return 400 given non-existent survey json object /api/survey/surveyId PATCH', (done) => {
      chai.request(server)
        .patch('/api/survey/' + surveyId)
        .set('Authorization', jwt)
        .send() // nothing!
        .end( (err, res) => {
          res.body.should.have.property('message');
          res.body.message.should.equal(status.SURVEY_OBJECT_MISSING.message);
          res.body.should.have.property('status');
          res.body.status.should.equal(status.SURVEY_OBJECT_MISSING.code);
          res.should.have.status(400);
          done();
        });
    });
    it('should return 422 given bad survey json object /api/survey/surveyId PATCH', (done) => {
      // alter our object
      let clone = JSON.parse(JSON.stringify(validJsonObject));
      delete clone.questionlist[0].mode; // This should make the object not pass the validator
      chai.request(server)
        .patch('/api/survey/' + surveyId)
        .set('Authorization', jwt)
        .send(clone) // send our modified object
        .end( (err, res) => {
          res.body.should.have.property('message');
          res.body.message.should.equal(status.SURVEY_UNPROCESSABLE.message);
          res.body.should.have.property('status');
          res.body.status.should.equal(status.SURVEY_UNPROCESSABLE.code);
          res.should.have.status(422);
          done();
        });
    });
    // PATCH: GET SURVEY BAD
    it('should return 404 given surveyId not found in DB /api/survey/surveyId PATCH', (done) => {
      chai.request(server)
        .patch('/api/survey/' + "aaaaaaaaaaaaaaaaaaaaaaaa") // send bad id
        .set('Authorization', jwt)
        .send(validJsonObject)
        .end( (err, res) => {
          res.body.should.have.property('message');
          res.body.message.should.equal(status.SURVEY_NOT_FOUND.message);
          res.body.should.have.property('status');
          res.body.status.should.equal(status.SURVEY_NOT_FOUND.code);
          res.should.have.status(404);
          done();
        });
    });
    it('should return 400 given bad surveyId format /api/survey/surveyId PATCH', (done) => {
      chai.request(server)
        .patch('/api/survey/' + "InvalidID") // send badly formatted ID
        .set('Authorization', jwt)
        .send(validJsonObject)
        .end( (err, res) => {
          res.body.should.have.property('message');
          res.body.message.should.equal(status.SURVEY_BAD_ID.message);
          res.body.should.have.property('status');
          res.body.status.should.equal(status.SURVEY_BAD_ID.code);
          res.should.have.status(400);
          done();
        });
    });

    // PATCH: NO AUTHORIZATION
    it('should return 401 when unauthorized - wrong jwt /api/survey/surveyId PATCH', (done) => {
      chai.request(server)
        .patch('/api/survey/' + surveyId)
        .set('Authorization', 'badcode') // bad code
        .send(validJsonObject) // send our modified object
        .end( (err, res) => {
          res.should.have.status(401);
          done();
        });
    });
    it('should return 401 when unauthorized - omitted auth property /api/survey/surveyId PATCH', (done) => {
      chai.request(server)
        .patch('/api/survey/' + surveyId)
        // .set('Authorization', 'badcode') // omitted authorization property
        .send(validJsonObject) // send our modified object
        .end( (err, res) => {
          res.should.have.status(401);
          done();
        });
    });
  }); // end describe /api/survey/ PATCH


  describe('/api/survey/ DELETE',() => {
    // DELETE: NO AUTHORIZATION
    it('should return 401 when unauthorized - wrong jwt /api/survey/surveyId DELETE', (done) => {
      chai.request(server)
        .delete('/api/survey/' + surveyId)
        .set('Authorization', 'badcode') // bad code
        .send(validJsonObject) // send our modified object
        .end( (err, res) => {
          res.should.have.status(401);
          done();
        });
    });
    it('should return 401 when unauthorized - omitted auth property /api/survey/surveyId DELETE', (done) => {
      chai.request(server)
        .delete('/api/survey/' + surveyId)
        // .set('Authorization', 'badcode') // omitted authorization property
        .send(validJsonObject) // send our modified object
        .end( (err, res) => {
          res.should.have.status(401);
          done();
        });
    });

    // DELETE: BAD
    it('should return 404 given surveyId not found in DB /api/survey/surveyId DELETE', (done) => {
      chai.request(server)
        .delete('/api/survey/' + "aaaaaaaaaaaaaaaaaaaaaaaa") // send bad id
        .set('Authorization', jwt)
        .send(validJsonObject)
        .end( (err, res) => {
          res.body.should.have.property('message');
          res.body.message.should.equal(status.SURVEY_NOT_FOUND.message);
          res.body.should.have.property('status');
          res.body.status.should.equal(status.SURVEY_NOT_FOUND.code);
          res.should.have.status(404);
          done();
        });
    });
    it('should return 400 given bad surveyId format /api/survey/surveyId DELETE', (done) => {
      chai.request(server)
        .delete('/api/survey/' + "InvalidID") // send badly formatted ID
        .set('Authorization', jwt)
        .send(validJsonObject)
        .end( (err, res) => {
          res.body.should.have.property('message');
          res.body.message.should.equal(status.SURVEY_BAD_ID.message);
          res.body.should.have.property('status');
          res.body.status.should.equal(status.SURVEY_BAD_ID.code);
          res.should.have.status(400);
          done();
        });
    });



    // DELETE: GOOD
    it('should return 200 and delete the survey of the id given /api/survey/surveyId DELETE', (done) => {
      chai.request(server)
      .delete('/api/survey/' + surveyId)
      .set('Authorization', jwt)
      .end((err, res) => {
        res.should.have.status(200);
        // Verify deletion
        chai.request(server).get('/api/survey/' + surveyId)
        .end((err, res) => {
          res.body.should.have.property('message');
          res.body.message.should.equal(status.SURVEY_NOT_FOUND.message);
          res.body.should.have.property('status');
          res.body.status.should.equal(status.SURVEY_NOT_FOUND.code);
          res.should.have.status(404);
          done();
        });
      });
    });
  });
  // START moe testing delete behavior


  // ---------- START create prepost ----------------
  // FIXME dirty creation of pre post
  // PRE-survey
  var preSurveyObject;
  describe('/api/survey/prePost',() => {
    // POST: CREATE SURVEY
    it('should create a preSurvey given valid input /api/survey/ POST', (done) => {
      chai.request(server)
      .post('/api/survey')
      .set('Authorization', jwt)
      .send(validJsonObject)
      .end( (err, res) => {
        // DO NOT REMOVE: USED FOR THE OTHER TESTS
        preSurveyId = res.body._id;
        preSurveyObject = res.body;
        // DO NOT REMOVE
        // verify that the returned object is valid
        expect(val.surveyValidation(res.body)).to.equal(true);
        res.should.have.status(200);
        let tasksCompleted = false;
        for (let response of responsesToSurveyPrepost) {
          response["surveyId"] = preSurveyId;
          chai.request(server)
          .post('/api/survey/' + preSurveyId)
          .set('Authorization', jwt)
          .send(response)
          .end( (err, res) => {
            // verify that the returned object is valid
            res.body.should.have.property('message');
            res.body.message.should.equal(status.SURVEY_RESPONSE_SUCCESS.message);
            res.body.should.have.property('status');
            res.body.status.should.equal(status.SURVEY_RESPONSE_SUCCESS.code);
            res.should.have.status(200);
            if (tasksCompleted) {
              done();
            } else {
              tasksCompleted = true;
            }
          });
        }
      });
    });

    // POST-survey
    it('should create a postSurvey given valid input /api/survey/ POST', (done) => {
      chai.request(server)
      .post('/api/survey')
      .set('Authorization', jwt)
      .send(postValidJsonObject)
      .end( (err, res) => {
        // DO NOT REMOVE: USED FOR THE OTHER TESTS
        postSurveyId = res.body._id;
        // DO NOT REMOVE
        // verify that the returned object is valid
        expect(val.surveyValidation(res.body)).to.equal(true);
        res.should.have.status(200);
        let tasksCompleted = false;
        for (let response of responsesToSurveyPrepost) {
          response["surveyId"] = postSurveyId;
          chai.request(server)
          .post('/api/survey/' + postSurveyId)
          .set('Authorization', jwt)
          .send(response)
          .end( (err, res) => {
            // verify that the returned object is valid
            res.body.should.have.property('message');
            res.body.message.should.equal(status.SURVEY_RESPONSE_SUCCESS.message);
            res.body.should.have.property('status');
            res.body.status.should.equal(status.SURVEY_RESPONSE_SUCCESS.code);
            res.should.have.status(200);
            if (tasksCompleted) {
              done();
            } else {
              tasksCompleted = true;
            }
          });
        }
      });
    });

    // Patch presurvey with postKey
    it('should return 200 when adding new postKey - /api/survey/escape PATCH', (done) => {
      preSurveyObject.postKey = postSurveyId;
      chai.request(server)
        .patch('/api/survey/' + preSurveyId)
        .set('Authorization', jwt)
        .send(preSurveyObject) // send our modified object
        .end( (err, res) => {
          // console.log(res.body);
          res.body.should.have.property('message');
          res.should.have.status(200);
          done();
        });
    });

    // ----------- END create prepost -------------
    //
    it('should return 400 provided bad survey id - /api/survey/ DELETE', (done) => {
      chai.request(server)
        .delete('/api/survey/' + 'BADSurveyID')
        .set('Authorization', jwt)
        .end( (err, res) => {
          res.body.should.have.property('message');
          res.should.have.status(400);
          done();
        });
    });

    it('should return 404 when survey not in collection - /api/survey/ DELETE', (done) => {
      chai.request(server)
        .delete('/api/survey/58d5342fa14b490a1300e53f')
        .set('Authorization', jwt)
        .end( (err, res) => {
          res.body.should.have.property('message');
          res.should.have.status(404);
          done();
        });
    });

    // TODO test pre post delete check that both surveys get deleted
    it('should return 200 and delete the prePostsurvey /api/survey/ DELETE', (done) => {
      chai.request(server)
      .delete('/api/survey/' + preSurveyId)
      .set('Authorization', jwt)
      .end((err, res) => {
        res.should.have.status(200);
        // Verify deletion of prePost
        chai.request(server).get('/api/survey/' + preSurveyId).set('Authorization', jwt)
        .end((err, getRes) => {
          // console.log(getRes.body);
          getRes.body.should.have.property('message');
          getRes.body.message.should.equal(status.SURVEY_NOT_FOUND.message);
          getRes.body.should.have.property('status');
          getRes.body.status.should.equal(status.SURVEY_NOT_FOUND.code);
          getRes.should.have.status(404);
          chai.request(server).get('/api/survey/' + postSurveyId).set('Authorization', jwt)
          .end((err, getRes2) => {
            // console.log(getRes2.body);
            getRes2.body.should.have.property('message');
            getRes2.body.message.should.equal(status.SURVEY_NOT_FOUND.message);
            getRes2.body.should.have.property('status');
            getRes2.body.status.should.equal(status.SURVEY_NOT_FOUND.code);
            getRes2.should.have.status(404);
            done();
          })
        });
      });
    });
  }); // end describe /api/survey/ DELETE
});
