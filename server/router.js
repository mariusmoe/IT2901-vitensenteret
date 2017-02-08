const AuthenticationController = require('./controllers/authentication'),
      SurveyController = require('./controllers/surveys'),
      ErrorController = require('./controllers/error'),
      express = require('express'),
      passportService = require('./libs/passport'),
      passport = require('passport')


// Require login/auth
const requireAuth   = passport.authenticate('jwt', { session: false });
const requireLogin  = passport.authenticate('local', { session: false });


module.exports = (app) => {
  // route groups
  const apiRoutes  = express.Router(),
        authRoutes = express.Router(),
        surveyRoutes = express.Router();
  // Set auth and survey routes as subgroup to apiRoutes
  apiRoutes.use('/auth', authRoutes);
  apiRoutes.use('/survey', surveyRoutes);
  // Set a common fallback for /api/*; 404 for invalid route
  apiRoutes.all('*', ErrorController.error);

  /*
   |--------------------------------------------------------------------------
   | Auth routes
   |--------------------------------------------------------------------------
  */

  // Register a user
  authRoutes.post('/register', AuthenticationController.register);

  // Login a user
  authRoutes.post('/login', requireLogin, AuthenticationController.login);

  // get a referral link
  authRoutes.get('/get_referral_link', requireAuth, AuthenticationController.getReferralLink);


authRoutes.post('/register_developer', AuthenticationController.register_developer);

  // // TODO Password reset request route
  // authRoutes.post('/forgot-password', AuthenticationController.forgotPassword);
  //
  // // TODO send mail with token
  // authRoutes.post('/reset-password/:token', AuthenticationController.verifyToken);
  //
  // // Change password from within app
  // authRoutes.post('/change_password', requireAuth, AuthenticationController.changePassword);
  //
  // // Confirm account from link sent with email
  // authRoutes.post('/confirm_account/:confirmation_string', AuthenticationController.confirmAccount);
  //
  // // Request new email
  // authRoutes.post('/request_new_email_confirmation', AuthenticationController.newConfirmationLink)
  //
  // // Test authentication
  // authRoutes.get('/test', requireAuth, AuthenticationController.test)
  //
  // // change email for this account
  // authRoutes.post('/change_email', requireAuth, AuthenticationController.changeEmail);
  //
  // // Delete the account with the provided JWT
  // authRoutes.delete('/delete_my_account', requireAuth, AuthenticationController.delteAccount);
  //
  // // Request a new token
  // authRoutes.get('/get_new_token', requireAuth, AuthenticationController.getNewJWT);

  // retrive all surveys as a json object
  surveyRoutes.get('/json', SurveyController.getAllSurveysAsJson);

  surveyRoutes.get('/json/:surveyId', SurveyController.getSurveyAsJson);

  surveyRoutes.get('/csv/:surveyId',requireAuth, SurveyController.getSurveyAsCSV);


  surveyRoutes.post('/', requireAuth, SurveyController.createSurvey);

  surveyRoutes.get('/',  SurveyController.getAllSurveys);

  surveyRoutes.get('/:surveyId', SurveyController.getOneSurvey);

  surveyRoutes.patch('/:surveyId', requireAuth, SurveyController.patchOneSurvey);

  surveyRoutes.delete('/:surveyId', requireAuth, SurveyController.deleteOneSurvey);


  // retrive one survey as a json object
  // surveyRoutes.get('/:json/:surveyId', SurveyController.getSurveyAsJson);



app.use('/api', apiRoutes);
};
