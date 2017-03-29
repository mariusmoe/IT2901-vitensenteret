const mongoose = require('mongoose'),
      Schema = mongoose.Schema;
/*
 |--------------------------------------------------------------------------
 | Survey schema
 |--------------------------------------------------------------------------
*/
const nicknameSchema = new Schema({
  nickname: {
    type: String,
    unique: true
  },
  surveyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Survey' , index: true},
  uniqueName: String,   // unique nickname
  expirationDate: {
    type: Date,
    expires:  60*60*24,  // expire after 24h
    default: Date.now
  }
});

module.exports = mongoose.model('Nickname', nicknameSchema);
