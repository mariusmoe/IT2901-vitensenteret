"use strict";

const jwt = require('jsonwebtoken'),
      crypto = require('crypto'),
      validator = require('validator'),
      config = require('config'),
      User = require('../models/user'),
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
 * renew JWT
 * @return {Object}   response object with new token and user
 */
exports.getJWT = (req, res, next) => {
  let user = { _id: req.user._id, email: req.user.email, role: req.user.role }
  res.status(200).json({
    token: 'JWT ' + generateToken(user),
    user: user
  });
}

/**
 * Delete one account
 */
exports.deleteAccount = (req, res, next) => {
  // let id = req.user._id;
  let id = req.body.id
  if (!id){
    res.status(400).send({message: status.USER_NOT_FOUND.message, status: status.USER_NOT_FOUND.code})
  }
  User.findByIdAndRemove(id, (err) => {
    if (err) { return next(err); }
    res.status(200).send({message: "deleted user"})
  })
}

/**
 * Log in a user
 *
 * respond with a json object with a Json web token and the user
 */
exports.login = (req, res, next) => {
  let user = { _id: req.user._id, email: req.user.email, role: req.user.role }
  res.status(200).json({
    token: 'JWT ' + generateToken(user),
    user: user
  });
}

/**
 * Register a new user
 */
exports.register = (req, res, next) => {
  const password        = req.body.password,
        confirm_string  = req.body.referral_string;
  let   email           = req.body.email;


  if (validator.isEmpty(email)){
    return res.status(401).send({message: status.NO_EMAIL_OR_PASSWORD.message, status: status.NO_EMAIL_OR_PASSWORD.code} )
  }
  if (validator.isEmpty(password)){
    return res.status(401).send({message: status.NO_EMAIL_OR_PASSWORD.message, status: status.NO_EMAIL_OR_PASSWORD.code} )
  }
  if (validator.isEmpty(confirm_string)){
    return res.status(401).send({message: status.NO_REFERRAL_LINK.message, status: status.NO_REFERRAL_LINK.code} )
  }

  email = email.toLowerCase(); // use lower case to avoid case sensitivity issues later


  User.findOne({email: email}, (err1, emailAlreadyExisting) => {
    if (err1) { return next(err1); }

    Referral.findOne({referral: confirm_string}, (err2, existingReferral) => {
      if (err2) { return next(err2); }

      // check if the email is already in use first
      if (emailAlreadyExisting) {
        return res.status(401).send({ message: status.EMAIL_NOT_AVILIABLE.message, status: status.EMAIL_NOT_AVILIABLE.code });
      }

      // if we're good on the email, lets check the actual referral link
      if (!existingReferral) {
        return res.status(422).send( { message: status.REFERRAL_LINK_WRONG.message, status: status.REFERRAL_LINK_WRONG.code } );
      }
      if (!existingReferral.active) {
        return res.status(401).send( { message: status.REFERRAL_LINK_USED.message, status: status.REFERRAL_LINK_USED.code } );
      }
      if (existingReferral.activeExpiration.getTime() <= new Date().getTime()) {
        return res.status(422).send( { message: status.REFERRAL_LINK_EXPIRED.message, status: status.REFERRAL_LINK_EXPIRED.code } );
      } else {
        // set the active to false! important!
        existingReferral.active = false;
      }
      // save
      existingReferral.save((err3) => {
        if (err3) { return next(err3); }
        let user = new User({
          email:      email,
          password:   password,
          role:       existingReferral.role
        });
        user.save((err, user) => {
          if (err) {return next(err); }
          res.status(200).send({message: status.ACCOUNT_CREATED.message, status: status.ACCOUNT_CREATED.code} )
        });
      });
    });
  });
}




/**
 * get all users
 */
