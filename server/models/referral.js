const mongoose = require('mongoose'),
      Schema = mongoose.Schema;


const ReferralSchema = new Schema({
  expirationDate: {
    type: Date,
    expires:  60*60*24*365/2,  // expire after half a year
    default: Date.now
  },
  referral: {
    type: String,
    required: true
  },
  issued_date: {
    type: Date,
    default: Date.now
  },
  activeExpiration: {
    type: Date,
    default: new Date(+new Date() + 14*24*60*60*1000),
  },
  active: {
    type: Boolean,
    default: true,
  },
  role: {
    // Decide which user priveleges the user is granted
    type: String,
    enum: ['sysadmin', 'vitenleader', 'user'],
    default: 'user'
  },
  center: {type: mongoose.Schema.Types.ObjectId, ref: 'Center' }

})
module.exports = mongoose.model('Referral', ReferralSchema);
