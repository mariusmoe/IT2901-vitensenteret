process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
mongoose.Promise = Promise;

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();
var jwt = '';
var surveyId = '';
chai.use(chaiHttp);



/*
      TODO:
      This file needs to be restructured, and test all aspects of the REST API.

      1) verify everything works given correct input
      2) verify everything gives right status codes given wrong input
        a) malformed input
        b) missing input
      3) verify everything gives right status codes given actions that should not be allowed
        EXAMPLE:
          DELETE survey with ID that doesn't exist
          GET survey with ID that doesn't exist / used to exist
          etc

      4) Move test data separately / above, to make the tests easier to read.
*/








describe('Survey', () => {


    before( (done) => {
      chai.request(server)
        .post('/api/auth/register_developer')
        .send({'email': 'test@test.no', 'password': 'test'})
        .end(function(err, res){
          //res.should.have.status(200);
          done();
        })
    });

  beforeEach( (done) => {
        chai.request(server)
        .post('/api/auth/login')
        .send({'email': 'test@test.no', 'password': 'test'})
        .end(function(err, res){
          jwt = res.body.token;   // Should be globaly avaliable before each test now :D
          res.should.have.status(200);
          done();
        });
  });
  afterEach((done) => {
    done();
  });



  it('should create a survey given valid input /api/survey/ POST', (done) => {
    chai.request(server)
    .post('/api/survey')
    .set('Authorization', jwt)
    .send({
        "name": "måneraketten3",
        "date": "2012-04-23T18:25:43.511Z",
        "questionlist": [{
          "mode": "smily",
          "eng": {
            "txt": "what do you think about mars?",
            "options": ["AWSOME","coooool","blody iron planet"]
            }
          ,
          "nor": {
            "txt": "Hva synes du om Mars?",
            "options": ["UTROLIG","kuuuuul","jevla jernplanet"]
            }
          ,
          "answer": [1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3]
          }]
      })
    .end((err, res) => {
      surveyId = res.body._id;
      res.body.should.have.property('questionlist');
      res.body.questionlist.should.not.be.empty;
      res.should.have.status(200);
      done();
    });
  });

  it('should return 422 given bad survey input /api/survey/ POST', (done) => {
    chai.request(server)
    .post('/api/survey')
    .set('Authorization', jwt)
    .send({
      "test": "test"
      })
    .end((err, res) => {
      res.should.have.status(422);
      done();
    });
  });


  it('should retrieve the survey of the id given /api/survey/surveyId GET', (done) => {
  chai.request(server)
    .get('/api/survey/' + surveyId)
    .end((err, res) => {
      res.should.not.be.empty;
      res.body.should.have.property('questionlist');
      res.body.questionlist.should.not.be.empty;
      res.should.have.status(200);
      done();
    });
  });

  it('should patch the survey of the id given /api/survey/surveyId PATCH', (done) => {
  chai.request(server)
    .patch('/api/survey/' + surveyId)
    .set('Authorization', jwt)
    .send({
        "name": "plutorakett",
        "date": "2012-04-23T18:25:43.511Z",
        "questionlist": [{
          "mode": "text",
          "eng": {
            "txt": "what do you thin about mars",
            "options": ["AWSOME","coooool","blody iron planet"]
            }
          ,
          "nor": {
            "txt": "Hva synes du om Mars",
            "options": ["UTROLIG","kuuuuul","jevla jernplanet"]
            }
          ,
          "answer": [1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3]
          }]
      })
    .end((err, res) => {
      res.body.should.have.property('survey');
      res.body.survey.should.not.be.empty;
      res.body.survey.should.have.property('name');
      res.body.survey.name.should.equal('plutorakett');
      res.should.have.status(200);
      done();
    });
  });

  it('should return 422 given bad survey input /api/survey/surveyId PATCH', (done) => {
  chai.request(server)
    .patch('/api/survey/' + surveyId)
    .set('Authorization', jwt)
    .send({
        "name": "plutorakett",
        "date": "2012-04-23T18:25:43.511Z",
        "questionlist": [{
          // "mode": "text", <-- bad input; it is required.
          "eng": {
            "txt": "what do you thin about marssssssssss",
            "options": ["AWSOME","coooool","blody iron planet"]
            }
          ,
          "nor": {
            "txt": "Hva synes du om Mars",
            "options": ["UTROLIG","kuuuuul","jevla jernplanet"]
            }
          ,
          "answer": [1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,3,1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3,1,2,1,2,1,2,2,1,1,2,1,2,1,2,1,2,2,3,3,2,2,2,3,2,1,2,1,2,2,1,2,1,2,1,2,2,1,1,1,2,2,1,1,1,1,1,2,2,2,2,3,3,3,3,3,3,3,3,3,3]
          }]
      })
    .end( (err, res) => {
      res.should.have.status(422);
      done();
    });
  });

describe('Should delete the survey', () => {
  it('should delete the survey of the id given /api/survey/surveyId DELETE', (done) => {
    chai.request(server)
    .delete('/api/survey/' + surveyId)
    .set('Authorization', jwt)
    .end((err, res) => {
      res.should.have.status(200);
      done();
    });
  });

  it('should check that the survey actually got deleted /api/survey/surveyId GET', (done) => {
    // verify that it was actually deleted.
    chai.request(server).get('/api/survey/' + surveyId)
    .end((err, res) => {
      // TODO: was this actually fixed?
      res.should.have.status(404);
      done();
    });
  });

})


});
