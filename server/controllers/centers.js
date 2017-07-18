"use strict";

const status = require('../status'),
      Survey  = require('../models/survey'),
      Response = require('../models/response'),
      Nickname = require('../models/nickname'),
      Center = require('../models/center'),
      jsonfile = require('jsonfile'),
      crypto = require('crypto'),
      fs = require('fs'),
      config = require('config'),
      json2csv = require('json2csv'),
      temp = require('temp'),
      util = require('util'),
      mongoose = require('mongoose'),
      val = require('../libs/validation.js');



exports.createCenter = (req, res, next) => {
  let receivedCenter = req.body;

  // make sure it isn't just an empty object.
  if (Object.keys(receivedCenter).length === 0) {
    return res.status(400).send( {message: status.SURVEY_OBJECT_MISSING.message, status: status.SURVEY_OBJECT_MISSING.code})
  }
  // FIXME validate center object
  let newCenter = new Center ( receivedCenter )

  newCenter.save((err, center) => {
    if (err) {return next(err); }
    return res.status(200).send( center );
  })
}

// GET
exports.getAllCenters = (req, res, next) => {
  Survey.find( {}, {'password': false }, (err, centers) => {
    if (!centers || centers.length === 0) {
      // essentially means not one survey exists that match {} - i.e. 0 surveys in db? should be status: 200, empty list then?
      // FIXME wrong error message
      return res.status(200).send({message: status.ROUTE_SURVEYS_VALID_NO_SURVEYS.message, status: status.ROUTE_SURVEYS_VALID_NO_SURVEYS.code});
    }
    if (err) { return next(err); }

    // the fields returned are specified by the projection (second argument) above.
    // _id is always returned unless specified as false in the projection.

    return res.status(200).send(centers);
  }).lean();
}


// Patch
/**
 * Add or change choosesurvey password
 */
exports.patchOneEscape = (req, res, next) => {
  const password = req.body.password;
  const centerId = req.params.centerId;
  if (!password) {
    return res.status(401).send({message: status.NO_EMAIL_OR_PASSWORD.message, status: status.NO_EMAIL_OR_PASSWORD.code} )
  }
  // FIXME wrong status
  if (!centerId){
    return res.status(401).send({message: status.NO_EMAIL_OR_PASSWORD.message, status: status.NO_EMAIL_OR_PASSWORD.code} )
  }
  // FIXME
  Center.findOne({}, (err, escape) => {
    if (err) {return next(err); }
    if (!escape) {
      const newEscape = new Center({
        password: password
      });
        newEscape.save((err, escape) => {
          if (err) {return next(err); }
          return  res.status(200).send({message: 'SUCCESS - new password saved', status: 45678} )
        });
    } else {
      escape.password = password;
      escape.save((err, escape) => {
        if (err) {return next(err); }
        return res.status(200).send({message: 'SUCCESS - password saved', status: 45678} )
      });
    }
  })


}

// POST
/**
 * Check if choosesurvey password is correct
 */
exports.checkOneEscape = (req, res, next) => {
  const centerId = req.params.centerId;
  const password = req.body.password;
  if (!password || typeof password !== 'string') {
    return res.status(401).send({message: status.NO_EMAIL_OR_PASSWORD.message, status: status.NO_EMAIL_OR_PASSWORD.code} )
  }
  Center.findOne({}, (err, escape) => {
    if (err) { return next(err); }
    if (!escape) {
      return res.status(401).send({message: false, error: 'ERROR'});
    }
    // FIXME name space
    escape.comparePassword(password, function(err, isMatch) {
      if (err) { return next(err); }
      if (isMatch) {
        return res.status(200).send({message: true});
      } else {
        return res.status(401).send({message: false});
      }
    });
  });
}
