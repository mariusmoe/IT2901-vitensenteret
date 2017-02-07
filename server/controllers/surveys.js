"use strict";

const validator = require('validator'),
      status = require('../status'),
      Survey = require('../models/survey'),
      jsonfile = require('jsonfile'),
      fs = require('fs'),
      config = require('config'),
      val = require('../libs/validation.js');





// POST
exports.createSurvey = (req, res, next) => {
  let receivedSurvey = req.body;

  // make sure it isn't just an empty object.
  if (Object.keys(receivedSurvey).length === 0) {
    return res.status(400).send( {message: status.SURVEY_OBJECT_MISSING.message, status: status.SURVEY_OBJECT_MISSING.code})
  }
  if (!val.surveyValidation(receivedSurvey)){
    return res.status(422).send( {message: status.SURVEY_UNPROCESSABLE.message, status: status.SURVEY_UNPROCESSABLE.code})
  }

  let newSurvey = new Survey ( receivedSurvey )

  newSurvey.save((err, survey) => {
    if (err) {return next(err); }
    return res.status(200).send( survey );
  })
}


// GET
exports.getAllSurveys = (req, res, next) => {
  // TODO: Change me so that I return only id and name!

  Survey.find( {}, (err, surveys) => {
    if (!surveys) {
      // essentially means not one survey exists that match {} - i.e. 0 surveys in db? should be status: 200, empty list then?
    }
    if (err) { return next(err); }

    return res.status(200).send(surveys);
  });

}
exports.getOneSurvey = (req, res, next) => {
  const surveyId = req.params.surveyId;
  // ROUTER checks for existence of surveyId. no need to have a check here as well.
  Survey.findById( surveyId, (err, survey) => {
    if (!survey) {
      return res.status(404).send({message: status.SURVEY_NOT_FOUND.message, status: status.SURVEY_NOT_FOUND.code});
    }
    if (err) { return next(err); }

    return res.status(200).send(survey);
  });
}



// PATCH
exports.patchOneSurvey = (req, res, next) => {
  const surveyId = req.params.surveyId;
  // ROUTER checks for existence of surveyId. no need to have a check here as well.

  let survey = req.body;
  // make sure it isn't just an empty object.
  if (Object.keys(survey).length === 0) {
    return res.status(400).send( {message: status.SURVEY_OBJECT_MISSING.message, status: status.SURVEY_OBJECT_MISSING.code})
  }
  if (!val.surveyValidation(survey)){
    return res.status(422).send( {message: status.SURVEY_UNPROCESSABLE.message, status: status.SURVEY_UNPROCESSABLE.code})
  }
  // Set ID
  survey._id = surveyId;
  Survey.findByIdAndUpdate( surveyId, {$set: survey, $inc: { __v: 1 }}, {new: true, }, (err, survey) => {
    if (!survey) {
      return res.status(404).send({message: status.SURVEY_NOT_FOUND.message, status: status.SURVEY_NOT_FOUND.code});
    }
    if (err) { return next(err); }
    return res.status(200).send({message: status.SURVEY_UPDATED.message, status: status.SURVEY_UPDATED.code, survey: survey})
  });
}

// DELETE
exports.deleteOneSurvey = (req, res, next) => {
  const surveyId = req.params.surveyId
  // ROUTER checks for existence of surveyId. no need to have a check here as well.

  Survey.findByIdAndRemove( surveyId, (err, survey) => {
    if (!survey) {
      return res.status(404).send({message: status.SURVEY_NOT_FOUND.message, status: status.SURVEY_NOT_FOUND.code});
    }
    if (err) { return next(err); }
    return res.status(200).send({message: 'Success! - it is no more'});
  });
}


// JSON


exports.getAllSurveysAsJson = (req, res, next) => {
  Survey.find({}, (err, surveys) => {
    if (!surveys) {
      return res.status(404).send({message: status.SURVEY_NOT_FOUND.message, status: status.SURVEY_NOT_FOUND.code});
    }
    if (err) { return next(err); }

    const file = 'temp/data.json';

    jsonfile.writeFile(file, surveys, {spaces: 2}, function(err) {
      // return res.status(200).download( file );
      res.download(file, 'report.pdf', function(err){
      if (err) {
        // Handle error, but keep in mind the response may be partially-sent
        // so check res.headersSent
        fs.unlink('temp/data.json', (err) => {
          if (err) {console.error(err);};
          if(config.util.getEnv('NODE_ENV') !== 'test') {
              console.log('SUCCESS - successfully deleted temp/data.json');
            };
          });
      } else {
        // decrement a download credit, etc.
        fs.unlink('temp/data.json', (err) => {
          if (err) {console.error(err);};
          // console.log(config.util.getEnv('NODE_ENV'));
          if(config.util.getEnv('NODE_ENV') !== 'test') {
              console.log('SUCCESS - successfully deleted temp/data.json');
            };
        });
      }
      });
    });
  });
}

exports.getSurveyAsJson = (req, res, next) => {
  const surveyId = req.params.surveyId
  if (!surveyId) {
    return res.status(400).send( {message: status.SURVEY_NOT_FOUND.message, status: status.SURVEY_NOT_FOUND.code})
  }
  Survey.findById(surveyId, (err, survey) => {
    if (!survey) {
      return res.status(404).send({message: status.SURVEY_NOT_FOUND.message, status: status.SURVEY_NOT_FOUND.code});
    }
    if (err) { return next(err); }

    const file = 'temp/data.json';

    jsonfile.writeFile(file, survey, {spaces: 2}, function(err) {
      // return res.status(200).download( file );
      // TODO: GIVE THE REPORT A BETTER NAME!
      res.download(file, 'report.json', function(err){
      if (err) {
        // Handle error, but keep in mind the response may be partially-sent
        // so check res.headersSent
        fs.unlink('temp/data.json', (err) => {
          if (err) {console.error(err);};
          if(config.util.getEnv('NODE_ENV') !== 'test') {
              console.log('SUCCESS - successfully deleted temp/data.json');
            };
          });
      } else {
        // decrement a download credit, etc.
        fs.unlink('temp/data.json', (err) => {
          if (err) {console.error(err);};
          // console.log(config.util.getEnv('NODE_ENV'));
          if(config.util.getEnv('NODE_ENV') !== 'test') {
              console.log('SUCCESS - successfully deleted temp/data.json');
            };
        });
      }
      });
    });
  });
}
