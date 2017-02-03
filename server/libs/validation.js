const Validator = require('jsonschema').Validator;

// validator
let v = new Validator();

// Refactoring to make things sliiiightly easier to read.
// the questions are thusly separated into its own schema.

// This is the questionSchema -- part of the surveySchema, added through reference.
let questionSchema = {
  "id": "/question",
  "type": "object",
  "properties": {
    "mode": { "enum": [ "smily", "text" ], "required": true },
    "answer": { "type": "array", "items": { "type": "integer", "minimum": 0, }, "required": true }
  },
  "patternProperties": {
    "^[a-zA-Z]{3}$": { // match 3 characters from a to z: i.e. language (nor, eng)
      "type": "object",
      "properties": {
        "text": { "type": "string", "pattern": /\S/ },
        "options": {
          "type": "array",
          "items": { "type": "string", "pattern": /\S/ },
        }
      },
      "required": true, // set the required flag here. Easier(?)
    },
  },
  "required": ["mode", "answer"]
}

// main survey schema.
let surveySchema = {
  // survey is of type object
  "type": "object",
  "properties": {
    // and it has the following properties
    "name": { "type": "string", "pattern": /\S/ },
    "date": { "type": "string", }, // FIXME: validate the date string! "pattern": something
    "questionlist": {
      // questionlist is an array of objects
      "type": "array",
      "items": {
        "$ref": "/question", // references the questionSchema above here
      }
    }
  },
  "required": ["name", "date", "questionlist"]
}

// make sure our validator understands the reference
// to the questionSchema in the surveySchema
v.addSchema(questionSchema, "/question");

// export our surveyValidation function.
exports.surveyValidation = function(receivedSurvey) {
  let validation = v.validate(receivedSurvey, surveySchema);
  // undo comment below to get full debug stack of the validation
  // console.log(validation);
  return validation.valid;
}






// Old solution for reference / backup.

// let stringVal = function(s) {
//   // match any non-white-space-character
//   return (typeof s == "string" && s.match(/\S/));
// }
//
// let objectVal = function(o) {
//   return (typeof o == "object");
// }

// exports.surveyValidation = function(receivedSurvey) {
//   let valid = false;
//   // initially check if we have a survey object, with a name and a questionlist.
//    valid = objectVal(receivedSurvey) &&
//     stringVal(receivedSurvey.name) &&
//     objectVal(receivedSurvey.questionlist);
//
//   // further check the questionlist for validity
//   if (valid) {
//     // for each question
//     for (let i = 0; i < receivedSurvey.questionlist; i++) {
//       // make sure there exists a mode
//       valid = valid && stringVal(receivedSurvey.questionlist[i].mode);
//       if (valid) {
//         // for each language option, we check these independently.
//         for (let lang in ['eng', 'nor']) {
//           let langIsValid = objectVal(receivedSurvey.questionlist[i][lang])
//             && receivedSurvey.questionlist[i][lang].options;
//           if (langIsValid) {
//             // if lang is valid, we do checks for the question text and the alternatives for said question
//             langIsValid = langIsValid && stringVal(receivedSurvey.questionlist[i][lang].txt);
//             // for each alternative to the question
//             for (let j = 0; j < receivedSurvey.questionlist[i][lang].options; j++) {
//               langIsValid = langIsValid && stringVal(receivedSurvey.questionlist[i][lang].options[j]);
//             }
//             // still within the if check, we make sure that IF AND ONLY IF the
//             // langauge was valid, we change up the validity of the whole survey.
//             valid = valid && langIsValid;
//           }
//         }
//       }
//     }
//
//     return valid;
//   }
// };
