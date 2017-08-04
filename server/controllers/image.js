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


// Upload folder should be different on production than in dev mode bacause they
// look for assets in diffrent folders
let UPLOAD_FOLDER ='';
let UPLOAD_FOLDER_MANUALS ='';
if (config.util.getEnv('NODE_ENV') == 'production') {
  UPLOAD_FOLDER = __dirname +'/../../client_viten/dist/assets/uploads/'
  UPLOAD_FOLDER_MANUALS = __dirname +'/../../client_viten/dist/assets/manuals/'
} else {
  UPLOAD_FOLDER = __dirname +'/../../client_viten/src/assets/uploads/'
  UPLOAD_FOLDER_MANUALS = __dirname +'/../../client_viten/src/assets/manuals/'
}

// Require login/auth
const requireAuth   = passport.authenticate('jwt', { session: false });

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

// Also called magic numbers
// all files of filetype gif will contain the string '47494638'
var IMAGE_SIGNATURES = {
	jpg: 'ffd8ffe0',
	jpg1: 'ffd8ffe1',
	png: '89504e47',
	gif: '47494638'
}

var PDF_SIGNATURE = {
  pdf: '25504446'
}

/**
 * check if incomming file contain magic numbers / signature
 * @param  {string} signature Image in string format
 * @return {[type]}           [description]
 */
function checkSignatureNumbers(signature) {
	if (signature == IMAGE_SIGNATURES.jpg || signature == IMAGE_SIGNATURES.jpg1 || signature == IMAGE_SIGNATURES.png || signature == IMAGE_SIGNATURES.gif) return true
}
function checkSignatureNumbersPDF(signature) {
	if (signature == PDF_SIGNATURE.pdf) return true
}

/**
 * Upload a logo
 * Sysadmins can provide a center that will get the logout
 * vitenleaders can onlu upload logos to their respective centers.
 */
imageRoutes.post('/center', requireAuth, function(req, res, next) {
  let centerId;

  var storage = multer.diskStorage({
  	destination: function(req, file, callback) {
  		callback(null, UPLOAD_FOLDER)
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
      console.log(UPLOAD_FOLDER);
      console.log(err);
      return res.status(400).send( {message: status.FAILED_UPLOAD.message, status: status.FAILED_UPLOAD.code})
    }

    if (typeof req.user.center == 'undefined') {
      // Create a string to use for checking against signature numbers (magic numbers)
      var bitmap = fs.readFileSync(UPLOAD_FOLDER + req.body.center + path.extname(req.files['file'][0].filename)).toString('hex', 0, 4)
      // console.log(file);
    } else {
      var bitmap = fs.readFileSync(UPLOAD_FOLDER + req.files['file'][0].filename).toString('hex', 0, 4)
    }


    // var bitmap = fs.readFileSync('./uploads/' + req.files['file'][0].filename).toString('hex', 0, 4)
		if (!checkSignatureNumbers(bitmap)) {
      if (typeof req.user.center == 'undefined') {
        // Delete the file if it is not the expected filetype
        fs.unlinkSync(UPLOAD_FOLDER + req.body.center + path.extname(req.files['file'][0].filename))
        return res.end('File is no valid')
      } else {
        fs.unlinkSync(UPLOAD_FOLDER + req.files['file'][0].filename)
  			return res.end('File is no valid')      }
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



/**
 * upload new documentation in pdf format
 */
imageRoutes.post('/doc', requireAuth, function(req, res, next) {

  var storage = multer.diskStorage({
  	destination: function(req, file, callback) {
  		callback(null, UPLOAD_FOLDER_MANUALS)
  	},
  	filename: function(req, file, callback) {
  		callback(null, 'manual-usermanual-2.pdf')
  	}
  })
	var upload = multer({
		storage: storage
	}).single('file')
	upload(req, res, function(err) {
    if (err) {
      console.log(UPLOAD_FOLDER_MANUALS);
      console.log(err);
      return res.status(400).send( {message: status.FAILED_UPLOAD.message, status: status.FAILED_UPLOAD.code})
    }
    var bitmap = fs.readFileSync(UPLOAD_FOLDER_MANUALS + 'manual-usermanual-2.pdf').toString('hex', 0, 4)

    if (!checkSignatureNumbersPDF(bitmap)) {
      fs.unlinkSync(UPLOAD_FOLDER_MANUALS + 'manual-usermanual-2.pdf')
      return res.status(400).send({message: status.FILE_INVALID.message, status: status.FILE_INVALID.code});
		}

    return res.status(200).send( {message: status.UPLOAD_SUCCESS.message, status: status.UPLOAD_SUCCESS.code})
	})
})



app.use('/api', apiRoutes);

}
