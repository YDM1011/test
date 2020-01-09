const glob = require('glob');
const cors = require('cors');

module.exports = function (backendApp) {

  let apiControllers = glob.sync(backendApp.config.root+'/controllers/api/**/*.js');


  const originsWhitelist = [
      'localhost:4200',
      'http://localhost:4200',
      '*'
  ];
  const corsOptions = {
      origin:originsWhitelist,
      credentials:true
  };

  backendApp.app.use('/api', cors(corsOptions));

  const apiRouter = backendApp.express.Router();

  backendApp.app.use('/api', apiRouter);

  apiControllers.forEach((controller) => {
    require(controller)(backendApp, apiRouter);
  });
};
