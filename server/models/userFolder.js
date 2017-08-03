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
  title: { type: String, default: 'New Folder' },
  open: { type: Boolean, default: true },
  folders: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'UserFolder'}],
    default: [],
  },
  surveys: {
    type: [{type: mongoose.Schema.Types.ObjectId, ref: 'Survey'}],
    default: [],
  },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User',
          required: true, }
});



var autoPopulate = function(next) {
  this.populate({
    path: 'surveys',
    options: {
      select: { '_id': 1,'madeBy': 1, 'name': 1, 'active': 1, },
      sort: { date: -1 }
    }
  });
  this.populate({
    path: 'folders',
    options: {
      sort: { title: 1 }
    }
  });
  next();
};

UserFolder.pre('find', autoPopulate);


module.exports = mongoose.model('UserFolder', UserFolder);
