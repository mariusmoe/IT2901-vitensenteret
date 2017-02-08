"use strict";

const validator = require('validator'),
      status = require('../status'),
      Survey = require('../models/survey'),
      jsonfile = require('jsonfile'),
      fs = require('fs'),
      config = require('config'),
      json2csv = require('json2csv'),
      val = require('../libs/validation.js');





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


// GET
exports.getAllSurveys = (req, res, next) => {
  // TODO: Change me so that I return only id and name!

  Survey.find( {}, (err, surveys) => {
    if (!surveys) {
      // essentially means not one survey exists that match {} - i.e. 0 surveys in db? should be status: 200, empty list then?
      return res.status(200).send({message: status.ROUTE_SURVEYS_VALID_NO_SURVEYS.message, status: status.ROUTE_SURVEYS_VALID_NO_SURVEYS.code});
    }
    if (err) { return next(err); }

    let surveyList = [];
    for (let survey of surveys) {
      surveyList[surveyList.length] = {
        'name': survey.name,
        'active': survey.active,
        'date': survey.date,
      }
    }

    return res.status(200).send(surveyList);
  });

}
exports.getOneSurvey = (req, res, next) => {
  const surveyId = req.params.surveyId;
  // ROUTER checks for existence of surveyId. no need to have a check here as well.
  Survey.findById( surveyId, (err, survey) => {
    if (!survey) {
      return res.status(404).send({message: status.SURVEY_NOT_FOUND.message, status: status.SURVEY_NOT_FOUND.code});
    }
    if (err) { return next(err); }

    return res.status(200).send(survey);
  });
}



