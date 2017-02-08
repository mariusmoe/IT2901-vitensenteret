process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
mongoose.Promise = Promise;

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();
var jwt = '';
chai.use(chaiHttp);
describe('Auth', () => {


    before( (done) => {
      chai.request(server)
        .post('/api/auth/register_developer')
        .send({'email': 'test@test.no', 'password': 'test'})
        .end(function(err, res){
          //res.should.have.status(200);
          done();
        })
    });

  beforeEach((done) => {
        chai.request(server)
        .post('/api/auth/login')
        .send({'email': 'test@test.no', 'password': 'test'})
        .end(function(err, res){
          jwt = res.body.token;   // Should be globaly avaliable before each test now
          res.should.have.status(200);
          done();
        });
  });
  afterEach((done) => {
    done();
  });



  describe('login', () => {
    it('should log in one user /api/auth/login POST', (done) => {
    chai.request(server)
      .post('/api/auth/login')
      .send({'email': 'test@test.no', 'password': 'test'})
      .end((err, res) => {
        res.should.have.status(200);
        done();
      });
    });
    it('should return 401 when the user login email is wrong /api/auth/login POST', (done) => {
    chai.request(server)
      .post('/api/auth/login')
      .send({'email': 'test@wrongemail.com', 'password': 'test'}) // wrong email
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
    });
    it('should return 401 when the user login password is wrong /api/auth/login POST', (done) => {
    chai.request(server)
      .post('/api/auth/login')
      .send({'email': 'test@test.no', 'password': 'wrongpassword'}) // wrong password
      .end((err, res) => {
        res.should.have.status(401);
        done();
      });
    });
    it('should return 400 when the user login details are omitted /api/auth/login POST', (done) => {
    chai.request(server)
      .post('/api/auth/login')
      .send() // omitted
      .end((err, res) => {
        res.should.have.status(400);
        done();
      });
    });
  });

  describe('referral link', () => {
    it('should create one referral link /api/auth/get_referral_link POST', (done) => {
      chai.request(server)
      .get('/api/auth/get_referral_link')
      .set('Authorization', jwt)
      .end( (err, res) => {
        res.should.have.status(200);
        done();
      });
    });
    it('should return 401 when unauthorized - wrong jwt /api/auth/get_referral_link POST', (done) => {
      chai.request(server)
      .get('/api/auth/get_referral_link')
      .set('Authorization', 'badcode')  // bad code
      .end( (err, res) => {
        res.should.have.status(401);
        done();
      });
    });
    it('should return 401 when unauthorized - omitted auth property /api/auth/get_referral_link POST', (done) => {
      chai.request(server)
      .get('/api/auth/get_referral_link')
      // .set('Authorization', 'badcode') // omitted authorization property
      .end( (err, res) => {
        res.should.have.status(401);
        done();
      });
    });
  });
});
