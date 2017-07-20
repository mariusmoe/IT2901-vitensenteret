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
  } // FIXME: Status needs updating above and below
  if (!val.centerValidation(receivedCenter)){
    return res.status(422).send( {message: status.SURVEY_UNPROCESSABLE.message, status: status.SURVEY_UNPROCESSABLE.code})
  }
  let newCenter = new Center ( receivedCenter )

  // FIXME: change the "next(err)" so that it returns a json object akin to the above instead
  newCenter.save((err, center) => {
    if (err) {return next(err); }
    return res.status(200).send( center );
  })
}

// GET
exports.getAllCenters = (req, res, next) => {
  const centerId = req.params.centerId;
  Center.find( {}, {'password': false }, (err, centers) => {
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

  if (!password || typeof password !== 'string') {
    return res.status(400).send({message: status.ESCAPE_MISSING_PASSWORD.message, status: status.ESCAPE_MISSING_PASSWORD.code} )
  }
  if (!centerId){
    return res.status(400).send({message: status.ESCAPE_MISSING_CENTER.message, status: status.ESCAPE_MISSING_CENTER.code} )
  }
  if (req.user.center != centerId) { // intentionally only one = in the comparison
    if (req.user.role !== 'sysadmin') {
      return res.status(401).send({message: status.INSUFFICIENT_PRIVILEGES.message, status: status.INSUFFICIENT_PRIVILEGES.code} )
    }
  }

  Center.findById(centerId, (err, center) => {
    if (!center) {
      return res.status(500).send({message: status.ESCAPE_PATCH_ERROR.message, status: status.ESCAPE_PATCH_ERROR.code});
    }
    if (err) { return next(err); }

    center.password = password;
    center.save((err2, centerNew) => {
      if (!centerNew) {
        return res.status(500).send({message: status.ESCAPE_PATCH_ERROR.message, status: status.ESCAPE_PATCH_ERROR.code});
      }
      if (err2) { return next(err2); }
      return res.status(200).send({message: status.ESCAPE_PATCH_SUCCESSFUL.message, status: status.ESCAPE_PATCH_SUCCESSFUL.code })
    });


  });
}

// POST
/**
 * Check if choosesurvey password is correct
 */
exports.checkOneEscape = (req, res, next) => {
  const centerId = req.params.centerId;
  const password = req.body.password;
  if (!password || typeof password !== 'string') {
    return res.status(400).send({message: status.ESCAPE_MISSING_PASSWORD.message, status: status.ESCAPE_MISSING_PASSWORD.code} )
  }
  Center.findById( centerId, (err, escape) => {
    if (err) { return next(err); }
    if (!escape) {
      return res.status(500).send({message: status.ESCAPE_PATCH_ERROR.message, status: status.ESCAPE_PATCH_ERROR.code});
    }
    escape.comparePassword(password, function(err, isMatch) {
      if (err) { return next(err); }
      if (isMatch) {
        return res.status(200).send({message: status.ESCAPE_COMPARE_TRUE.message, status: status.ESCAPE_COMPARE_TRUE.code, success: true });
      } else {
        return res.status(200).send({message: status.ESCAPE_COMPARE_FALSE.message, status: status.ESCAPE_COMPARE_FALSE.code, success: false });
      }
    });
  });
}
