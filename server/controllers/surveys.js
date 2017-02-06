"use strict";

const validator = require('validator'),
      status = require('../status'),
      Survey = require('../models/survey'),
      jsonfile = require('jsonfile'),
      fs = require('fs'),
      config = require('config'),
      val = require('../libs/validation.js');

// exports.getAllSurveys = (req, res, next) => {
//
//
// }

exports.createSurvey = (req, res, next) => {
  let receivedSurvey = req.body

  // console.log(val.surveyValidation(receivedSurvey));
  if (!val.surveyValidation(receivedSurvey)){
    return res.status(422).send( {error: status.SURVEY_UNPROCESSABLE.message, status: status.SURVEY_UNPROCESSABLE.code})
  }

  let newSurvey = new Survey ( receivedSurvey )

  newSurvey.save((err, survey) => {
    if (err) {return next(err); }
    return res.status(200).send( survey );
  })
}

exports.getOneSurvey = (req, res, next) => {
  const surveyId = req.params.surveyId
  if (!surveyId) {
    return res.status(400).send( {error: status.CAN_NOT_FIND_SURVEY.message, status: status.CAN_NOT_FIND_SURVEY.code})
  }
  Survey.findById( surveyId, (err, survey) => {
    if (err) { return next(err); }
    if (!survey) {
      return res.status(404).send({error: status.CAN_NOT_FIND_SURVEY.message, status: status.CAN_NOT_FIND_SURVEY.code});
    }
    return res.status(200).send(survey);
  });
}

exports.patchOneSurvey = (req, res, next) => {
  const surveyId = req.params.surveyId;
  if (!surveyId) {
    return res.status(400).send( {error: status.CAN_NOT_FIND_SURVEY.message, status: status.CAN_NOT_FIND_SURVEY.code})
  }
  let survey = req.body;
  if (!survey) {
    return res.status(400).send( {error: status.CAN_NOT_FIND_SURVEY.message, status: status.CAN_NOT_FIND_SURVEY.code})
  }
  if (!val.surveyValidation(survey)){
    return res.status(422).send( {error: status.SURVEY_UNPROCESSABLE.message, status: status.SURVEY_UNPROCESSABLE.code})
  }
  Survey.findByIdAndUpdate( surveyId, survey, {new: true}, (err, survey) => {
    if (err) { return next(err); }
    if (!survey) {
      return res.status(404).send({error: status.CAN_NOT_FIND_SURVEY.message, status: status.CAN_NOT_FIND_SURVEY.code});
    }
    return res.status(200).send({message: 'Accepted - survey has been altered', survey: survey})
  });
}

exports.deleteOneSurvey = (req, res, next) => {
  const surveyId = req.params.surveyId
  if (!surveyId) {
    return res.status(400).send( {error: status.CAN_NOT_FIND_SURVEY.message, status: status.CAN_NOT_FIND_SURVEY.code})
  }
  Survey.findByIdAndRemove( surveyId, (err, survey) => {
    if (err) { return next(err); }
    if (!survey) {
      return res.status(404).send({error: status.CAN_NOT_FIND_SURVEY.message, status: status.CAN_NOT_FIND_SURVEY.code});
    }
    return res.status(200).send({message: 'Success! - it is no more'});
  });
}

exports.getAllSurveysAsJson = (req, res, next) => {
  Survey.find({}, (err, surveys) => {
    if (err) { return next(err); }
    if (!surveys) {
      return res.status(404).send({error: status.CAN_NOT_FIND_SURVEY.message, status: status.CAN_NOT_FIND_SURVEY.code});
    }

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

// exports.getSurveyAsJson = (req, res, next) => {
//   const surveyId = req.params.surveyId
//   if (!surveyId) {
//     return res.status(400).send( {error: status.CAN_NOT_FIND_SURVEY.message, status: status.CAN_NOT_FIND_SURVEY.code})
//   }
//   Survey.findById( surveyId, (err, survey) => {
//     if (err) { return next(err); }
//     if (!survey) {
//       return res.status(404).send({error: status.CAN_NOT_FIND_SURVEY.message, status: status.CAN_NOT_FIND_SURVEY.code});
//     }
//     return res.status(200).send(survey);
//   });
// }
