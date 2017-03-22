"use strict";

const validator = require('validator'),
      status = require('../status'),
      Survey  = require('../models/survey'),
      Response = require('../models/response'),
      jsonfile = require('jsonfile'),
      fs = require('fs'),
      config = require('config'),
      json2csv = require('json2csv'),
      temp = require('temp'),
      util = require('util'),
      mongoose = require('mongoose'),
      val = require('../libs/validation.js');

// Automatically track and cleanup files at exit
temp.track();


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

// POST
// exports.linkPrePost = (req, res, next) => {
//   const preKey  = req.body.preKey;
//   const postKey = req.body.postKey;
//   PrePost.find({preKey: preKey},  (err, existingPreKey) => {
//     if (err) { return next(err); }
//     PrePost.find({postKey: postKey},  (err, existingPostKey) => {
//     if (err) { return next(err); }
//     if (existingPreKey.length >= 1 || existingPostKey.length >= 1) {
//       return res.status(400).send({message: 'FAILURE - Already exists'})
//     }
//     const newPrePost = new PrePost({
//       preKey: preKey,
//       postKey: postKey
//     });
//     newPrePost.save((err, prePost) => {
//       if (err) { return next(err); }
//       console.log(prePost);
//       return res.status(200).send({message: 'SUCCESS', prePost: prePost})
//     })
//   })
// })
//
// }

// GET
// exports.getPrePost = (req, res, next) => {
//
// }


// GET
exports.getAllSurveys = (req, res, next) => {
  Survey.find( { 'isPost': false }, { 'name': true, 'active': true, 'date': true, 'comment': true, 'postKey': true }, (err, surveys) => {
    if (!surveys || surveys.length === 0) {
      // essentially means not one survey exists that match {} - i.e. 0 surveys in db? should be status: 200, empty list then?
      return res.status(200).send({message: status.ROUTE_SURVEYS_VALID_NO_SURVEYS.message, status: status.ROUTE_SURVEYS_VALID_NO_SURVEYS.code});
    }
    if (err) { return next(err); }

    // the fields returned are specified by the projection (second argument) above.
    // _id is always returned unless specified as false in the projection.

    return res.status(200).send(surveys);
  }).lean();
}

exports.getOneSurvey = (req, res, next) => {
  const surveyId = req.params.surveyId;
  // ROUTER checks for existence of surveyId. no need to have a check here as well.
  if (!surveyId.match(/^[0-9a-fA-F]{24}$/)) {
    // but we should check the validity of the id
    return res.status(400).send( {message: status.SURVEY_BAD_ID.message, status: status.SURVEY_BAD_ID.code})
  }

  Survey.findById( surveyId, (err, survey) => {
    if (!survey) {
      return res.status(404).send({message: status.SURVEY_NOT_FOUND.message, status: status.SURVEY_NOT_FOUND.code});
    }
    if (err) { return next(err); }

    // Need to send answers too
    Response.find({surveyId: surveyId}, (err, responses) => {
      if (err) { return next(err); }
      return res.status(200).send({survey: survey, responses: responses});
    });
  });
}

