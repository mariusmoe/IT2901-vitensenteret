const mongoose = require('mongoose'),
      Schema = mongoose.Schema;
/*
 |--------------------------------------------------------------------------
 | Survey schema
 |--------------------------------------------------------------------------
*/
const responseSchema = new Schema({
  nickname: String,
  timestamp: Date,
  surveyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Survey' , index: true},
  questionlist: [{
    type: Schema.Types.Mixed
  }]
});

module.exports = mongoose.model('Response', responseSchema);
