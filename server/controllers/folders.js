"use strict";

const status = require('../status'),
      Survey  = require('../models/survey'),
      UserFolder  = require('../models/userFolder'),
      jsonfile = require('jsonfile'),
      crypto = require('crypto'),
      fs = require('fs'),
      config = require('config'),
      json2csv = require('json2csv'),
      temp = require('temp'),
      util = require('util'),
      mongoose = require('mongoose'),
      val = require('../libs/validation.js');


// helper function
const getUserFolders = (userId, callback) => {
  UserFolder.find( {user: userId}).exec(function(err, folders) {
    if (!folders || folders.length === 0) {
      // FIXME wrong error message
      callback(true, {message: 'givemeamessage', status: '0000', });
    }
    if (err) { return next(err); }
    callback(null, folders);
  });
}

// GET
exports.getUserFolders = (req, res, next) => {
  const userId = req.user._id;
  if (!userId) {
    return res.status(401).send({message: 'fixme'});
  }
  getUserFolders(userId, (err, message) => {
    if (err) {
      return res.status(500).send(message);
    } else {
      console.log(message);
      return res.status(200).send(message);
    }
  });

}

// POST
exports.createUserFolder = (req, res, next) => {
  let receivedFolder = req.body.folder;
  let parentFolderId = req.body.parentFolderId;
  const userId = req.user._id;
  receivedFolder.user = req.user._id + '';

  // make sure it isn't just an empty object.
  if (Object.keys(receivedFolder).length === 0) {
    return res.status(400).send( {message: status.SURVEY_OBJECT_MISSING.message, status: status.SURVEY_OBJECT_MISSING.code});
  } // FIXME: Status needs updating above and below
  if (!val.folderValidation(receivedFolder)){
    return res.status(422).send( {message: status.SURVEY_UNPROCESSABLE.message, status: status.SURVEY_UNPROCESSABLE.code});
  } // FIXME: !!!
  if (!parentFolderId) {
    return res.status(400).send( {message: status.SURVEY_OBJECT_MISSING.message, status: status.SURVEY_OBJECT_MISSING.code});
  }

  receivedFolder.isRoot = false;
  let newFolder = new UserFolder ( receivedFolder )

  // FIXME: change the "next(err)" so that it returns a json object akin to the above instead
  newFolder.save((err, newFolder) => {
    if (err) {return next(err); }
    UserFolder.findByIdAndUpdate(parentFolderId, { $push: { folders: newFolder._id } }, (err2, success) => {
      if (err2) {return next(err2); }
      getUserFolders(userId, (err, message) => {
        if (err) {
          return res.status(500).send(message);
        } else {
          return res.status(200).send(message);
        }
      });
    });
  })
}

// DELETE
exports.deleteUserFolder = (req, res, next) => {
  // TODO: write me.
  // ).lean();
}
