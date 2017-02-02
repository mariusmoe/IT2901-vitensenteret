const express = require('express'),
      consign = require('consign'),
      app = express(),
      path = require('path');

consign()
  .include('models')
  .then('libs/setup.js')
  .then('controllers')
  .then('router.js')
  .then('libs/boot.js')
  .into(app);

  module.exports = app;
