process.env.NODE_ENV = 'test';
let server = require('../index');
let expect = require("chai").expect;
let val = require('../libs/validation.js');

// MAKE SURE THIS ONE IS ACTUALLY VALID!
let validJsonObject = {
  "nickname": "Ruffsetufs",
  "surveyId": "58c3ea706781233f8a790f63",
  "questionlist": [0, 3, 4, 5, "hello", [1,2,4], -1, 4]
}

describe('Response validation', () => {
  // Set up for each test
  let clone = {};
  beforeEach(function(done){
    clone = JSON.parse(JSON.stringify(validJsonObject));
    done();
  });


  it('should validate a fully valid response json object', (done) => {
    let IsItValid = val.responseValidation(validJsonObject);
    expect(IsItValid).to.equal(true);
    done();
  });

  it('should not validate a fully valid response json object with additional properties', (done) => {
    // make sure clone validates correctly.
    let IsItValid = val.responseValidation(clone);
    expect(IsItValid).to.equal(true);

    // add additional property to root of json object
    clone.additionalProperty = {};
    IsItValid = val.responseValidation(clone);
    expect(IsItValid).to.equal(false);

    done();
  });


  it('should not validate on missing or surveyId name property', (done) => {
    // make sure clone validates correctly.
    let IsItValid = val.responseValidation(clone);
    expect(IsItValid).to.equal(true);

    // check emtpy string
    clone.surveyId = "";
    IsItValid = val.responseValidation(clone);
    expect(IsItValid).to.equal(false);

    // check whitespace
    clone.surveyId = " "
    IsItValid = val.responseValidation(clone);
    expect(IsItValid).to.equal(false);

    // check undefined
    clone.surveyId = undefined;
    IsItValid = val.responseValidation(clone);
    expect(IsItValid).to.equal(false);

    // check null
    clone.surveyId = null;
    IsItValid = val.responseValidation(clone);
    expect(IsItValid).to.equal(false);

    // check nonexistant
    delete clone.surveyId;
    IsItValid = val.responseValidation(clone);
    expect(IsItValid).to.equal(false);

    done();
  });

  it('should validate the nickname property', (done) => {
    // make sure clone validates correctly.
    let IsItValid = val.responseValidation(clone);
    expect(IsItValid).to.equal(true);

    // check actual valid string
    clone.nickname = "Bob the builder";
    IsItValid = val.responseValidation(clone);
    expect(IsItValid).to.equal(true);

    // check undefined
    clone.nickname = undefined;
    IsItValid = val.responseValidation(clone);
    expect(IsItValid).to.equal(true); // Undefined allowed

    // check null
    clone.nickname = null;
    IsItValid = val.responseValidation(clone);
    expect(IsItValid).to.equal(false);

    // check nonexistant
    delete clone.nickname;
    IsItValid = val.responseValidation(clone);
    expect(IsItValid).to.equal(true); // should validate without the nickname.

    done();
  });

  it('should not validate on missing or bad questionlist property', (done) => {
    // make sure clone validates correctly.
    let IsItValid = val.responseValidation(clone);
    expect(IsItValid).to.equal(true);

    // check wrong type
    clone.questionlist = "";
    IsItValid = val.responseValidation(clone);
    expect(IsItValid).to.equal(false);

    // check undefined
    clone.questionlist = undefined;
    IsItValid = val.responseValidation(clone);
    expect(IsItValid).to.equal(false);

    // check null
    clone.questionlist = null;
    IsItValid = val.responseValidation(clone);
    expect(IsItValid).to.equal(false);

    // check nonexistant
    delete clone.questionlist;
    IsItValid = val.responseValidation(clone);
    expect(IsItValid).to.equal(false);

    // check empty array (min 1 required)
    clone.questionlist = [];
    IsItValid = val.responseValidation(clone);
    expect(IsItValid).to.equal(false);

    done();
  });
});
