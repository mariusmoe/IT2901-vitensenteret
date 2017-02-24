const mongoose = require('mongoose'),
      Schema = mongoose.Schema;
/*
 |--------------------------------------------------------------------------
 | Survey schema
 |--------------------------------------------------------------------------
*/

// IF THIS CHANGES, DO UPDATE libs/validation.js!!
const SurveySchema = new Schema({
  name: String,
  comment: String,
	date: Date,
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
    },
		answer: [Number]
  }]
});


module.exports = mongoose.model('Survey', SurveySchema);
