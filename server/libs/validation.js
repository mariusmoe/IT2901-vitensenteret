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
    "mode": { "enum": [ "smily", "text" ] },
    "answer": { "type": "array", "items": { "type": "integer", "minimum": 0, "required": true } } // required here forces the integer type, else "undefined" would be allowed
  },
  "patternProperties": {
    "^[a-z]{3}$": { // match 3 characters from a to z: i.e. language (nor, eng)
      "type": "object",
      "properties": {
        "txt": { "type": "string", "pattern": /\S/ },
        "options": {
          "type": "array",
          "items": { "type": "string", "pattern": /\S/, "required": true },  // required here forces the string type, else "undefined" would be allowed
          "minItems": 2, // must be at least two options
          "uniqueItems": true // the options must be different
        }
      },
      "required": ["txt", "options"],
      "additionalProperties": false
    },
  },
  // minProperties: mode and answer, plus at least one langauge. UPDATE ME IF THE ABOVE CHANGES!
  "minProperties": 3,
  "required": ["mode", "answer"], // it is assumed that properties that match the patternProperties
  "additionalProperties": false // will NOT trigger this additionalProperties check, and thus be valid.
}

// main survey schema.
let surveySchema = {
  // survey is of type object
  "type": "object",
  "properties": {
    // and it has the following properties
    "name": { "type": "string", "pattern": /\S/ },
    "date": { "type": "string", "format": "date-time" },
    "questionlist": {
      // questionlist is an array of objects
      "type": "array",
      "items": {
        "$ref": "/question", // references the questionSchema above here
      },
      "minItems": 1,
    }
  },
  "required": ["name", "date", "questionlist"],
  "additionalProperties": false
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
