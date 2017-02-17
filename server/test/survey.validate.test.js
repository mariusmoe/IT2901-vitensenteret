process.env.NODE_ENV = 'test';
let server = require('../index');
let expect = require("chai").expect;
let val = require('../libs/validation.js');

// MAKE SURE THIS ONE IS ACTUALLY VALID!
let validJsonObject = {
  "name": "måneraketten3",
  "date": "2012-04-23T18:25:43.511Z",
  "active": true,
  "questionlist": [{
    "mode": "smily",
    // no comment property here. Admin only. see its own test below.
    "answer": [1,3,3,3,3],
    "lang": {
      "en": {
          "txt": "what do you think about mars?",
          "options": ["AWSOME","coooool","blody iron planet"]
      },
      "no": {
        "txt": "Hva synes du om Mars?",
        "options": ["UTROLIG","kuuuuul","teit jernplanet"]
      },
    }
  }],
  "endMessage": {
    "no": "Takk for at du gjennomførte denne undersøkelsen!"
  }
}


describe('Survey validation', () => {
  // Set up for each test
  let clone = {};
  beforeEach(function(done){
    clone = JSON.parse(JSON.stringify(validJsonObject));
    done();
  });


  it('should validate a fully valid survey json object', (done) => {
    let IsItValid = val.surveyValidation(validJsonObject);
    expect(IsItValid).to.equal(true);
    done();
  });

  it('should not validate a fully valid survey json object with additional properties', (done) => {
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

    // check for questionlist lang
    clone.questionlist[0].lang.additionalProperty = {};
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // revert
    delete clone.questionlist[0].lang.additionalProperty
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true);

    // check for questionlist language pattern object
    clone.questionlist[0].lang.en.additionalProperty = {};
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    done();
  });

  it('should not validate on missing or bad name property', (done) => {
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

  it('should validate the admin comment property', (done) => {
    // make sure clone validates correctly.
    let IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true); // no comment added yet; its not required.

    // check actual valid string
    clone.comment = "This survey was made for test purposes; demographic: testonians";
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true);

    // check undefined
    clone.comment = undefined;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true); // Undefined allowed

    // check null
    clone.comment = null;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check nonexistant
    delete clone.comment;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true); // should validate without the comment.

    done();
  });

  it('should not validate on missing or bad date property', (done) => {
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

    // check non-date format
    clone.date = "someNonDateFormatString"
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


    it('should not validate on missing or bad active property', (done) => {
      // make sure clone validates correctly.
      let IsItValid = val.surveyValidation(clone);
      expect(IsItValid).to.equal(true);

      // check wrong type
      clone.active = "Hello";
      IsItValid = val.surveyValidation(clone);
      expect(IsItValid).to.equal(false);


      // check undefined
      clone.active = undefined;
      IsItValid = val.surveyValidation(clone);
      expect(IsItValid).to.equal(false);

      // check null
      clone.active = null;
      IsItValid = val.surveyValidation(clone);
      expect(IsItValid).to.equal(false);

      // check nonexistant
      delete clone.active;
      IsItValid = val.surveyValidation(clone);
      expect(IsItValid).to.equal(false);


      done();
    });


  it('should not validate on missing or bad questionlist property', (done) => {
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


  it('should not validate on missing or bad questionlist mode property', (done) => {
    // make sure clone validates correctly.
    let IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true);

    // check valid format but not accepted value
    clone.questionlist[0].mode = "tooth";
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check valid format but not accepted value 2
    clone.questionlist[0].mode = "Smiley"; // should be 'smily'
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check accepted values:
    let accepted_values = ['binary', 'star', 'multi', 'smily', 'text'];
    for (let value of accepted_values) {
      clone.questionlist[0].mode = value;
      IsItValid = val.surveyValidation(clone);
      expect(IsItValid).to.equal(true);
    }

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


  it('should not validate on missing or bad questionlist lang property', (done) => {
    // make sure clone validates correctly.
    let IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true);

    // check empty object
    clone.questionlist[0].lang = {};
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);  // must have languages

    // check empty array
    clone.questionlist[0].lang = []; // wrong type
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check undefined
    clone.questionlist[0].lang = undefined;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check null
    clone.questionlist[0].lang = null;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check nonexistant
    delete clone.questionlist[0].lang;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    done();
  });


  it('should not validate on missing or bad questionlist lang pattern properties', (done) => {
    // make sure clone validates correctly.
    let IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true);

    // check validity given only one language (the original test data has two)
    let backupEn = JSON.parse(JSON.stringify(clone.questionlist[0].lang.en))
    delete clone.questionlist[0].lang.en;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true); // should allow only one language (nor)
    // same test, swapped languages
    clone.questionlist[0].lang.en = backupEn;
    delete clone.questionlist[0].lang.no;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true); // should allow only one language (eng)

    // chec validity given ZERO languages
    delete clone.questionlist[0].lang.en;
    delete clone.questionlist[0].lang.no;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false); // should not allow no languages.

    done();
  });


  it('should not validate on missing or bad questionlist lang pattern txt property', (done) => {
    // make sure clone validates correctly.
    let IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true);

    // check validity of the txt property

    // check emtpy string
    clone.questionlist[0].lang.en.txt = "";
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check whitespace
    clone.questionlist[0].lang.en.txt = " "
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check whitespace 2
    clone.questionlist[0].lang.en.txt = "       "
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check whitespace 3
    clone.questionlist[0].lang.en.txt = "       \n"
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check undefined
    clone.questionlist[0].lang.en.txt = undefined;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check null
    clone.questionlist[0].lang.en.txt = null;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check nonexistant
    delete clone.questionlist[0].lang.en.txt;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    done();
  });



  it('should not validate on missing or bad questionlist lang pattern options property', (done) => {
    // make sure clone validates correctly.
    let IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true);

    // check the validity of the options property

    // check empty object
    clone.questionlist[0].lang.en.options = {};
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check empty array
    clone.questionlist[0].lang.en.options = [];
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check only one option
    clone.questionlist[0].lang.en.options = ["onlyOneOption"];
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check two options
    clone.questionlist[0].lang.en.options = ["one", "two"];
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true);

    // check six options
    clone.questionlist[0].lang.en.options = ["one", "two", "three", "four", "five", "six"];
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true);

    // check seven options
    clone.questionlist[0].lang.en.options = ["one", "two", "three", "four", "five", "six", "seven"];
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check undefined
    clone.questionlist[0].lang.en.options = undefined;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check null
    clone.questionlist[0].lang.en.options = null;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check nonexistant
    delete clone.questionlist[0].lang.en.options;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);




    done();
  });



  it('should not validate on missing or bad questionlist lang pattern option values', (done) => {
    // make sure clone validates correctly.
    let IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true);

    // check emtpy string
    clone.questionlist[0].lang.en.options[0] = "";
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check whitespace
    clone.questionlist[0].lang.en.options[0] = " "
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check whitespace 2
    clone.questionlist[0].lang.en.options[0] = "       "
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check whitespace 3
    clone.questionlist[0].lang.en.options[0] = "       \n"
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check undefined
    clone.questionlist[0].lang.en.options[0] = undefined;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check null
    clone.questionlist[0].lang.en.options[0] = null;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    done();
  });


  it('should not validate on missing or bad questionlist lang pattern option array-properties', (done) => {
    // make sure clone validates correctly.
    let IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true);

    // check emtpy array
    clone.questionlist[0].lang.en.options = [];
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check only one option (should be 2)
    clone.questionlist[0].lang.en.options = ["option1"];
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check two options (should be valid)
    clone.questionlist[0].lang.en.options = ["option1", "option2"];
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true);


    done();
  });

  it('should not validate on missing or bad questionlist answer property', (done) => {
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


  it('should not validate on missing or bad questionlist answer values', (done) => {
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



  it('should not validate on missing or bad endMessage property', (done) => {
    // make sure clone validates correctly.
    let IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true);

    // check empty object
    clone.endMessage = {};
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check empty array
    clone.endMessage = [];
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false); // must have questions

    // check undefined
    clone.endMessage = undefined;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check null
    clone.endMessage = null;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check nonexistant
    delete clone.endMessage;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    done();
  });

  it('should not validate on missing or bad endMessage properties', (done) => {
    // make sure clone validates correctly.
    let IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true);

    // no is required. en is optional.

    // check emtpy string
    clone.endMessage.no = "";
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check whitespace
    clone.endMessage.no = " "
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check whitespace 2
    clone.endMessage.no = "       "
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check whitespace 3
    clone.endMessage.no = "       \n"
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check undefined
    clone.endMessage.no = undefined;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check null
    clone.endMessage.no = null;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // revert
    clone.endMessage.no = validJsonObject.endMessage.no;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true);



    // and again for en


    // check valid string
    clone.endMessage.en = "Thank you!";
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true);

    // check emtpy string
    clone.endMessage.en = "";
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check whitespace
    clone.endMessage.en = " "
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check whitespace 2
    clone.endMessage.en = "       "
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check whitespace 3
    clone.endMessage.en = "       \n"
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    // check undefined
    clone.endMessage.en = undefined;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true); // true!

    // check null
    clone.endMessage.en = null;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);




    // check nonexistant for both:
    delete clone.endMessage.en;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(true);

    // check nonexistant
    delete clone.endMessage.no;
    IsItValid = val.surveyValidation(clone);
    expect(IsItValid).to.equal(false);

    done();
  });

});
