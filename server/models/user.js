const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      bcrypt = require('bcrypt-nodejs')

/*
 |--------------------------------------------------------------------------
 | User schema
 |--------------------------------------------------------------------------
*/
const UserSchema = new Schema({
  email: {
    type: String,
    lowercase: true,
    unique: true,
    required: true
  },
  password: {
    // Not in clear text
    type: String,
    required: true
  },
  role: {
    // Decide which user priveleges the user is granted
    rank: { type: String,
      enum: ['sysadmin', 'vitenleader', 'user'],
      default: 'user'
    },
    center: { mongoose.Schema.Types.ObjectId, ref: 'Center' }
  },
  active: {
    // Verified by email
    type: Boolean,
    default: false
  },

},
{
  timestamps: true
});


// Before saving do the following
UserSchema.pre('save', function(next) {
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
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) { return cb(err); }

    cb(null, isMatch);
  });
}

module.exports = mongoose.model('User', UserSchema);
