const Validator = require('jsonschema').Validator;

// validators
let surveyValidator = new Validator();
let responseValidator = new Validator();
let centerValidator = new Validator();
let folderValidator = new Validator();

// SURVEY VALIDATION

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
          "minItems": 2,
          "maxItems": 6, // max 6 options
          "uniqueItems": true // the options must be different
        },
        "required": true,
      },
      "required": ["txt"],
      "additionalProperties": false,
    },
  },
}


// This is the questionSchema -- part of the surveySchema, added through reference.
let questionSchema = {
  "id": "/question",
  "type": "object",
  "properties": {
    "_id": { "type": "string", "pattern": /^[0-9a-fA-F]{24}$/ }, // mongodb sends surveys back to client with this property. Not required.
    "mode": { "enum": [ "binary", "star", "single", "multi", "smiley", "text" ] },
    "lang": {
      "$ref": "/language", // references the languageSchema above here
    },
    "imageLink": { "type": "string", "pattern": /(https):\/\/[\w-]+(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-]*[\w@?^=%&amp;\/~+#-])?/ },
    "required": { "type": "boolean" }
  },
  "required": ["mode", "lang", "required"],
  "additionalProperties": false,
}

// main survey schema.
let surveySchema = {
  // survey is of type object
  "type": "object",
  "properties": {
    "_id": { "type": "string", "pattern": /^[0-9a-fA-F]{24}$/ }, // mongodb sends surveys back to client with this property. Not required.
    "center": { "type": "string", "pattern": /^[0-9a-fA-F]{24}$/ },
    "madeBy": { "type": "string", "pattern": /^[0-9a-fA-F]{24}$/ },
    "isPost": { "type": "boolean" }, // defines if a survey is a post in the pre-post system. required
    "postKey": { "type": "string", "pattern": /^[0-9a-fA-F]{24}$/ }, // ID of a post survey should one be created for this survey. Not required.
    "__v": { "type": "integer" }, // mongodb sends surveys back to client with this property. Not required.
    "comment": { "type": "string" }, // ADMIN only comment. Not required. Any type of string allowed.
    "name": { "type": "string", "pattern": /\S/ },
    "date": { "type": "string", "format": "date-time" },
    "activationDate": { "type": "string", "format": "date-time" },
    "deactivationDate": { "type": "string", "format": "date-time" },
    "active": { "type": "boolean" },
    "questionlist": {
      // questionlist is an array of objects
      "type": "array",
      "items": {
        "$ref": "/question", // references the questionSchema above here
      },
      "minItems": 1,
    },
    endMessage: {
      "type": "object",
      "properties": {
        "en": { "type": "string", "pattern": /\S/ },
        "no": { "type": "string", "pattern": /\S/ }
      },
      "required": ["no"]
    }
  },
  "required": ["name", "questionlist", "endMessage", "isPost", "madeBy", "center"],
  "additionalProperties": false
}

// make sure our validator understands the reference
// to the languageSchema and the questionSchema
surveyValidator.addSchema(questionSchema, "/question");
surveyValidator.addSchema(languageSchema, "/language");




// RESPONSE VALIDATION

let responseSchema = {
  "type": "object",
  "properties": {
    "_id": { "type": "string", "pattern": /^[0-9a-fA-F]{24}$/ }, // mongodb sends responses back to client with this property. Not required.
    "nickname": { "type": "string" },
    "surveyId": { "type": "string", "pattern": /^[0-9a-fA-F]{24}$/ },
    "questionlist": {
      "type": "array",
      "items": {
        "type": ["number", "string", "array"]
      },
      "minItems": 1,
    }
  },
  "required": ["surveyId", "questionlist"],
  "additionalProperties": false,
}


// CENTER VALIDATION


let centerSchema = {
  "type": "object",
  "properties": {
    "_id": { "type": "string", "pattern": /^[0-9a-fA-F]{24}$/ }, // mongodb sends responses back to client with this property. Not required.
    "name": { "type": "string" },
    "pathToLogo": { "type": "string" },
    "password": { "type": "string", "pattern": /^[0-9]+$/ }
  },
  "required": ["name"],
  "additionalProperties": false,
}


// FOLDER VALIDATION

let folderSchema = {
  "type": "object",
  "properties": {
    "_id": { "type": "string", "pattern": /^[0-9a-fA-F]{24}$/ }, // mongodb sends responses back to client with this property. Not required.
    "user": { "type": "string", "pattern": /^[0-9a-fA-F]{24}$/ },
    "title": { "type": "string" },
    "isRoot": { "type": "boolean" },
    "folders": {
      "type": "array",
      "items": {
        "type": "string", "pattern": /^[0-9a-fA-F]{24}$/
      },
    },
    "surveys": {
      "type": "array",
      "items": {
        "type": "string", "pattern": /^[0-9a-fA-F]{24}$/
      },
    },
  },
  "required": ["title", "user"],
  "additionalProperties": false,
}



// export our surveyValidation function.
exports.surveyValidation = function(receivedSurvey, debug) {
  let validation = surveyValidator.validate(receivedSurvey, surveySchema);
  // undo comment below to get full debug stack of the validation
  if (debug) {
    console.log(validation);
  }
  //
  return validation.valid;
}

// export our responseValidation function.
exports.responseValidation = function(receivedResponse, debug) {
  let validation = responseValidator.validate(receivedResponse, responseSchema);
  // undo comment below to get full debug stack of the validation
  if (debug) {
    console.log(validation);
  }
  //
  return validation.valid;
}

// export our centerValidation function.
exports.centerValidation = function(receivedCenter, debug) {
  let validation = centerValidator.validate(receivedCenter, centerSchema);
  // undo comment below to get full debug stack of the validation
  if (debug) {
    console.log(validation);
  }
  //
  return validation.valid;
}

// export our folderValidation function.
exports.folderValidation = function(receivedFolder, debug) {
  let validation = folderValidator.validate(receivedFolder, folderSchema);
  // undo comment below to get full debug stack of the validation
  if (debug) {
    console.log(validation);
  }
  //
  return validation.valid;
}
