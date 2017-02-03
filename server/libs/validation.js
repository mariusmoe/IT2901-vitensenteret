/*

name: {
  type: String
},
date: Date,
questionlist: [{
  mode: {
      type: String,
      enum: ['smily', 'text'],
      default: 'smily'
    },
  eng: {
    txt: String,
    options: [String]
    },
  nor: {
    txt: String,
    options: [String]
  },
  answer: [Number]
}]
*/

let stringVal = function(s) {
  // match any non-white-space-character
  return s && typeof s === "string" && s.match(/^\s*$/);
}

let objectVal = function(o) {
  return o && typeof o === "object";
}

exports.surveyValidation = function(receivedSurvey) {

  // initially check if we have a survey object, with a name and a questionlist.
  let valid = objectVal(receivedSurvey) &&
    stringVal(receivedSurvey.name) &&
    objectVal(receivedSurvey.questionlist);

  // further check the questionlist for validity
  if (valid) {
    // for each question
    for (let i = 0; i < receivedSurvey.questionlist; i++) {
      // make sure there exists a mode
      valid = valid && stringVal(receivedSurvey.questionlist[i].mode);
      if (valid) {
        // for each language option, we check these independently.
        for (let lang in ['eng', 'nor']) {
          let langIsValid = objectVal(receivedSurvey.questionlist[i][lang]) && receivedSurvey.questionlist[i][lang].options;
          if (langIsValid) {
            // if lang is valid, we do checks for the question text and the alternatives for said question
            langIsValid = langIsValid && stringVal(receivedSurvey.questionlist[i][lang].txt);
            // for each alternative to the question
            for (let j = 0; j < receivedSurvey.questionlist[i][lang].options) {
              langIsValid = langIsValid && stringVal(receivedSurvey.questionlist[i][lang].options[j]);
            }
            // still within the if check, we make sure that IF AND ONLY IF the langauge was valid, we change up the validity of the whole survey.
            valid = valid && langIsValid;
          }
        }
      }
    }
  }
  return valid;
};
