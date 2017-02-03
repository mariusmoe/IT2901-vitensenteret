"use strict";

const jwt = require('jsonwebtoken'),
      crypto = require('crypto'),
      validator = require('validator'),
      User = require('../models/user'),
      config = require('../libs/config'),
      status = require('../status'),
      Referral = require('../models/referral');

/**
 * getSecureRandomBytes in hex format
 * @return {String} A random string of text
 */
function getSecureRandomBytes() {
    crypto.randomBytes(48, function(err, buffer) {
      if (err) { return next(err); }
      const token = buffer.toString('hex');
    });
}

/**
 * generate a random token
 * @param  {User} user a user object
 * @return {Jwt}      a signed JWT
 */
function generateToken(user) {
  return jwt.sign(user, config.secret, {
    expiresIn: 10080 // in seconds
  });
}

/**
 * Log in a user
 *
 * respons with a json object with a Json web token and the user
 */
exports.login = (req, res, next) => {
  let user = {
    _id: req.user._id,
    email: req.user.email
  }
  res.status(200).json({
    token: 'JWT ' + generateToken(user),
    user: user
  });
}

/**
 * Register a new user
 */
exports.register = (req, res, next) => {
  const email     = req.body.email,
        password        = req.body.password,
        confirm_string  = req.body.referral_string;

  if (validator.isEmpty(email)){
    return res.status(401).send({message: status.NO_EMAIL_OR_PASSWORD.message, status: status.NO_EMAIL_OR_PASSWORD.code} )
  }
  if (validator.isEmpty(password)){
    return res.status(401).send({message: status.NO_EMAIL_OR_PASSWORD.message, status: status.NO_EMAIL_OR_PASSWORD.code} )
  }
  if (validator.isEmpty(confirm_string)){
    return res.status(401).send({message: status.NO_REFERRAL_LINK.message, status: status.NO_REFERRAL_LINK.code} )
  }

  Referral.findOne({referral: confirm_string}, (err, existingReferral) => {
    if (err) { return next(err); }

    if (!existingReferral.active) {
      return res.status(422).send( {error: status.NOT_AN_ACTIVE_REFERRAL.message} );
    } else {
      existingReferral.active = false;
    }

    if (!existingReferral) {
      return res.status(422).send( {error: status.NOT_AN_ACTIVE_REFERRAL.message} );
    }
    existingReferral.save((err) => {
      if (err) { return next(err); }
      User.findOne({ email: email }, (err, existingUser) => {
        if (err) { return next(err); }

        if (existingUser) {
          return res.status(422).send( {error: status.EMAIL_NOT_AVILIABLE.message} );
        }
        let user = new User({
          email: email,
          password: password
        });
        user.save((err, user) => {
          if (err) {return next(err); }
          res.status(200).send({message: status.ACCOUNT_CREATED.message, status: status.ACCOUNT_CREATED.code} )
        });
      });
    })
  });
}


/**
 * development
 * TODO: DELETE ME
 */
 /**
  * Register a new user
  */
 exports.register_developer = (req, res, next) => {
   const email     = req.body.email,
         password        = req.body.password;

   if (validator.isEmpty(email)){
     return res.status(401).send({message: status.NO_EMAIL_OR_PASSWORD.message, status: status.NO_EMAIL_OR_PASSWORD.code} )
   }
   if (validator.isEmpty(password)){
     return res.status(401).send({message: status.NO_EMAIL_OR_PASSWORD.message, status: status.NO_EMAIL_OR_PASSWORD.code} )
   }

   User.findOne({ email: email }, (err, existingUser) => {
     if (err) { return next(err); }

     if (existingUser) {
       return res.status(422).send( {error: status.EMAIL_NOT_AVILIABLE.message} );
     }
     let user = new User({
       email: email,
       password: password
     });
     user.save((err, user) => {
       if (err) {return next(err); }
       res.status(200).send({message: status.ACCOUNT_CREATED.message, status: status.ACCOUNT_CREATED.code} )
     });
   });


 }


/**
 * Get a new referral link
 */
exports.getReferralLink = (req, res, next) => {
  crypto.randomBytes(48, function(err, buffer) {
    if (err) { return next(err); }
    const token = buffer.toString('hex');
    Referral.findOne({referral: token}, (err, existingReferralLink) => {
      if (err) { return next(err); }
      if (existingReferralLink) {
        return res.status(422).send( {error: status.TRY_AGAIN.message, status: status.TRY_AGAIN.code} );
      }
      let referralString = new Referral({
        referral: token
      })
      referralString.save((err, referral) => {
        if (err) {return next(err); }
        let refferalBaseLink = 'http://localhost:2000/register/';  // TODO: NEED to be changed in production
        res.status(200).send({message: status.REFERRAL_CREATED.message, link: refferalBaseLink + token, status: status.REFERRAL_CREATED.code })
      });
    })
  })
}
