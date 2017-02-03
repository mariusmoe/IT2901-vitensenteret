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
describe('Survey', function() {


    before( function(done) {
      chai.request(server)
        .post('/api/auth/register_developer')
        .send({'email': 'test@test.no', 'password': 'test'})
        .end(function(err, res){
          //res.should.have.status(200);
          done();
        })
    });

  beforeEach(function(done){
        chai.request(server)
        .post('/api/auth/login')
        .send({'email': 'test@test.no', 'password': 'test'})
        .end(function(err, res){
          jwt = res.body.token;   // Should be globaly avaliable before each test now :D
          res.should.have.status(200);
          done();
        });
  });
  afterEach(function(done){
    done();
  });



  it('should create one survey /api/survey/ POST', function(done) {
    chai.request(server)
    .post('/api/survey')
    .set('Authorization', jwt)
    .send({
        "name": "måneraketten3",
        "date": "Thu Apr 16 12:40:44 +0100 2009",
        "questionlist": [{
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
    .end(function(err, res){
      surveyId = res.body._id;
      res.body.questionlist.should.not.be.empty;
      res.should.have.status(200);
      done();
    });
  });


  it('should retrieve one survey /api/survey/surveyId GET', function(done) {
  chai.request(server)
    .get('/api/survey/' + surveyId)
    .end(function(err, res){
      res.should.not.be.empty;
      // res.should.not.be.questionlist;
      res.should.have.status(200);
      done();
    });
  });

  it('should patch one survey /api/survey/surveyId PATCH', function(done) {
  chai.request(server)
    .patch('/api/survey/' + surveyId)
    .set('Authorization', jwt)
    .send({
        "name": "plutorakett",
        "date": "Thu Apr 16 12:40:44 +0100 2009",
        "questionlist": [{
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
    .end(function(err, res){
      res.body.survey.should.not.be.empty;
      res.body.survey.name.should.equal('plutorakett');
      res.should.have.status(200);
      done();
    });
  });

  it('should delete one survey /api/survey/surveyId DELETE', function(done) {
  chai.request(server)
    .delete('/api/survey/' + surveyId)
    .set('Authorization', jwt)
    .end(function(err, res){
      res.should.have.status(200);
      done();
    });
  });


});
