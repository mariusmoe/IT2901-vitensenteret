"use strict";

const jwt = require('jsonwebtoken'),
      crypto = require('crypto'),
      User = require('../models/user'),
      config = require('../libs/config'),
      status = require('../status')

/**
 * getSecureRandomBytes in hex format
 * @return {String} A random string of text
 */
function getSecureRandomBytes() {
    crypto.randomBytes(48, function(err, buffer) {
    if (err) { return next(err); }
    const token = buffer.toString('hex');
    console.log(token);
  });
}


exports.login = (req, res, next) => {
  
}
