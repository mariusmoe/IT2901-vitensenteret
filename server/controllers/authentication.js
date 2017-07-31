"use strict";

const jwt = require('jsonwebtoken'),
      crypto = require('crypto'),
      validator = require('validator'),
      config = require('config'),
      User = require('../models/user'),
      Center = require('../models/center'),
      UserFolder = require('../models/userFolder'),
      Referral = require('../models/referral'),
      status = require('../status');

const userTypes = ['sysadmin', 'vitenleader', 'user'];

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
    user: user,
    center: req.user.center
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
  if(req.user.role === userTypes[0]) {
    User.findByIdAndRemove(id, (err) => {
      if (err) { return next(err); }
      res.status(200).send({message: "deleted user"})
    })
  } else {  // request belong to a vitenleader
    // Check if the user that is to be deleted belongs to the same center as
    // the leader
    User.findById(id, (err, foundUser) => {
      if (err) { return next(err); }
      if (req.user.center.toString() !== foundUser.center.toString()) {
        return res.status(401).send({message: status.WRONG_CENTER.message, status: status.WRONG_CENTER.code})
      } else { // vitenleaders center is the same as the user that is to be deleted
        foundUser.remove((err) => {
          if (err) { return next(err); }
          res.status(200).send({message: "deleted user"})
        });
      }
    })
  }
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
    user: user,
    center: req.user.center
  });
}

/**
 * Register a new user
 */
exports.register = (req, res, next) => {
  const password        = req.body.password,
        confirm_string  = req.body.referral_string;
  let   email           = req.body.email; // must be non-const

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
          role:       existingReferral.role,
          center:     existingReferral.center
        });
        user.save((err4, newUser) => {
          if (err4) {return next(err4); }
          let folder = new UserFolder({ user: newUser, isRoot: true, title: 'Root'});
          folder.save((err5, f) => {
            if (err5) { next(err5); }
            res.status(200).send({message: status.ACCOUNT_CREATED.message, status: status.ACCOUNT_CREATED.code} )
          });
        });
      });
    });
  });
}


/**
 * get all users
 */
exports.getAllUsers = (req, res, next) => {
  // Find only users that belong to the user's center. If the user is a sysadmin
  // all users are to be returned.

  // Check if user is sysadmin
  if (req.user.role === userTypes[0]) {
    User.find({}, { 'email': true, 'role': true, 'center': true }, (err, users) => {
      if (!users) {
        // essentially means not one survey exists that match {} - i.e. 0 surveys in db? should be status: 200, empty list then?
        return res.status(200).send({message: status.ROUTE_USERS_VALID_NO_USERS.message, status: status.ROUTE_USERS_VALID_NO_USERS.code});
      }
      if (err) { return next(err); }

      return res.status(200).send(users);
    }).lean();
  } else { // User is a vitenleader
    User.find({center: req.user.center}, { 'email': true, 'role': true, 'center': true }, (err, users) => {
      if (!users) {
        // essentially means not one survey exists that match {} - i.e. 0 surveys in db? should be status: 200, empty list then?
        return res.status(200).send({message: status.ROUTE_USERS_VALID_NO_USERS.message, status: status.ROUTE_USERS_VALID_NO_USERS.code});
      }
      if (err) { return next(err); }

      return res.status(200).send(users);
    }).lean();

  }
}

/**
 * development
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
       password: password,
       role: 'sysadmin'
     });

     user.save((err4, user) => {
       if (err4) {return next(err4); }
       let folder = new UserFolder({ user: user, isRoot: true, title: 'Root'});
       folder.save((err5, f) => {
         if (err5) { next(err5); }
         res.status(200).send({message: status.ACCOUNT_CREATED.message, status: status.ACCOUNT_CREATED.code} )
       });
     });
   });
 }
 exports.register_testdata = (req, res, next) => {
   let center = new Center({
     "name": "Test testcenter",
     "password": "0000",
   });
   center.save((err, center) => {
     let user = new User({
       email: 'testuser@test.test',
       password: 'test',
       role: 'vitenleader',
       center: center._id
     });
     user.save((err4, user) => {
       if (err4) {return next(err4); }
       let folder = new UserFolder({ user: user, isRoot: true, title: 'Root'});
       folder.save((err5, f) => {
         if (err5) { next(err5); }
         res.status(200).send({
           message: status.ACCOUNT_CREATED.message,
           status: status.ACCOUNT_CREATED.code,
           center: center,
           user: user,
           folder: f,
         });
       });
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
    let centerId;
    // prevent roles from refering users with greater powers
    if (userTypes.indexOf(foundUser.role) > userTypes.indexOf(role)) {
      return res.status(422).json({error: status.INSUFFICIENT_PRIVILEGES.message, status: status.INSUFFICIENT_PRIVILEGES.code});
    }
    if (foundUser.role ==='vitenleader') {
      // set center to same as creator
      centerId = foundUser.center;
    } else {
      centerId = req.params.centerId
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
          role:      role,
          center: role==='sysadmin' ? undefined : centerId
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
        res.status(422).json({error: status.USER_NOT_FOUND.message, status: status.USER_NOT_FOUND.code});
        return next(err);
      }
      if(foundUser.role == role){
        return next();
      }
      res.status(401).json({error: 'You are not authorized.'});
      return next('Unauthorized');
    })
  }
}

exports.roleAuthorizationUp = function(role){
  return function(req,res,next){

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
    res.status(422).json({ error: status.NO_EMAIL_OR_PASSWORD.message, status: status.NO_EMAIL_OR_PASSWORD.code });
    return next(err);
  }
  User.findById(req.user._id, function(err, user) {
    if (err) {
      res.status(422).json({ error: status.USER_NOT_FOUND.message, status: status.USER_NOT_FOUND.code });
      return next(err);
    }
    User.findOne({email: req.body.email.newEmail}, (err, emailAlreadyExisting) => {
      if (emailAlreadyExisting) {
        return res.status(422).send({error: status.USER_NOT_FOUND.message, status: status.USER_NOT_FOUND.code})
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
      res.status(422).json({ error: status.USER_NOT_FOUND.message, status: status.USER_NOT_FOUND.code });
      return next(err);
    }
    if (req.body.password == '') {
      res.status(422).json({ error: status.NO_EMAIL_OR_PASSWORD.message, status: status.NO_EMAIL_OR_PASSWORD.code });
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
