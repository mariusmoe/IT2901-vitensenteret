process.env.NODE_ENV = 'test';

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let status = require('../status');
let val = require('../libs/validation.js');
let should = chai.should();
let expect = chai.expect;
chai.use(chaiHttp);


// testing variables

var jwt = '';
var surveyId = '';

var validJsonObject = {
  "name": "måneraketten3",
  "date": "2012-04-23T18:25:43.511Z",
  "active": true,
  "questionlist": [{
    "mode": "smily",
    "answer": [1,2,1,2,1,2,1,2],
    "lang": {
      "en": {
        "txt": "what do you think about mars?",
        "options": ["AWSOME","coooool","blody iron planet"]
      },
      "no": {
        "txt": "Hva synes du om Mars?",
        "options": ["UTROLIG","kuuuuul","jevla jernplanet"]
      },
    },
  }]
}

describe('Survey API', () => {

  // BEFORE
  before( (done) => {
    chai.request(server)
      .post('/api/auth/register_developer')
      .send({'email': 'test@test.no', 'password': 'test'})
      .end(function(err, res){
        //res.should.have.status(200);
        done();
      })
  });


  // BEFORE / AFTER EACH
  beforeEach( (done) => {
        chai.request(server)
        .post('/api/auth/login')
        .send({'email': 'test@test.no', 'password': 'test'})
        .end(function(err, res){
          jwt = res.body.token;   // Should be globaly avaliable before each test.
          res.should.have.status(200);
          done();
        });
  });
  afterEach((done) => {
    done();
  });


  // tests
  describe('/api/survey/ POST',() => {
    // POST: CREATE SURVEY
    it('should create a survey given valid input /api/survey/ POST', (done) => {
      chai.request(server)
      .post('/api/survey')
      .set('Authorization', jwt)
      .send(validJsonObject)
      .end( (err, res) => {
        // DO NOT REMOVE: USED FOR THE OTHER TESTS
        surveyId = res.body._id;
        // DO NOT REMOVE

        // verify that the returned object is valid
        expect(val.surveyValidation(res.body)).to.equal(true);
        res.should.have.status(200);
        done();
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
    it('should retrieve all surveys /api/survey/ GET', (done) => {
    chai.request(server)
      .get('/api/survey/')
      .end((err, res) => {
        // verify that the returned object (containing surveys) is valid
        let listOfSurveys = res.body;
        listOfSurveys.should.not.be.empty;
        listOfSurveys[0].should.have.property('name');
        listOfSurveys[0].should.have.property('date');
        listOfSurveys[0].should.have.property('active');
        res.should.have.status(200);
        done();
      });
    });

    // This test requires the DB to
    /*
    it('should return 200 given empty database /api/survey/ GET', (done) => {
      chai.request(server)
      .delete('/api/survey/' + surveyId)
      .set('Authorization', jwt)
      .end((err, res) => {
        chai.request(server)
        .get('/api/survey/')
        .end((err, res) => {
          res.body.should.have.property('message');
          res.body.message.should.equal(status.ROUTE_SURVEYS_VALID_NO_SURVEYS.message);
          res.body.should.have.property('status');
          res.body.status.should.equal(status.ROUTE_SURVEYS_VALID_NO_SURVEYS.code);
          res.should.have.status(200);
          done();
        });
      });
    }); */


    // GET: GET A SURVEY
    it('should retrieve the survey of the id given /api/survey/surveyId GET', (done) => {
    chai.request(server)
      .get('/api/survey/' + surveyId)
      .end((err, res) => {
        // verify that the returned object is valid
        expect(val.surveyValidation(res.body)).to.equal(true);
        res.should.have.status(200);
        done();
      });
    });

    // GET: GET SURVEY BAD
    it('should return 404 given surveyId not found in DB /api/survey/surveyId GET', (done) => {
      chai.request(server)
        .get('/api/survey/' + 'InvalidID') // send bad id
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


  }); // end describe /api/survey/ GET



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
    it('should return 404 given surveyId not found in DB /api/survey/surveyId PATCH', (done) => {
      chai.request(server)
        .patch('/api/survey/' + "InvalidID") // send bad id
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
        .delete('/api/survey/' + "InvalidID") // send bad id
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
  }); // end describe /api/survey/ DELETE



});
