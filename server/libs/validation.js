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
    "_id": { "type": "string" }, // mongodb sends surveys back to client with this property. Not required.
    "mode": { "enum": [ "smily", "text" ] },
    "answer": { "type": "array", "items": { "type": "integer", "minimum": 0, "required": true } }, // required here forces the integer type, else "undefined" would be allowed
    "lang": {
      "type": "object",
      "patternProperties": {
        "^[a-z]{2}$": { // match 3 characters from a to z: i.e. language (nor, eng)
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
      // minProperties: At least one langauge. UPDATE ME IF THE ABOVE CHANGES!
      "minProperties": 1,
      "required": true,
      "additionalProperties": false,
    },
  },
  "required": ["mode", "answer", "lang"],
  "additionalProperties": false,
}

// main survey schema.
let surveySchema = {
  // survey is of type object
  "type": "object",
  "properties": {
    "_id": { "type": "string" }, // mongodb sends surveys back to client with this property. Not required.
    "__v": { "type": "integer" }, // mongodb sends surveys back to client with this property. Not required.
    "name": { "type": "string", "pattern": /\S/ },
    "date": { "type": "string", "format": "date-time" },
    "active": { "type": "boolean" },
    "questionlist": {
      // questionlist is an array of objects
      "type": "array",
      "items": {
        "$ref": "/question", // references the questionSchema above here
      },
      "minItems": 1,
    }
  },
  "required": ["name", "date", "active", "questionlist"],
  "additionalProperties": false
}

// make sure our validator understands the reference
// to the questionSchema in the surveySchema
v.addSchema(questionSchema, "/question");

// export our surveyValidation function.
exports.surveyValidation = function(receivedSurvey, debug) {
  let validation = v.validate(receivedSurvey, surveySchema);
  // undo comment below to get full debug stack of the validation
  if (debug) {
    console.log(validation);
  }
  //
  return validation.valid;
}
