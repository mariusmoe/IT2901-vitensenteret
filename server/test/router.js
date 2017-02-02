process.env.NODE_ENV = 'test';
var colors = require('mocha/lib/reporters/base').colors;
colors['diff added'] = 32;
colors['diff removed'] = 31;

let mongoose = require("mongoose");
mongoose.Promise = Promise;

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();
var jwt = '';
chai.use(chaiHttp);
describe('Auth', function() {

  beforeEach(function(done){
    chai.request(server)
      .post('/api/auth/login')
      .send({'email': 'mariusomoe@gmail.com', 'password': 'test'})
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
    .send({'email': 'mariusomoe@gmail.com', 'password': 'test'})
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
