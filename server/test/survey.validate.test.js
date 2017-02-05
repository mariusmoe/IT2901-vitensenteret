process.env.NODE_ENV = 'test';
let server = require('../index');
let expect = require("chai").expect;
let val = require('../libs/validation.js');

// MAKE SURE THIS ONE IS ACTUALLY VALID!
let validJsonObject = {
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
      "options": ["UTROLIG","kuuuuul","teit jernplanet"]
      }
    ,
    "answer": [1,3,3,3,3]
  }]
}


describe('Survey validation', function() {
  // Set up for each test
  let clone = {};
  beforeEach(function(done){
    clone = JSON.parse(JSON.stringify(validJsonObject));
    done();
  });


  it('should validate a fully valid survey json object', function(done) {
    let IsItValid = val.surveyValidation(validJsonObject);
    expect(IsItValid).to.equal(true);
    done();
  });

  it('should not validate a fully valid survey json object with additional properties', function(done) {
    // make sure clone validates correctly.
    let IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true);

    // add additional property to root of json object
    clone.additionalProperty = {};
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // revert
    delete clone.additionalProperty
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true);

    // check for questionlist
    clone.questionlist[0].additionalProperty = {};
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // revert
    delete clone.questionlist[0].additionalProperty
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true);

    // check for questionlist language
    clone.questionlist[0].eng.additionalProperty = {};
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    done();
  });

  it('should not validate on missing or bad name property', function(done) {
    // make sure clone validates correctly.
    let IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true);

    // check emtpy string
    clone.name = "";
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check whitespace
    clone.name = " "
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check whitespace 2
    clone.name = "       "
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check whitespace 3
    clone.name = "       \n"
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check undefined
    clone.name = undefined;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check null
    clone.name = null;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check nonexistant
    delete clone.name;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    done();
  });

  it('should not validate on missing or bad date property', function(done) {
    // make sure clone validates correctly.
    let IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true);

    // check emtpy string
    clone.date = "";
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check whitespace
    clone.date = " "
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check whitespace 2
    clone.date = "       "
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check whitespace 3
    clone.date = "       \n"
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check undefined
    clone.date = undefined;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check null
    clone.date = null;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check nonexistant
    delete clone.date;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);


    done();
  });


  it('should not validate on missing or bad questionlist property', function(done) {
    // make sure clone validates correctly.
    let IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true);

    // check empty object
    clone.questionlist = {};
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check empty array
    clone.questionlist = [];
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false); // must have questions

    // check undefined
    clone.questionlist = undefined;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check null
    clone.questionlist = null;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check nonexistant
    delete clone.questionlist;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    done();
  });


  it('should not validate on missing or bad questionlist mode property', function(done) {
    // make sure clone validates correctly.
    let IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true);

    // check valid format but not accepted value
    clone.questionlist[0].mode = "tooth";
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check valid format but not accepted value 2
    clone.questionlist[0].mode = "Smiley";
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check emtpy string
    clone.questionlist[0].mode = "";
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check whitespace
    clone.questionlist[0].mode = " "
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check whitespace 2
    clone.questionlist[0].mode = "       "
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check whitespace 3
    clone.questionlist[0].mode = "       \n"
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check undefined
    clone.questionlist[0].mode = undefined;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check null
    clone.questionlist[0].mode = null;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check nonexistant
    delete clone.questionlist[0].mode;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    done();
  });

  it('should not validate on missing or bad questionlist language properties', function(done) {
    // make sure clone validates correctly.
    let IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true);

    // check validity given only one language (the original test data has two)
    let backupEng = JSON.parse(JSON.stringify(clone.questionlist[0].eng))
    delete clone.questionlist[0].eng;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true); // should allow only one language (nor)
    // same test, swapped languages
    clone.questionlist[0].eng = backupEng;
    delete clone.questionlist[0].nor;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true); // should allow only one language (eng)

    // chec validity given ZERO languages
    delete clone.questionlist[0].eng;
    delete clone.questionlist[0].nor;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false); // should not allow no languages.

    done();
  });


  it('should not validate on missing or bad questionlist language txt property', function(done) {
    // make sure clone validates correctly.
    let IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true);

    // check validity of the txt property

    // check emtpy string
    clone.questionlist[0].eng.txt = "";
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check whitespace
    clone.questionlist[0].eng.txt = " "
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check whitespace 2
    clone.questionlist[0].eng.txt = "       "
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check whitespace 3
    clone.questionlist[0].eng.txt = "       \n"
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check undefined
    clone.questionlist[0].eng.txt = undefined;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check null
    clone.questionlist[0].eng.txt = null;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check nonexistant
    delete clone.questionlist[0].eng.txt;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    done();
  });



  it('should not validate on missing or bad questionlist language options property', function(done) {
    // make sure clone validates correctly.
    let IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true);

    // check the validity of the options property

    // check empty object
    clone.questionlist[0].eng.options = {};
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check empty array
    clone.questionlist[0].eng.options = [];
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check undefined
    clone.questionlist[0].eng.options = undefined;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check null
    clone.questionlist[0].eng.options = null;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check nonexistant
    delete clone.questionlist[0].eng.options;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);




    done();
  });



  it('should not validate on missing or bad questionlist language option values', function(done) {
    // make sure clone validates correctly.
    let IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true);

    // check emtpy string
    clone.questionlist[0].eng.options[0] = "";
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check whitespace
    clone.questionlist[0].eng.options[0] = " "
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check whitespace 2
    clone.questionlist[0].eng.options[0] = "       "
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check whitespace 3
    clone.questionlist[0].eng.options[0] = "       \n"
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check undefined
    clone.questionlist[0].eng.options[0] = undefined;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check null
    clone.questionlist[0].eng.options[0] = null;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    done();
  });


  it('should not validate on missing or bad questionlist language option array-properties', function(done) {
    // make sure clone validates correctly.
    let IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true);

    // check emtpy array
    clone.questionlist[0].eng.options = [];
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check only one option (should be 2)
    clone.questionlist[0].eng.options = ["option1"];
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check two options (should be valid)
    clone.questionlist[0].eng.options = ["option1", "option2"];
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true);


    done();
  });

  it('should not validate on missing or bad questionlist answer property', function(done) {
    // make sure clone validates correctly.
    let IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true);


    // check empty object
    clone.questionlist[0].answer = {};
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check empty array
    clone.questionlist[0].answer = [];
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true); // this should be valid

    // check undefined
    clone.questionlist[0].answer = undefined;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check null
    clone.questionlist[0].answer = null;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check nonexistant
    delete clone.questionlist[0].answer;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    done();
  });


  it('should not validate on missing or bad questionlist answer values', function(done) {
    // make sure clone validates correctly.
    let IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true);

    // check emtpy array
    clone.questionlist[0].answer = [];
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true); // this should be valid

    // check non-integer value
    clone.questionlist[0].answer[0] = 0.5;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check undefined
    clone.questionlist[0].answer[0] = undefined;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check null
    clone.questionlist[0].answer[0] = null;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    done();
  });

});
