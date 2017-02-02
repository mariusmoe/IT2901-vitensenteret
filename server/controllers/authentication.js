"use strict";

const jwt = require('jsonwebtoken'),
      crypto = require('crypto'),
      validator = require('validator'),
      User = require('../models/user'),
      config = require('../libs/config'),
      status = require('../status'),
      referral = require('../models/referral');

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

exports.register = (req, res, next) => {
  let confirm_string = req.params.refferal_string;


  // TODO: fix refferal link
  const email     = req.body.email,
        password  = req.body.password;

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
        res.status(200).send({message: status.REFERRAL_CREATED.message, status: status.REFERRAL_CREATED.code, referral: referral} )
      })
    })


    // let refferalBaseLink = 'http://it2810-02.idi.ntnu.no:2000/api/auth/confirm_account/';
    let refferalBaseLink = 'http://localhost:2000/api/auth/register/';  // NEED to be changed in production
    res.status(200).send({message: refferalBaseLink + token })
  });
}
