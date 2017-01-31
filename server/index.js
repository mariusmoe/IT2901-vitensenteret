const consign = require('consign');

consign()
  .include('models')
  .then('controllers')
  .into(app);
