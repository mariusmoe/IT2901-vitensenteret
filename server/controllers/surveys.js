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

  // TODO: write the validator
  if (!val.surveyValidation(receivedSurvey)){
    return res.status(422).send( {error: status.SURVEY_UNPROCESSABLE.message, status: status.SURVEY_UNPROCESSABLE.code})
  }
  // console.log(receivedSurvey);
  // TODO this dos not work!!!!!!!!!!!!!!!!!!!!!!!!!!!
  let newSurvey = new Survey ( receivedSurvey )

  newSurvey.save((err, survey) => {
    if (err) {return next(err); }
    res.status(200).send( survey );
  })
}

exports.getOneSurvey = (req, res, next) => {
  const surveyId = req.params.surveyId
  if (!surveyId) {
    return res.status(400).send( {error: status.CAN_NOT_FIND_SURVEY.message, status: status.CAN_NOT_FIND_SURVEY.code})
  }
  Survey.findById( surveyId, (err, survey) => {
    if (err) { return next(err); }
    return res.status(200).send(survey);
  });
}

exports.patchOneSurvey = (req, res, next) => {
  const surveyId = req.params.surveyId;

  // TODO validate this
  const newMesage = req.body;
  if (!surveyId) {
    return res.status(400).send( {error: status.CAN_NOT_FIND_SURVEY.message, status: status.CAN_NOT_FIND_SURVEY.code})
  }
  Survey.findByIdAndUpdate( surveyId, newMesage, (err, survey) => {
    if (err) { return next(err); }
    return res.status(200).send({message: 'Accepted - recipe changed'})
  });
}

exports.deleteOneSurvey = (req, res, next) => {
  const surveyId = req.params.surveyId
  if (!surveyId) {
    return res.status(400).send( {error: status.CAN_NOT_FIND_SURVEY.message, status: status.CAN_NOT_FIND_SURVEY.code})
  }
  Survey.deletyeById( surveyId, (err, survey) => {
    if (err) { return next(err); }
    return res.status(200).send({message: 'Success! - it is no more'});
  });
}
