const mongoose = require('mongoose'),
      Schema = mongoose.Schema,
      bcrypt = require('bcrypt-nodejs')

/*
 |--------------------------------------------------------------------------
 | User schema
 |--------------------------------------------------------------------------
*/
const UserFolder = new Schema({
  isRoot: { type: Boolean, default: false, },
  folders: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'UserFolder'}],
  },
  surveys: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Survey'}],
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User',
          required: true, }
});

module.exports = mongoose.model('UserFolder', UserFolder);
