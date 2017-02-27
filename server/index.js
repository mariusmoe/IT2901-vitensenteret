const express = require('express'),
      consign = require('consign'),
      app = express(),
      mongoose = require('mongoose'),
      path = require('path');

app.use(express.static(path.join(__dirname, 'temp')));

// Use ES 6 promise instead of depricated mpromise
mongoose.Promise = Promise;

consign()
  .include('models')
  .then('libs/setup.js')
  .then('controllers')
  .then('router.js')
  .then('libs/boot.js')
  .then("seed.js")
  .into(app);

  module.exports = app;
