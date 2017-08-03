// const mongoose = require('mongoose'),
//       Schema = mongoose.Schema,
//       bcrypt = require('bcrypt-nodejs')
//
// /*
//  |--------------------------------------------------------------------------
//  | User schema
//  |--------------------------------------------------------------------------
// */
// const EscapeSchema = new Schema({
//   activationDate: {          // date survey became active
//     type: Date,
//     default: Date.now
//   },
//   password: {
//     // Not in clear text
//     type: String,
//     required: true
//   }
// },
// {
//   timestamps: true
// });
//
//
// // Before saving do the following
// EscapeSchema.pre('save', function(next) {
//   const user = this,
//         SALT_FACTOR = 10;
//   if (!user.isModified('password')) return next();
//   bcrypt.genSalt(SALT_FACTOR, function(err, salt) {
//     if (err) return next(err);
//     bcrypt.hash(user.password, salt, null, function(err, hash) {
//       if (err) return next(err);
//       user.password = hash;
//       next();
//     });
//   });
// });
//
// // Compare password
// EscapeSchema.methods.comparePassword = function(candidatePassword, cb) {
//   bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
//     if (err) { return cb(err); }
//
//     cb(null, isMatch);
//   });
// }
//
// module.exports = mongoose.model('Escape', EscapeSchema);
