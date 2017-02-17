const Validator = require('jsonschema').Validator;

// validator
let v = new Validator();

// Refactored to make things sliiiightly easier to read.

let languageSchema = {
  "id": "/language",
  "type": "object",
  // minProperties: At least one langauge.
  "minProperties": 1,
  "additionalProperties": false,

  "patternProperties": {
    "^[a-z]{2}$": { // match 2 characters from a to z: i.e. language (no, en)
      "type": "object",
      "properties": {
        "txt": { "type": "string", "pattern": /\S/ },
        "options": {
          "type": "array",
          "items": { "type": "string", "pattern": /\S/, "required": true },  // required here forces the string type, else "undefined" would be allowed
          "minItems": 2, // must be at least two options
          "maxItems": 6, // max 6 options
          "uniqueItems": true // the options must be different
        },
        "required": true,
      },
      "required": ["txt", "options"],
      "additionalProperties": false,
    },
  },
}


// This is the questionSchema -- part of the surveySchema, added through reference.
let questionSchema = {
  "id": "/question",
  "type": "object",
  "properties": {
    "_id": { "type": "string" }, // mongodb sends surveys back to client with this property. Not required.
    "mode": { "enum": [ "binary", "star", "multi", "smily", "text" ] },
    "answer": { "type": "array", "items": { "type": "integer", "minimum": 0, "required": true } }, // required here forces the integer type, else "undefined" would be allowed
    "lang": {
      "$ref": "/language", // references the languageSchema above here
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
    "comment": { "type": "string" }, // ADMIN only comment. Not required. Any type of string allowed.
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
// to the languageSchema and the questionSchema
v.addSchema(questionSchema, "/question");
v.addSchema(languageSchema, "/language");

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