exports.copySurvey = (req, res, next) => {
  const surveyId = req.params.surveyId;
  const includeResponses = req.body.includeResponses;
  const copyLabel = req.body.copyLabel;

  // ROUTER checks for existence of surveyId. no need to have a check here as well.
  if (!surveyId.match(/^[0-9a-fA-F]{24}$/)) {
    // but we should check the validity of the id
    return res.status(400).send({ message: status.SURVEY_BAD_ID.message, status: status.SURVEY_BAD_ID.code });
  }

  const doSurveyCopy = (id, callback, postKey) => {
    Survey.findById( id, (err, survey) => {
      if (!survey) {
        return res.status(404).send({ message: status.SURVEY_NOT_FOUND.message, status: status.SURVEY_NOT_FOUND.code });
      }

      const copyObject = survey.toObject();
      copyObject.name = (copyLabel ? copyLabel : '') + ' ' + copyObject.name;
      copyObject.date = new Date().toISOString();
      delete copyObject._id;
      delete copyObject.__v;
      const copy = new Survey(copyObject);

      // save the copy
      copy.save( (err2, surveyCopy) => {
        if (!surveyCopy) {
          return res.status(400).send({ message: status.SURVEY_COPY_FAILED.message, status: status.SURVEY_COPY_FAILED.code });
        }
        callback(survey, surveyCopy);
      });
    });
  }

  const doResponseCopy = (id, postSurveyCopyId, callback) => {
    Response.find( { surveyId: id }, { _id: false, }, (err, responses) => {
      if (err) {
        next(err);
      }
      if (!responses) {
        return res.status(400).send({ message: status.SURVEY_COPY_FAILED_RESPONSES.message, status: status.SURVEY_COPY_FAILED_RESPONSES.code });
      }

      const copy = responses.slice();
      copy.forEach(response => {
        response.surveyId = postSurveyCopyId;
        response.timestamp = new Date().toISOString();
        delete response._id;
      });
      Response.insertMany(copy, (err, responsesCopy) => {
        if (err) {
          next(err);
        }
        if (!responsesCopy) {
          return res.status(400).send({ message: status.SURVEY_COPY_FAILED_RESPONSES.message, status: status.SURVEY_COPY_FAILED_RESPONSES.code });
        }
        callback(responses, responsesCopy);
      })
    });
  }

  // First we deal with the surveys. The responses are dealt with below.
  doSurveyCopy(surveyId, (origSurvey, newSurvey) => {
    // we might also need to copy a post survey
    if (origSurvey.postKey) {
      doSurveyCopy(origSurvey.postKey, (origPostSurvey, newPostSurvey) => {
        // update the copied PRE survey with the new key to the POST survey
        newSurvey.postKey = newPostSurvey._id;
        newSurvey.save( (err, savedCopyOfOriginalSurvey) => {
          if (!includeResponses) {
            return res.status(200).send(newSurvey);
          } else {
            // copy responses (pre, then post)
            doResponseCopy(surveyId, savedCopyOfOriginalSurvey._id, (responsesCopy) => {
              doResponseCopy(origSurvey.postKey, newPostSurvey._id, (responsesCopy) => {
                return res.status(200).send(newSurvey);
              });
            });
          }
        });
      });
    } else {
      // if there were not post survey to bother about...
      if (!includeResponses) {
        return res.status(200).send(newSurvey);
      } else {
        // copy responses
        doResponseCopy(surveyId, newSurvey, (responsesCopy) => {
          return res.status(200).send(newSurvey);
        });
      }
    }
  });
}

