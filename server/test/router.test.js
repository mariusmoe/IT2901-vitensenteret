process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
mongoose.Promise = Promise;

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();
var jwt = '';
chai.use(chaiHttp);
describe('Auth', function() {


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



  it('should log in one user /api/auth/login POST', function(done) {
  chai.request(server)
    .post('/api/auth/login')
    .send({'email': 'test@test.no', 'password': 'test'})
    .end(function(err, res){
      res.should.have.status(200);
      done();
    });
  });


  it('should create one referral link /api/auth/get_referral_link POST', function(done) {
  chai.request(server)
    .get('/api/auth/get_referral_link')
    .set('Authorization', jwt)
    .end(function(err, res){
      res.should.have.status(200);
      done();
    });

});

});
