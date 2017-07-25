"use strict";

const validator = require('validator'),
      status = require('../status'),
      Survey  = require('../models/survey'),
      Response = require('../models/response'),
      Nickname = require('../models/nickname'),
      UserFolder = require('../models/userFolder'),
      jsonfile = require('jsonfile'),
      crypto = require('crypto'),
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
  receivedSurvey.madeBy = req.user._id.toString();
  receivedSurvey.center = req.user.center.toString();
  delete recievedSurvey.deactivationDate

  if (!val.surveyValidation(receivedSurvey)){
    return res.status(422).send( {message: status.SURVEY_UNPROCESSABLE.message, status: status.SURVEY_UNPROCESSABLE.code})
  }

  let newSurvey = new Survey ( receivedSurvey );



  newSurvey.save((err, survey) => {
    if (err) {return next(err); }
    // only PRE-surveys and non-prepost surveys should go in the folders!
    if(survey.isPost === false) {
      UserFolder.findOne({ user: req.user, isRoot: true }, (err2, rootFolder) => {
        if (err2) { return next(err2); }
        rootFolder.surveys.push(survey);
        rootFolder.save((err3, savedRoot) => {
          if (err3) { return next(err3); }
          return res.status(200).send( survey );
        });
      });
    } else {
      // its a post-survey, return without creating a folder entry for it.
      return res.status(200).send( survey );
    }
  });
}


