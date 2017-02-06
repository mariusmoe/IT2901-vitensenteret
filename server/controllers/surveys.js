"use strict";

const validator = require('validator'),
      status = require('../status'),
      Survey = require('../models/survey'),
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
