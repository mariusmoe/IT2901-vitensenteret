const mongoose = require('mongoose'),
      Schema = mongoose.Schema;
/*
 |--------------------------------------------------------------------------
 | Survey schema
 |--------------------------------------------------------------------------
*/
const SurveySchema = new Schema({
  name: {
    type: String
  },
	date: Date,
	questionlist: [{
    mode: {
        type: String,
        enum: ['smily', 'text'],
        default: 'smily'
      },
		eng: {
			txt: String,
			options: [String]
			},
		nor: {
			txt: String,
			options: [String]
    },
		answer: [Number]
});


module.exports = mongoose.model('Survey', SurveySchema);
