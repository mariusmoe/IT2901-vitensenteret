const mongoose = require('mongoose'),
      Schema = mongoose.Schema;
/*
 |--------------------------------------------------------------------------
 | Survey schema
 |--------------------------------------------------------------------------
*/
const centerSchema = new Schema({
  name: {
    type: String,
    unique: true
  },
  pathToLogo: {
    type: String
  }
});

module.exports = mongoose.model('Center', centerSchema);