exports.getAllUsers = (req, res, next) => {
  User.find({}, {'email': true, 'role': true}, (err, users) => {
    if (!users) {
      // essentially means not one survey exists that match {} - i.e. 0 surveys in db? should be status: 200, empty list then?
      return res.status(200).send({message: status.ROUTE_USERS_VALID_NO_USERS.message, status: status.ROUTE_USERS_VALID_NO_USERS.code});
    }
    if (err) { return next(err); }

    return res.status(200).send(users);
  }).lean();
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
       return res.status(422).send( {message: status.EMAIL_NOT_AVILIABLE.message, status: status.EMAIL_NOT_AVILIABLE.code} );
     }

     let user = new User({
       email: email,
       password: password,
       role: 'sysadmin'
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
  let role = req.params.role
  const userTypes = ['sysadmin', 'vitenleader', 'user'];
  if (!userTypes.includes(role)){
    return res.status(422).send( {error: status.ROLE_INCORRECT.message, status: status.ROLE_INCORRECT.code} );
  }
  let id = req.user._id;

  User.findById(id, function(err,foundUser){
    if(err){
      res.status(422).json({error: status.USER_NOT_FOUND.message, status: status.USER_NOT_FOUND.code});
      return next(err);
    }
    // prevent roles from refering users with greater powers
    if (userTypes.indexOf(foundUser.role) > userTypes.indexOf(role)) {
      return res.status(422).json({error: status.INSUFFICIENT_PRIVILEGES .message, status: status.INSUFFICIENT_PRIVILEGES.code});
    }
    crypto.randomBytes(48, function(err, buffer) {
      if (err) { return next(err); }
      const token = buffer.toString('hex');
      Referral.findOne({referral: token}, (err, existingReferralLink) => {
        if (existingReferralLink) {
          return res.status(422).send( {error: status.TRY_AGAIN.message, status: status.TRY_AGAIN.code} );
        }
        if (err) { return next(err); }
        let referralString = new Referral({
          referral:  token,
          role:      role
        })
        referralString.save((err, referral) => {
          if (err) {return next(err); }
          let refferalBaseLink = req.headers.host.slice(0,req.headers.host.indexOf(':')) + '/register/';
          // console.log(req.headers.host);
          res.status(200).send({message: status.REFERRAL_CREATED.message, link: refferalBaseLink + token, status: status.REFERRAL_CREATED.code })
        });
      })
    })
  });
}


exports.roleAuthorization = function(role){
  return function(req,res,next){
    let id = req.user._id;

    User.findById(id, function(err,foundUser){
      if(err){
        res.status(422).json({message: status.USER_NOT_FOUND.message, status: status.USER_NOT_FOUND.code});
        return next(err);
      }
      if(foundUser.role == role){
        return next();
      }
      res.status(401).json({message: 'You are not authorized.'});
      return next('Unauthorized');
    })
  }
}

exports.roleAuthorizationUp = function(role){
  return function(req,res,next){
    const userTypes = ['sysadmin', 'vitenleader', 'user'];
    let id = req.user._id;

    User.findById(id, function(err,foundUser){
      if(err){
        res.status(422).json({error: status.USER_NOT_FOUND.message, status: status.USER_NOT_FOUND.code});
        return next(err);
      }
      if (userTypes.indexOf(foundUser.role) <= userTypes.indexOf(role)) {
        return next();
      }
      res.status(401).json({error: status.INSUFFICIENT_PRIVILEGES .message, status: status.INSUFFICIENT_PRIVILEGES.code});
      return next('Unauthorized');
    })
  }
}

exports.changeEmail = function(req, res, next) {
  if (!req.body.email.newEmail || req.body.email.newEmail === '') {
    res.status(422).json({ message: status.NO_EMAIL_OR_PASSWORD.message, status: status.NO_EMAIL_OR_PASSWORD.code });
    return next(err);
  }
  User.findById(req.user._id, function(err, user) {
    if (err) {
      res.status(422).json({ message: status.USER_NOT_FOUND.message, status: status.USER_NOT_FOUND.code });
      return next(err);
    }
    User.findOne({email: req.body.email.newEmail}, (err, emailAlreadyExisting) => {
      if (emailAlreadyExisting) {
        return res.status(422).send({message: status.USER_NOT_FOUND.message, status: status.USER_NOT_FOUND.code})
      }
      user.email = req.body.email.newEmail;
      user.save(function(err){
        if(err){
          throw err;
        }
        return res.status(200).send({message: status.EMAIL_CHANGED.message, status: status.EMAIL_CHANGED.code})
      });
    });
  });
}

exports.changePassword = (req, res, next) => {
  User.findById(req.user._id, function(err, user) {
    if (err) {
      res.status(422).json({ message: status.USER_NOT_FOUND.message, status: status.USER_NOT_FOUND.code });
      return next(err);
    }
    if (req.body.password == '') {
      res.status(422).json({ message: status.NO_EMAIL_OR_PASSWORD.message, status: status.NO_EMAIL_OR_PASSWORD.code });
      return next(err);
    }
    user.password = req.body.password
    user.save((err) => {
      if(err){
        throw err;
      }
      return res.status(200).send({message: status.PASSWORD_CHANGED.message, status: status.PASSWORD_CHANGED.code})
    });
  });
}

exports.test = (req, res, next) => {
  res.status(200).send({message: 'Welcome sir, you have the right privelages to view this content' })
}
