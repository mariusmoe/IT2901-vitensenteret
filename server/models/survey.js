const mongoose = require('mongoose'),
      Schema = mongoose.Schema;
/*
 |--------------------------------------------------------------------------
 | Survey schema
 |--------------------------------------------------------------------------
*/

// IF THIS CHANGES, DO UPDATE libs/validation.js!!
const SurveySchema = new Schema({
  name: {
    type: String,
    required: true
  },
  comment: String,
	date: Date,                // date created
  activationDate: {
    type: Date
    default: Date.now
  },     // date survey became active
  deactivationDate: Date,   // date survey became deactivated
  active: Boolean,
  endMessage: {
    en: String,
    no: String,
  },
	questionlist: [{
    mode: {
      type: String,
      enum: ['binary', 'star', 'multi', 'smiley', 'text'],
      default: 'smily'
    },
    lang: {
      en: {
        txt: String,
        options: [String]
        },
      no: {
        txt: String,
        options: [String]
      },
    }
  }]
});

const responseSchema = new Schema({
  nickname: String,
  timestamp: Date,
  surveyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Survey' },
  questionlist: [{
    answerText: String,
    answerNumber: Number,
    answerMultiple: [Number],
  }]
});

module.exports = mongoose.model('Survey', SurveySchema);
module.exports = mongoose.model('Response', responseSchema);
