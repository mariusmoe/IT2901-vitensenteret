const mongoose = require('mongoose'),
      Schema = mongoose.Schema;
/*
 |--------------------------------------------------------------------------
 | prePostSchema
 |--------------------------------------------------------------------------
*/

const prePostSchema = new Schema({
  preKey:   { type: mongoose.Schema.Types.ObjectId, ref: 'Survey'},
  postKey:  { type: mongoose.Schema.Types.ObjectId, ref: 'Survey'}
})
module.exports = mongoose.model('PrePost', prePostSchema);
