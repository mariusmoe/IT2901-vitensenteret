process.env.NODE_ENV = 'test';

let mongoose = require("mongoose");

let chai = require('chai');
let chaiHttp = require('chai-http');
let server = require('../index');
let should = chai.should();

chai.use(chaiHttp);

describe('Blobs', function() {
  it('should list ALL blobs on /blobs GET');
  it('should list a SINGLE blob on /blob/<id> GET');
  it('should add a SINGLE blob on /blobs POST');
  it('should update a SINGLE blob on /blob/<id> PUT');
  it('should delete a SINGLE blob on /blob/<id> DELETE');
  it('should list ALL blobs on /blobs GET', function(done) {
  chai.request(server)
    .post('/api/auth/login')
    .send({'email': 'mariusomoe@gmail.com', 'password': 'test'})
    .end(function(err, res){
      res.should.have.status(200);
      done();
    });
});
});