// PATCH
exports.patchOneSurvey = (req, res, next) => {
  let surveyId = req.params.surveyId;
  // ROUTER checks for existence of surveyId. no need to have a check here as well.
  if (!surveyId.match(/^[0-9a-fA-F]{24}$/)) {
    // but we should check the validity of the id
    return res.status(400).send( {message: status.SURVEY_BAD_ID.message, status: status.SURVEY_BAD_ID.code})
  }

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
  // if we receive a __v property in our survey, mongodb will crash
  // as it will attempt to SET and also INC the value at the same time (see below).
  delete survey.__v; // DO NOT REMOVE THIS!!
  // thus we delete the version here.

  Survey.findByIdAndUpdate( surveyId, {$inc: { __v: 1 }, $set: survey}, {new: true, }, (err, survey) => {
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
  if (!surveyId.match(/^[0-9a-fA-F]{24}$/)) {
    // but we should check the validity of the id
    return res.status(400).send( {message: status.SURVEY_BAD_ID.message, status: status.SURVEY_BAD_ID.code})
  }

  Survey.findByIdAndRemove( surveyId, (err, survey) => {
    if (!survey) {
      return res.status(404).send({message: status.SURVEY_NOT_FOUND.message, status: status.SURVEY_NOT_FOUND.code});
    }
    if (err) { return next(err); }
    return res.status(200).send({message: status.SURVEY_DELETED.message, status: status.SURVEY_DELETED.code, survey: survey});
  });
}

// POST
exports.answerOneSurvey = (req, res, next) => {
  const surveyId  = req.params.surveyId,
        types      = req.body.types,
        answers   = req.body.answers;
  // TODO: if answers object does not exist, stop here.

  // ROUTER checks for existence of surveyId. no need to have a check here as well.
  if (!surveyId.match(/^[0-9a-fA-F]{24}$/)) {
    // but we should check the validity of the id
    return res.status(400).send( {message: status.SURVEY_BAD_ID.message, status: status.SURVEY_BAD_ID.code})
  }
  let newAnswer = new Response({
    nickname: req.body.nickname,
    surveyId: surveyId,
    questionlist: answers
  })
  newAnswer.save( (err, answer) => {
    if (err) { return next(err); }
    return res.status(200).send( {message: status.SURVEY_RESPONSE_SUCCESS.message, status: status.SURVEY_RESPONSE_SUCCESS.code})
  });
}


// JSON
exports.getAllSurveysAsJson = (req, res, next) => {
  Survey.find({}, (err, surveys) => {
    if (!surveys) {
      return res.status(404).send({message: status.SURVEY_NOT_FOUND.message, status: status.SURVEY_NOT_FOUND.code});
    }
    if (err) { return next(err); }

    let data = JSON.stringify(surveys, null, 2);

    // Open a gate to the temp directory
    temp.open('json', function(err, info) {
      if (!err) {
        fs.write(info.fd, data , function(err){
          if (err) {console.error(err);}
        });
        // close file system operation (it is now safe to read from file)
        fs.close(info.fd, function(err) {
          res.setHeader('content-type', 'application/json')
          res.download(info.path, 'data.json', function(err){
            if (err) {console.error(err);}
          })
        });
      }
    });
  });
}



exports.getSurveyAsJson = (req, res, next) => {
  const surveyId = req.params.surveyId
  if (!surveyId) {
    return res.status(400).send( {message: status.SURVEY_NOT_FOUND.message, status: status.SURVEY_NOT_FOUND.code})
  }
  if (!surveyId.match(/^[0-9a-fA-F]{24}$/)) {
    // but we should check the validity of the id
    return res.status(400).send( {message: status.SURVEY_BAD_ID.message, status: status.SURVEY_BAD_ID.code})
  }

  Survey.findById(surveyId, (err, survey) => {
    if (!survey) {
      return res.status(404).send({message: status.SURVEY_NOT_FOUND.message, status: status.SURVEY_NOT_FOUND.code});
    }
    if (err) { return next(err); }

    let data = JSON.stringify(survey, null, 2);


    // Open a gate to the temp directory
    temp.open('json', function(err, info) {
      if (!err) {
        fs.write(info.fd, data , function(err){
          if (err) {console.error(err);}
        });
        // close file system operation (it is now safe to read from file)
        fs.close(info.fd, function(err) {
          res.setHeader('content-type', 'application/json')
          res.download(info.path, 'data.json', function(err){
            if (err) {console.error(err);}
          })
        });
      }
    });



    //
    // jsonfile.writeFile(file, survey, {spaces: 2}, function(err) {
    //   // return res.status(200).download( file );
    //   // TODO: GIVE THE REPORT A BETTER NAME!
    //   res.download(file, 'report.json', function(err){
    //   if (err) {
    //     // Handle error, but keep in mind the response may be partially-sent
    //     // so check res.headersSent
    //     fs.unlink('temp/data.json', (err) => {
    //       if (err) {console.error(err);};
    //       if(config.util.getEnv('NODE_ENV') !== 'test') {
    //           console.log('SUCCESS - successfully deleted temp/data.json');
    //         };
    //       });
    //   } else {
    //     // decrement a download credit, etc.
    //     fs.unlink('temp/data.json', (err) => {
    //       if (err) {console.error(err);};
    //       // console.log(config.util.getEnv('NODE_ENV'));
    //       if(config.util.getEnv('NODE_ENV') !== 'test') {
    //           console.log('SUCCESS - successfully deleted temp/data.json');
    //         };
    //     });
    //   }
    //   });
    // });
  });
}

exports.getSurveyAsCSV = (req, res, next) => {
    const surveyId = req.params.surveyId
    if (!surveyId) {
      return res.status(400).send( {message: status.SURVEY_NOT_FOUND.message, status: status.SURVEY_NOT_FOUND.code})
    }
    if (!surveyId.match(/^[0-9a-fA-F]{24}$/)) {
      // but we should check the validity of the id
      return res.status(400).send( {message: status.SURVEY_BAD_ID.message, status: status.SURVEY_BAD_ID.code})
    }
    Survey.findById(surveyId, (err, survey) => {
    if (!survey) {
      return res.status(404).send({message: status.SURVEY_NOT_FOUND.message, status: status.SURVEY_NOT_FOUND.code});
    }
    if (err) { return next(err); }

    let questionAnswar = []
    let csv = "";
    const numOptions = {
      smiley: 3,
      binary: 2,
      text: 1,
      star: 5
    }

    Response.find({surveyId: surveyId}, (err, responses) => {
      if (err) { return next(err); }
      // for every question in the survey
      csv += survey.name + '\n'
      survey.questionlist.forEach((question, i) => {
        // Add question number for readability; Add question to csv
        csv += String(i) + '. ' + question.lang.no.txt + '\n'
        switch (question.mode) {
          case 'multi':
            question.lang.no.options.forEach( (x) =>{csv += x + ','});
            csv += '\n'
            question.lang.no.options.forEach( (x,y) => {
              let totalResponse = 0;
              responses.forEach((response) => {
                response.questionlist[i].forEach((multiOption, n) => {
                  if (response.questionlist[i][n] == y) {
                    totalResponse++
                  }
                })
              })
              csv += totalResponse + ','
            })
            csv += '\n'
            break;
          case 'text':
            responses.forEach((response) => {
              csv += response.questionlist[i] + '\n'
            })
            break;
          default:
            question.lang.no.options.forEach( (x) =>{csv += x + ','});
            csv += '\n'
            question.lang.no.options.forEach( (x,y) => {
              let totalResponse = 0;
              responses.forEach((response) => {
                if (response.questionlist[i] == y) {
                  totalResponse++
                }
              })
              csv += totalResponse + ','
            })
            csv += '\n'
            break;
        }
        // // console.log(question);
        // questionAnswar = question.answer;
        // // Count the occurance of each element in the array
        // let questionAnswarCount = new Map([...new Set(questionAnswar)].map(
        //   x => [x, questionAnswar.filter(y => y === x).length]
        // ));
        //
        //
        // // Add all questions to csv
        // if ( question.mode === 'multi') {
        //   // Add question text
        //   question.lang.no.options.forEach( (x) =>{csv += x + ','});
        //   csv += '\n'
        //   // Add accumulated answars to csv
        //   question.lang.no.options.forEach( (x,y) => { csv += questionAnswarCount.get(y+1) + ',' })
        //   csv += '\n'
        // } else {
        //   // Create a list with length according to question mode
        //   // This list is also numerated from 0 - length of questionmode - 1
        //   let optionsList = Array.apply(null, Array(numOptions[question.mode])).map(function (x, i) { return i; });
        //   // Add question text (in this case it is a number)
        //   optionsList.forEach( (x) =>{csv += x + ','});
        //   csv += '\n'
        //   // Add accumulated answars to csv
        //   optionsList.forEach( (x,y) => { csv += questionAnswarCount.get(y) + ',' })
        //   csv += '\n'
        //
        // }
        //}


      })



      // Open a gate to the temp directory
      temp.open('myprefix', function(err, info) {
        if (!err) {
          fs.write(info.fd, csv, function(err){
            if (err) {console.error(err);}
          });
          // close file system operation (it is now safe to read from file)
          fs.close(info.fd, function(err) {
            res.download(info.path, 'data.csv', function(err){
              if (err) {console.error(err);}
            })
          });
        }
      });
    });
  });
}