// PATCH
exports.patchOneSurvey = (req, res, next) => {
  const surveyId = req.params.surveyId;
  // ROUTER checks for existence of surveyId. no need to have a check here as well.

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
  Survey.findByIdAndUpdate( surveyId, {$set: survey, $inc: { __v: 1 }}, {new: true, }, (err, survey) => {
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

  Survey.findByIdAndRemove( surveyId, (err, survey) => {
    if (!survey) {
      return res.status(404).send({message: status.SURVEY_NOT_FOUND.message, status: status.SURVEY_NOT_FOUND.code});
    }
    if (err) { return next(err); }
    return res.status(200).send({message: 'Success! - it is no more'});
  });
}


// JSON


exports.getAllSurveysAsJson = (req, res, next) => {
  Survey.find({}, (err, surveys) => {
    if (!surveys) {
      return res.status(404).send({message: status.SURVEY_NOT_FOUND.message, status: status.SURVEY_NOT_FOUND.code});
    }
    if (err) { return next(err); }

    const file = 'temp/data.json';

    jsonfile.writeFile(file, surveys, {spaces: 2}, function(err) {
      // return res.status(200).download( file );
      res.download(file, 'report.pdf', function(err){
      if (err) {
        // Handle error, but keep in mind the response may be partially-sent
        // so check res.headersSent
        fs.unlink('temp/data.json', (err) => {
          if (err) {console.error(err);};
          if(config.util.getEnv('NODE_ENV') !== 'test') {
              console.log('SUCCESS - successfully deleted temp/data.json');
            };
          });
      } else {
        // decrement a download credit, etc.
        fs.unlink('temp/data.json', (err) => {
          if (err) {console.error(err);};
          // console.log(config.util.getEnv('NODE_ENV'));
          if(config.util.getEnv('NODE_ENV') !== 'test') {
              console.log('SUCCESS - successfully deleted temp/data.json');
            };
        });
      }
      });
    });
  });
}

exports.getSurveyAsJson = (req, res, next) => {
  const surveyId = req.params.surveyId
  if (!surveyId) {
    return res.status(400).send( {message: status.SURVEY_NOT_FOUND.message, status: status.SURVEY_NOT_FOUND.code})
  }
  Survey.findById(surveyId, (err, survey) => {
    if (!survey) {
      return res.status(404).send({message: status.SURVEY_NOT_FOUND.message, status: status.SURVEY_NOT_FOUND.code});
    }
    if (err) { return next(err); }

    const file = 'temp/data.json';

    jsonfile.writeFile(file, survey, {spaces: 2}, function(err) {
      // return res.status(200).download( file );
      // TODO: GIVE THE REPORT A BETTER NAME!
      res.download(file, 'report.json', function(err){
      if (err) {
        // Handle error, but keep in mind the response may be partially-sent
        // so check res.headersSent
        fs.unlink('temp/data.json', (err) => {
          if (err) {console.error(err);};
          if(config.util.getEnv('NODE_ENV') !== 'test') {
              console.log('SUCCESS - successfully deleted temp/data.json');
            };
          });
      } else {
        // decrement a download credit, etc.
        fs.unlink('temp/data.json', (err) => {
          if (err) {console.error(err);};
          // console.log(config.util.getEnv('NODE_ENV'));
          if(config.util.getEnv('NODE_ENV') !== 'test') {
              console.log('SUCCESS - successfully deleted temp/data.json');
            };
        });
      }
      });
    });
  });
}




exports.getSurveyAsCSV = (req, res, next) => {
    const surveyId = req.params.surveyId
    if (!surveyId) {
      return res.status(400).send( {message: status.SURVEY_NOT_FOUND.message, status: status.SURVEY_NOT_FOUND.code})
    }
    Survey.findById(surveyId, (err, survey) => {
    if (!survey) {
      return res.status(404).send({message: status.SURVEY_NOT_FOUND.message, status: status.SURVEY_NOT_FOUND.code});
    }
    if (err) { return next(err); }

    const file = 'temp/data.csv';

    let myList  = [];
    let qNumber = 0
    let questionAnswar = []
    let fields  = ['1', '2', '3', '4','5','6'];


      for (let question of survey.questionlist){
        questionAnswar = question.answer;
        let questionAnswarCount = new Map([...new Set(questionAnswar)].map(
            x => [x, questionAnswar.filter(y => y === x).length]
        ));
        myList.push({
          "1": question.lang.no.txt
        });
        myList.push({
          "1": question.lang.no.options[0] || 0,
          "2": question.lang.no.options[1] || 0,
          "3": question.lang.no.options[2] || 0,
          "4": question.lang.no.options[3] || 0,
          "5": question.lang.no.options[4] || 0,
          "6": question.lang.no.options[5] || 0,
        });
        myList.push({
          "1": questionAnswarCount.get(1) || 0,
          "2": questionAnswarCount.get(2) || 0,
          "3": questionAnswarCount.get(3) || 0,
          "4": questionAnswarCount.get(4) || 0,
          "5": questionAnswarCount.get(5) || 0,
          "6": questionAnswarCount.get(6) || 0,
        });
        qNumber += 1;
      }


    let csv = json2csv({ data: myList, fields: fields });
    // Delete fieds - we dont want them
    let lines = csv.split('\n');
    lines.splice(0,1);
    csv = lines.join('\n');

    // TODO: delete file after sending it
    fs.writeFile('temp/data.csv', csv, function(err) {
      if (err) {
        throw err;
      } else {
        console.log('SUCCESS - file saved!');
        res.status(200).send({message: 'made it'});
        return res.download(file, 'data.csv', function(err){
          if (err) {
            // Handle error, but keep in mind the response may be partially-sent
            // so check res.headersSent
            fs.unlink('temp/data.csv', (err) => {
              if (err) {console.error(err);};
              if(config.util.getEnv('NODE_ENV') !== 'test') {
                  console.log('SUCCESS - successfully deleted temp/data.csv');
                };
              });
          } else {
            // decrement a download credit, etc.
            fs.unlink('temp/data.csv', (err) => {
              if (err) {console.error(err);};
              // console.log(config.util.getEnv('NODE_ENV'));
              if(config.util.getEnv('NODE_ENV') !== 'test') {
                  console.log('SUCCESS - successfully deleted temp/data.csv');
                };
            });
          }
          // end of download
        })

      }
    });

  });
}
