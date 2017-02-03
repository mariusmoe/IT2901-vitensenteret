"use strict";

const validator = require('validator'),
      status = require('../status'),
      Survey = require('../models/survey');

exports.getAllSurveys = () => {


}

exports.createSurvey = () => {
  let recivedSurvey = req.body.survey

  // TODO this dos not work!!!!!!!!!!!!!!!!!!!!!!!!!!!
  let newSurvey = new Survey ( recivedSurvey.json() )

  newSurvey.save((err, survey) => {
    if (err) {return next(err); }
    res.status(200).send( survey );
  })
}

exports.getOneSurvey = () => {
  const surveyId = req.params.surveyId
  if (!surveyId) {
    return res.status(400).send( {error: status.CAN_NOT_FIND_SURVEY.message, status: status.CAN_NOT_FIND_SURVEY.code})
  }
  Survey.findById( surveyId, (err, survey) => {
    if (err) { return next(err); }
    return res.status(200).send(survey);
  });
}

exports.patchOneSurvey = () => {
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

exports.deleteOneSurvey = () => {
  const surveyId = req.params.surveyId
  if (!surveyId) {
    return res.status(400).send( {error: status.CAN_NOT_FIND_SURVEY.message, status: status.CAN_NOT_FIND_SURVEY.code})
  }
  Survey.deletyeById( surveyId, (err, survey) => {
    if (err) { return next(err); }
    return res.status(200).send({'Success! - it is no more'});
  });
}
