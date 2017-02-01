const mongoose = require('mongoose'),
      Schema = mongoose.Schema;


const ReferralSchema = new Schema({
  referral: {
    type: String,
    required: true
  }
  issued_date: Date,
  expirationDate: {
    type: Date,
    expires:  60*60*24*14,  // expire after two weeks
    default: Date.now
  }

})
module.exports = mongoose.model('Referral', ReferralSchema);
