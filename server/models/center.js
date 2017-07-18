const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      bcrypt = require('bcrypt-nodejs');
/*
 |--------------------------------------------------------------------------
 | Survey schema
 |--------------------------------------------------------------------------
*/
const centerSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  pathToLogo: {
    type: String
  },
  password: {
    // Not in clear text
    type: String,
    required: true
  }
});


// Before saving do the following
centerSchema.pre('save', function(next) {
  const user = this,
        SALT_FACTOR = 10;
  if (!user.isModified('password')) return next();
  bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
    if (err) return next(err);
    bcrypt.hash(user.password, salt, null, function(err, hash) {
      if (err) return next(err);
      user.password = hash;
      next();
    });
  });
});

// Compare password
centerSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return cb(err); }

    cb(null, isMatch);
  });
}

module.exports = mongoose.model('Center', centerSchema);
