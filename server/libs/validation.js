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
  return (typeof s == "string" && s.match(/\S/));
}

let objectVal = function(o) {
  return (typeof o == "object");
}

exports.surveyValidation = function(receivedSurvey) {
  let valid = false;
  // initially check if we have a survey object, with a name and a questionlist.
   valid = objectVal(receivedSurvey) &&
    stringVal(receivedSurvey.name) &&
    objectVal(receivedSurvey.questionlist);


  return valid;
};
