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
  center: {
    type: mongoose.Schema.Types.ObjectId, ref: 'Center',
    required: true
  },
  madeBy: {
    type: mongoose.Schema.Types.ObjectId, ref: 'User',
    required: true
  }
  isPost: Boolean,
  postKey: { type: mongoose.Schema.Types.ObjectId, ref: 'Survey'},
  comment: String,
	date: Date,                // date created
  activationDate: {          // date survey became active
    type: Date,
    default: Date.now
  },
  deactivationDate: Date,   // date survey became deactivated
  active: Boolean,
  endMessage: {
    en: String,
    no: String,
  },
	questionlist: [{
    mode: {
      type: String,
      enum: ['binary', 'star', 'single', 'multi', 'smiley', 'text'],
      //  0 or 1 , 0 - 4, 0 - n, [0 - n], 0 - 2, text
      default: 'smiley'
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
    required: { type: Boolean, default: true }
  }]
});

module.exports = mongoose.model('Survey', SurveySchema);
