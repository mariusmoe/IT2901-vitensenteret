process.env.NODE_ENV = 'test';

let server = require('../index');
let status = require('../status');

let mongoose = require("mongoose"),
    User = require('../models/user'),
    Center = require('../models/center'),
    Referral = require('../models/referral');

mongoose.Promise = Promise;

let chai = require('chai');
let chaiHttp = require('chai-http');
let sinon = require('sinon');
let should = chai.should();
var jwt = '';
let centerId;
chai.use(chaiHttp);

describe('Center API', () => {
  before( (done) => {
    Center.remove({}).lean().then(User.remove({}).lean().then(Referral.remove({}).lean().then(() => {
      chai.request(server).post('/api/auth/register_testdata').send('{}').end(function(err,res){
        centerId = res.body.center._id;
        done();
      });
    })));
  });
  beforeEach((done) => {
      chai.request(server)
      .post('/api/auth/login')
      .send({'email': 'testuser@test.test', 'password': 'test'})
      .end(function(err, res){
        jwt = res.body.token;   // Should be globaly avaliable before each test now
        res.should.have.status(200);
        done();
      });
  });

  describe('/api/center/escape/[center]',() => {
    it('should return 200 when updating escape password - /api/center/escape/[center] PATCH', (done) => {
      chai.request(server)
        .patch('/api/center/escape/' + centerId)
        .set('Authorization', jwt)
        .send({password: 'test'}) // send our modified object
        .end( (err, res) => {
          res.body.should.have.property('message');
          res.should.have.status(200);
          done();
        });
    });
    it('should return 200 when checking the password, message = true - /api/center/escape/[center] POST', (done) => {
      chai.request(server)
        .post('/api/center/escape/' + centerId)
        .set('Authorization', jwt)
        .send({password: 'test'}) // send our modified object
        .end( (err, res) => {
          res.body.should.have.property('message');
          res.body.message.should.equal(status.ESCAPE_COMPARE_TRUE.message);
          res.should.have.status(200);
          done();
        });
    });
    it('should return 200 when checking the password (wrong), message = false - /api/center/escape/[center] POST', (done) => {
      chai.request(server)
        .post('/api/center/escape/' + centerId)
        .set('Authorization', jwt)
        .send({password: 'wrong'}) // wrong password
        .end( (err, res) => {
          res.body.should.have.property('message');
          res.body.message.should.equal(status.ESCAPE_COMPARE_FALSE.message);
          res.should.have.status(200);
          done();
        });
    });
  });
});
