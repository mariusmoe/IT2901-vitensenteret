process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");
mongoose.Promise = Promise;

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();
var jwt = '';
chai.use(chaiHttp);
describe('Auth API', () => {


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



  describe('/api/auth/login POST', () => {
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

  describe('/api/auth/get_referral_link/admin POST', () => {
    it('should create one referral link /api/auth/get_referral_link/admin GET', (done) => {
      chai.request(server)
      .get('/api/auth/get_referral_link/admin')
      .set('Authorization', jwt)
      .end( (err, res) => {
        res.should.have.status(200);
        done();
      });
    });
    it('should create one referral link /api/auth/get_referral_link/member GET', (done) => {
      chai.request(server)
      .get('/api/auth/get_referral_link/member')
      .set('Authorization', jwt)
      .end( (err, res) => {
        res.should.have.status(200);
        done();
      });
    });
    it('should return 401 when unauthorized - wrong jwt /api/auth/get_referral_link GET', (done) => {
      chai.request(server)
      .get('/api/auth/get_referral_link/admin')
      .set('Authorization', 'badcode')  // bad code
      .end( (err, res) => {
        res.should.have.status(401);
        done();
      });
    });
    it('should return 401 when unauthorized - omitted auth property /api/auth/get_referral_link GET', (done) => {
      chai.request(server)
      .get('/api/auth/get_referral_link/admin')
      // .set('Authorization', 'badcode') // omitted authorization property
      .end( (err, res) => {
        res.should.have.status(401);
        done();
      });
    });
  });

  describe('/api/auth/get_token GET', () => {
    it('should get a new JWT /api/auth/get_token GET', (done) => {
      chai.request(server)
      .get('/api/auth/get_token')
      .set('Authorization', jwt)
      .end( (err, res) => {
        res.should.have.status(200);
        res.body.should.have.property('token');
        res.body.should.have.property('user');
        done();
      });
    });
  });

  describe('/api/auth/delete_account DELETE', () => {
    let isolated_jwt = ""

    it('should create a new user /api/auth/register_developer POST', (done) => {
    chai.request(server)
      .post('/api/auth/register_developer')
      .send({'email': 'test-to-del@test.com', 'password': 'test'})
      .end(function(err, res){
        //res.should.have.status(200);
        done();
      })
    });

    it('should login user to be deleted /api/auth/login POST', (done) => {
      chai.request(server)
      .post('/api/auth/login')
      .send({'email': 'test-to-del@test.com', 'password': 'test'})
      .end(function(err, res){
        isolated_jwt = res.body.token;   // Should be globaly avaliable before each test now
        user_id = res.body.user._id;
        res.should.have.status(200);
        done();
      });
    });
    it('should delete this user /api/auth/delete_account DELETE', (done) => {
      chai.request(server)
      .delete('/api/auth/delete_account')
      .set('Authorization', isolated_jwt)
      .send({'id': user_id})
      .end( (err, res) => {
        res.should.have.status(200);
        done();
      });
    });
  });
});
