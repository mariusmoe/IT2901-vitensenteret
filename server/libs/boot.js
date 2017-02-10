const mongoose = require('mongoose'),
      config = require('config');
// Use a different Promise provider then mongooses mpromise (its depricated)

module.exports = app => {
  // optional callback that gets fired when initial connection completed
  const uri = config.database;
  mongoose.connect(uri, (error) => {
    // if error is true, the problem is often with mongoDB not connection
    if (error){
      console.log("ERROR can't connect to mongoDB. Did you forgot to run mongod?");
    }
  }).then( () => {
    // Start to listen on port specified in the config file
    app.listen(app.get("port"), () =>{
      if(config.util.getEnv('NODE_ENV') !== 'test') {
          console.log(`Vitensenteret running on - Port ${app.get("port")}...`);
        };
    });
  })
};
