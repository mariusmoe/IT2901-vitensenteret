"use strict";

const status = require('../status'),
      Survey  = require('../models/survey'),
      Nickname  = require('../models/nickname'),
      Response  = require('../models/response'),
      UserFolder  = require('../models/userFolder'),
      jsonfile = require('jsonfile'),
      config = require('config'),
      mongoose = require('mongoose'),
      val = require('../libs/validation.js');


// helper function
const getUserFolders = (userId, callback) => {
  UserFolder.find( {user: userId}, null, { sort: { title: 1 } }).exec(function(err, folders) {
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
      // console.log(message);
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
  const data = req.body;
  const userId = req.user._id;

  // make sure it isn't just an empty object.
  if (Object.keys(data).length === 0) {
    return res.status(400).send( {message: status.FOLDER_OBJECT_MISSING.message, status: status.FOLDER_OBJECT_MISSING.code});
  }

  if (data.isMultiFolder) {
    // targetFolderId: targetFolder._id,
    // sourceFolderId: sourceFolder._id,
    // isSurvey: movedObjectWasASurvey,
    // itemId: null,
    if (!data.targetFolderId || !data.sourceFolderId || !data.itemId) {
      return res.status(422).send( {message: status.FOLDER_ID_MISSING.message, status: status.FOLDER_ID_MISSING.code});
    }
    UserFolder.findById(data.targetFolderId, (err, targetFolder) => {
      if (err) { next(err); }
      UserFolder.findById(data.sourceFolderId, (err, sourceFolder) => {
        if (data.isSurvey) {
          targetFolder.surveys.push(data.itemId);
          let sourceIndex = sourceFolder.surveys.indexOf(data.itemId);
          sourceFolder.surveys.splice(sourceIndex, 1);
        } else {
          targetFolder.folders.push(data.itemId);
          let sourceIndex = sourceFolder.folders.indexOf(data.itemId);
          sourceFolder.folders.splice(sourceIndex, 1);
        }

        targetFolder.save((err2, f) => {
          if (err2) { next(err2); }
          sourceFolder.save((err3, f2) => {
            if (err3) { next(err3); }
            return res.status(200).send( {message: status.FOLDER_SUCCESSFULLY_UPDATED.message, status: status.FOLDER_SUCCESSFULLY_UPDATED.code});
          });
        });
      });
    });
  }
}


// PATCH 2
exports.updateFolderSingular = (req, res, next) => {
  let receivedFolder = req.body.folder;
  let folderId = req.params.folderId;
  const userId = req.user._id;

  // make sure it isn't just an empty object.
  if (Object.keys(receivedFolder).length === 0) {
    return res.status(400).send( {message: status.FOLDER_OBJECT_MISSING.message, status: status.FOLDER_OBJECT_MISSING.code});
  }
  if (!val.folderValidation(receivedFolder, true)){
    return res.status(422).send( {message: status.FOLDER_UNPROCESSABLE.message, status: status.FOLDER_UNPROCESSABLE.code});
  }
  if (receivedFolder.user != userId) {
    return res.status(401).send({ message: status.INSUFFICIENT_PRIVILEGES.message, status: status.INSUFFICIENT_PRIVILEGES.code });
  }

  UserFolder.findById(folderId, (err, folder) => {
    if (err) { next(err); }
    if (folder && folder.isRoot) {
      return res.status(401).send({ message: status.INSUFFICIENT_PRIVILEGES.message, status: status.INSUFFICIENT_PRIVILEGES.code });
    }
    // ONLY updating title at the moment. Maybe add surveys and subfolders as well?
    folder.title = receivedFolder.title;
    folder.open = receivedFolder.open;
    folder.save((err2, savedFolder) => {
      if (err2) { next(err2); }
      return res.status(200).send( {message: status.FOLDER_SUCCESSFULLY_UPDATED.message, status: status.FOLDER_SUCCESSFULLY_UPDATED.code});
    });
  });
}


// DELETE
exports.deleteUserFolder = (req, res, next) => {
  let folderId = req.params.folderId;
  const userId = req.user._id;

  let surveyIdsToDelete = [];
  let folderIdsToDelete = [folderId];

  let recursiveFolderScan = (folder) => {
    folder.surveys.forEach(s => {
      surveyIdsToDelete.push(s._id);
      if (s.postKey) { surveyIdsToDelete.push(s.postKey); }
    });
    folder.folders.forEach(f => {
      folderIdsToDelete.push(f._id);
      recursiveFolderScan(f);
    });
  }

  UserFolder.find( { _id: folderId }, (err, folders) => {
    if (err) { next(err); }
    let folder = folders[0];
    if (!folder) {
      return res.status(404).send( {message: status.FOLDER_NOT_FOUND.message, status: status.FOLDER_NOT_FOUND.code});
    } else if (folder.user.toString() != userId) {
      return res.status(404).send( {message: status.INSUFFICIENT_PRIVILEGES.message, status: status.INSUFFICIENT_PRIVILEGES.code});
    }

    recursiveFolderScan(folder);

    // nicknames, responses, surveys, folders
    Nickname.remove({ surveyId: { $in: surveyIdsToDelete }}, (err) => {
      if (err) { next(err); }
      Response.remove({ surveyId: { $in: surveyIdsToDelete }}, (err2) => {
        if (err2) { next(err2); }
        Survey.remove({ _id: { $in: surveyIdsToDelete }}, (err3) => {
          if (err3) { next(err3); }
          UserFolder.remove({ _id: { $in: folderIdsToDelete }}, (err4) => {
            if (err4) { next(err4); }
            return res.status(200).send({
              message: status.FOLDER_DELETED.message,
              status: status.FOLDER_DELETED.code,
              deletedFolders: folderIdsToDelete,
              deletedSurveys: surveyIdsToDelete
            });
          });
        });
      });
    });
  });
}
