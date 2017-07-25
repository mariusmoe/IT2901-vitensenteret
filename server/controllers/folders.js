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
      callback(true, {message: status.FOLDER_COULD_NOT_RETRIEVE_ALL.message, status: status.FOLDER_COULD_NOT_RETRIEVE_ALL.code, });
    }
    if (err) { return next(err); }
    callback(null, folders);
  });
}

// GET
exports.getUserFolders = (req, res, next) => {
  const userId = req.user._id;
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
    return res.status(400).send( {message: status.FOLDER_OBJECT_MISSING.message, status: status.FOLDER_OBJECT_MISSING.code});
  }
  if (!val.folderValidation(receivedFolder)){
    return res.status(422).send( {message: status.FOLDER_UNPROCESSABLE.message, status: status.FOLDER_UNPROCESSABLE.code});
  }
  if (!parentFolderId) {
    return res.status(400).send( {message: status.FOLDER_PARENT_FOLDERID_MISSING.message, status: status.FOLDER_PARENT_FOLDERID_MISSING.code});
  }

  receivedFolder.isRoot = false;
  let newFolder = new UserFolder ( receivedFolder );

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

// PATCH
exports.updateFolders = (req, res, next) => {
  let updatedFolder = req.body.folder;
  let secondaryUpdatedFolder = req.body.secondaryFolder; // used for MOVING folder or survey from one folder to another

  const userId = req.user._id;

  // make sure it isn't just an empty object.
  if (Object.keys(updatedFolder).length === 0) {
    return res.status(400).send( {message: status.FOLDER_OBJECT_MISSING.message, status: status.FOLDER_OBJECT_MISSING.code});
  }
  if (!val.folderValidation(updatedFolder)){
    return res.status(422).send( {message: status.FOLDER_UNPROCESSABLE.message, status: status.FOLDER_UNPROCESSABLE.code});
  }
  if (!updatedFolder._id){
    return res.status(422).send( {message: status.FOLDER_ID_MISSING.message, status: status.FOLDER_ID_MISSING.code});
  }

  if (secondaryUpdatedFolder) {
    if (!val.folderValidation(secondaryUpdatedFolder)){
      return res.status(422).send( {message: status.FOLDER_UNPROCESSABLE.message, status: status.FOLDER_UNPROCESSABLE.code});
    }
    if (!secondaryUpdatedFolder._id){
      return res.status(422).send( {message: status.FOLDER_SECONDARY_ID_MISSING.message, status: status.FOLDER_SECONDARY_ID_MISSING.code});
    }
  }



  UserFolder.findByIdAndUpdate(updatedFolder._id, {$set: updatedFolder}, (err, folder) => {
    if (err) { next(err); }
    if (secondaryUpdatedFolder) {
      UserFolder.findByIdAndUpdate(secondaryUpdatedFolder._id, {$set: updatedFolder}, (err2, folder2) => {
        if (err2) { next(err2); }
        return res.status(422).send( {message: status.FOLDER_SUCCESSFULLY_UPDATED.message, status: status.FOLDER_SUCCESSFULLY_UPDATED.code});
      });
    }
    return res.status(422).send( {message: status.FOLDER_SUCCESSFULLY_UPDATED.message, status: status.FOLDER_SUCCESSFULLY_UPDATED.code});
  });
}




// DELETE
exports.deleteUserFolder = (req, res, next) => {
  // TODO: write me.
  // ).lean();
}