// GET
exports.getAllSurveys = (req, res, next) => {
  const centerId = req.params.centerId;
  Survey.find( { 'isPost': false, 'center': centerId }, { 'name': true, 'active': true, 'date': true, 'comment': true, 'postKey': true }, (err, surveys) => {
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

/**
 * @depricated
 * @param  {[type]}   req  [description]
 * @param  {[type]}   res  [description]
 * @param  {Function} next [description]
 * @return {[type]}        [description]
 */
// exports.getAllCenters = (req, res, next) => {
//   Survey.find( { 'name': true }, (err, centers) => {
//     if (err) { return next(err); }
//     return res.status(200).send(centers);
//   }).lean();
// }

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
          return res.status(500).send({ message: status.SURVEY_COPY_FAILED.message, status: status.SURVEY_COPY_FAILED.code });
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
        return res.status(500).send({ message: status.SURVEY_COPY_FAILED_RESPONSES.message, status: status.SURVEY_COPY_FAILED_RESPONSES.code });
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
          return res.status(500).send({ message: status.SURVEY_COPY_FAILED_RESPONSES.message, status: status.SURVEY_COPY_FAILED_RESPONSES.code });
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

  // TODO: delete previos responses
  Response.remove({surveyId: surveyId}, (err) => {
    if (err) { return next(err); }
    Nickname.remove({surveyId: surveyId}, (err) => {
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
    })
  })
}

// DELETE
exports.deleteOneSurvey = (req, res, next) => {
  const surveyId = req.params.surveyId
  // ROUTER checks for existence of surveyId. no need to have a check here as well.
  if (!surveyId.match(/^[0-9a-fA-F]{24}$/)) {
    // but we should check the validity of the id
    return res.status(400).send( {message: status.SURVEY_BAD_ID.message, status: status.SURVEY_BAD_ID.code})
  }
  Survey.findById(surveyId, (err, survey) => {
    if (!survey) {
      return res.status(404).send({message: status.SURVEY_NOT_FOUND.message, status: status.SURVEY_NOT_FOUND.code});
    }
    if (err) { return next(err); }
    if (survey.postKey) {
      Survey.findById(survey.postKey, (err, postSurvey) => {
        //      delete survey
        //             postSurvey
        //             surveyAnswers      if answers
        //             postSurveyAnswers  if answers
        if (err) { return next(err); }
        Response.find({surveyId: survey.postKey}, (err, postResponses) => {
          if (postResponses) {
            postResponses.forEach((postResponses) => {
              postResponses.remove((err) => {
                if (err) { return next(err); }
              });
            })
          }
          survey.remove((err) => {
            if (err) { return next(err); }
            Response.find({surveyId: surveyId}, (err, responses) => {
              if (responses) {
                responses.forEach((response) => {
                  response.remove((err) => {
                    if (err) { return next(err); }
                  });
                })
              }
              postSurvey.remove((err) => {
                if (err) { return next(err); }
                return res.status(200).send( {message: status.SURVEY_DELETED.message, status: status.SURVEY_DELETED.code})
              })
            });
          })
        })

      })
    } else {
      //      delete survey
      //             survey answers if answers
      Response.find({surveyId: surveyId}, (err, responses) => {
        if (responses) {
          responses.forEach((response) => {
            response.remove((err) => {
              if (err) { return next(err); }
            });
          })
        }
        survey.remove((err) => {
          if (err) { return next(err); }
          return res.status(200).send( {message: status.SURVEY_DELETED.message, status: status.SURVEY_DELETED.code})
        })
      })
    }
  })

}


/**
 * getSecureRandomBytes in hex format
 * @return {String} A random string of text
 */
const getSecureRandomBytes = (callback) => {
    crypto.randomBytes(8, function(err, buffer) {
      if (err) { return next(err); }
      callback(Date.now().toString(16) + buffer.toString('hex'));
    });
};

// getSecureRandomBytes((random) => {
//   console.log("RANDOM: " + random );
// })



// POST
exports.answerOneSurvey = (req, res, next) => {
  const surveyId        = req.params.surveyId,
        responseObject  = req.body;
  // console.log(responseObject);
  // ROUTER checks for existence of surveyId. no need to have a check here as well.
  if (!surveyId.match(/^[0-9a-fA-F]{24}$/)) {
    // but we should check the validity of the id
    return res.status(400).send({ message: status.SURVEY_BAD_ID.message, status: status.SURVEY_BAD_ID.code});
  }
  if (!responseObject) {
    return res.status(400).send({ message: status.SURVEY_RESPONSE_OBJECT_MISSING.message, status: status.SURVEY_RESPONSE_OBJECT_MISSING.code });
  }
  if (!val.responseValidation(responseObject)) {
    return res.status(400).send({ message: status.SURVEY_RESPONSE_UNPROCESSABLE.message, status: status.SURVEY_RESPONSE_UNPROCESSABLE.code });
  }
  if (responseObject.nickname) {
    // Helper function for readability down below
    const setNickname = (surveyId, nickname, callback) => {
      // console.log(surveyId + "  -   " + nickname);
      Nickname.find({nickname: nickname}, (err, foundNickname) => {
        // console.log(foundNickname);
        if (foundNickname.length > 0) {
          // Nickname is taken
          callback(true, null)
        } else {
          // console.log('No nickname taken!');
          // Nickname is aviliable
          getSecureRandomBytes((random) => {
            let newNickname = new Nickname({
              nickname: nickname,
              surveyId: surveyId,
              uniqueName: random
            });
            newNickname.save((err, nickname) => {
              if (err) {return next(err); }
              callback(false, nickname);
            });
          });
        }
      })
    }

    Survey.findById(surveyId, (err, survey) => {
      if (survey.isPost) { // TODO: < --- if err, then this goes bad here!

        // ^ FIXME! (the surveyId is never verifed to exist)

        // Survey is post and is sent with a nickname
        // lookup nicnames for this survey and see if it is already there
        // if not ignore it !!!
        Nickname.findOne({nickname: responseObject.nickname}, (err2, foundNickname) => {
          if (err2) { return next(err2); }
          if(!foundNickname || foundNickname.length == 0) {
            // nickname is not present - return FAILURE
            return res.status(400).send( {message: status.UNKNOWN_NICKNAME.message, status: status.UNKNOWN_NICKNAME.code})
          } else {
            // nickname exists - SUCCESS

            let newResponse = new Response({
                nickname: foundNickname.uniqueName,
                surveyId: surveyId,
                questionlist: responseObject.questionlist
            });
            newResponse.save( (err3, answer) => {
              if (err3) { return next(err3); }
              Nickname.findByIdAndRemove(foundNickname, (err4) => {
                if (err4) { return next(err4); }
                return res.status(200).send( {message: status.SURVEY_RESPONSE_SUCCESS.message, status: status.SURVEY_RESPONSE_SUCCESS.code})
              })

            });
          }
        })
      } else {
        setNickname(surveyId, responseObject.nickname, (err5, nickname) => {
          if(err5) {
            return res.status(400).send( {message: status.NICKNAME_TAKEN.message, status: status.NICKNAME_TAKEN.code})
          }
          let newResponse = new Response({
              nickname: nickname.uniqueName,
              surveyId: surveyId,
              questionlist: responseObject.questionlist
          });
          newResponse.save( (err6, answer) => {
            if (err6) { return next(err6); }
            return res.status(200).send( {message: status.SURVEY_RESPONSE_SUCCESS.message, status: status.SURVEY_RESPONSE_SUCCESS.code})
          });
        })
      }
    })
  } else {
    let newResponse = new Response(responseObject);
    newResponse.save( (err7, answer) => {
      if (err7) { return next(err); }
      return res.status(200).send( {message: status.SURVEY_RESPONSE_SUCCESS.message, status: status.SURVEY_RESPONSE_SUCCESS.code})
    });
  }
}


exports.getNicknamesForOneSurvey = (req, res, next) => {
  const surveyId = req.params.surveyId;
  // console.log("surveyId: " + surveyId);
  Survey.findById(surveyId, (err, survey) => {
    if (err) { return next(err); }
    // console.log(survey);
    if (survey.isPost) {
      Survey.findOne({postKey: surveyId}, (err, preSurvey) => {
        // console.log(preSurvey);
        Nickname.find({surveyId: preSurvey._id}, {'nickname': true}, (err, nicknames) => {
          // console.log(nicknames);
          if (err) { return next(err); }
          if (nicknames.length == 0) {
            return res.status(200).send( {message: status.NO_NICKNAMES_FOUND.message, status: status.NO_NICKNAMES_FOUND.code})
          }
          return res.status(200).send( {nicknames: nicknames} );
        });
      })
    } else {
      Nickname.find({surveyId: surveyId}, {'nickname': true}, (err, nicknames) => {
        // console.log(nicknames);
        if (err) { return next(err); }
        // if (nicknames.length == 0) {
        //   return res.status(400).send( {message: status.NO_NICKNAMES_FOUND.message, status: status.NO_NICKNAMES_FOUND.code})
        // }
        return res.status(200).send( {nicknames: nicknames} );
      });
    }
  })
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
    // const numOptions = {
    //   smiley: 3,
    //   binary: 2,
    //   text: 1,
    //   star: 5
    // }
    Response.find({surveyId: surveyId}, (err, responses) => {
      if (err) { return next(err); }
      if (survey.postKey) {
        csv += 'PRE survey\n'
      }
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
                console.log(response);
                console.log("-------------");
                console.log(i);
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
          case 'star':
            let starList = ['1 star', '2 stars', '3 stars', '4 stars', '5 stars']
            starList.forEach( (x) =>{csv += x + ','});
            csv += '\n'
            starList.forEach( (x,y) => {
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
          case 'smiley':
            csv += 'Sad,Neutral,Happy'
            csv += '\n'
            let smileyList = ['Sad','Neutral','Happy']
            smileyList.forEach( (x,y) => {
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
          case 'binary':
            csv += 'No,Yes'
            csv += '\n'
            let binaryList = ['No', 'Yes']
            binaryList.forEach( (x,y) => {
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
      })


            if (survey.postKey) {
              csv += 'POST survey\n';
              const postKey = survey.postKey;
              Survey.findById(postKey, (err, survey) => {
              if (!survey) {
                return res.status(404).send({message: status.SURVEY_NOT_FOUND.message, status: status.SURVEY_NOT_FOUND.code});
              }
              if (err) { return next(err); }

              let questionAnswar = []

              // const numOptions = {
              //   smiley: 3,
              //   binary: 2,
              //   text: 1,
              //   star: 5
              // }
              Response.find({surveyId: postKey}, (err, responses) => {
                if (err) { return next(err); }
                if (survey.postKey) {
                  csv += 'PRE survey\n'
                }
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
                          if (response) {
                            console.log(response);
                            console.log("-------------");
                            console.log(i);
                            response.questionlist[i].forEach((multiOption, n) => {
                              if (response.questionlist[i][n] == y) {
                                totalResponse++
                              }
                            })
                          }
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
                    case 'star':
                      let starList = ['1 star', '2 stars', '3 stars', '4 stars', '5 stars']
                      starList.forEach( (x) =>{csv += x + ','});
                      csv += '\n'
                      starList.forEach( (x,y) => {
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
                    case 'smiley':
                      csv += 'Sad,Neutral,Happy'
                      csv += '\n'
                      let smileyList = ['Sad','Neutral','Happy']
                      smileyList.forEach( (x,y) => {
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
                    case 'binary':
                      csv += 'No,Yes'
                      csv += '\n'
                      let binaryList = ['No', 'Yes']
                      binaryList.forEach( (x,y) => {
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
          } else {

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
    }
    });
  });
}
