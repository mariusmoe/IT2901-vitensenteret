"use strict";


const AuthenticationController = require('./authentication'),
      status = require('../status'),
      SurveyController = require('./surveys'),
      ErrorController = require('./error'),
      CenterController = require('./centers'),
      express = require('express'),
      passportService = require('../libs/passport'),
      passport = require('passport'),
      config = require('config'),
      Center = require('../models/center'),
      path = require('path'),
      multer    = require('multer'),
      fs = require('fs');

// const _storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/')
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '.jpg') //Appending .jpg
//   }
// })
//
// var upload = multer({ storage: _storage });


// Require login/auth
const requireAuth   = passport.authenticate('jwt', { session: false });
// const requireLogin  = passport.authenticate('local', { session: false });

// Role types enum: ['sysadmin', 'vitenleader', 'user'],
const REQUIRE_SYSADMIN = "sysadmin",
      REQUIRE_LEADER = "vitenleader",
      REQUIRE_USER = "user";

module.exports = (app) => {
  // route groups
  const apiRoutes  = express.Router(),
        imageRoutes = express.Router();
  // Set auth and survey routes as subgroup to apiRoutes
  apiRoutes.use('/image', imageRoutes);
  // Set a common fallback for /api/*; 404 for invalid route
  // apiRoutes.all('*', ErrorController.error);

/*
 |--------------------------------------------------------------------------
 | Image routes
 |--------------------------------------------------------------------------
*/


var IMAGE_SIGNATURES = {
	jpg: 'ffd8ffe0',
	jpg1: 'ffd8ffe1',
	png: '89504e47',
	gif: '47494638'
}
function checkSignatureNumbers(signature) {
	if (signature == IMAGE_SIGNATURES.jpg || signature == IMAGE_SIGNATURES.jpg1 || signature == IMAGE_SIGNATURES.png || signature == IMAGE_SIGNATURES.gif) return true
}

imageRoutes.post('/center', requireAuth, function(req, res) {
  let centerId;

  var storage = multer.diskStorage({
  	destination: function(req, file, callback) {
  		callback(null, './uploads')
  	},
  	filename: function(req, file, callback) {
      if (typeof req.user.center == 'undefined') {
        centerId = req.body.center;
      } else {
        centerId = req.user.center;
      }
  		callback(null, centerId + path.extname(file.originalname))
  	}
  })
	var upload = multer({
		storage: storage
	}).fields([{ name: 'file', maxCount: 1 }, { name: 'center', maxCount: 1 }])
	upload(req, res, function(err) {
    if (err) {
      return res.status(400).send( {message: status.FAILED_UPLOAD.message, status: status.FAILED_UPLOAD.code})
    }

    if (typeof req.user.center == 'undefined') {
      var bitmap = fs.readFileSync('./uploads/' + req.body.center + path.extname(req.files['file'][0].filename)).toString('hex', 0, 4)
      // console.log(file);
    } else {
      var bitmap = fs.readFileSync('./uploads/' + req.files['file'][0].filename).toString('hex', 0, 4)
    }


    // var bitmap = fs.readFileSync('./uploads/' + req.files['file'][0].filename).toString('hex', 0, 4)
		if (!checkSignatureNumbers(bitmap)) {
      if (typeof req.user.center == 'undefined') {
        fs.unlinkSync('./uploads/' + req.body.center + path.extname(req.files['file'][0].filename))
        res.end('File is no valid')
      } else {
        fs.unlinkSync('./uploads/' + req.files['file'][0].filename)
  			res.end('File is no valid')      }
		}

    let fileName;
    if (typeof req.user.center == 'undefined') {
      centerId = req.body.center;
      fileName = req.body.center + path.extname(req.files['file'][0].filename).toString('hex', 0, 4);
    } else {
      centerId = req.user.center;
      fileName = req.files['file'][0].filename.toString('hex', 0, 4);
    }
    Center.findByIdAndUpdate(centerId, {pathToLogo: fileName}, (err, foundCenter) => {
      if (err) { return next(err); }
      return res.status(200).send( {message: status.UPLOAD_SUCCESS.message, status: status.UPLOAD_SUCCESS.code})
    })
	})
})



app.use('/api', apiRoutes);

}
