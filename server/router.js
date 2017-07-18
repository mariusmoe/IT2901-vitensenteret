const AuthenticationController = require('./controllers/authentication'),
      SurveyController = require('./controllers/surveys'),
      ErrorController = require('./controllers/error'),
      CenterController = require('./controllers/centers'),
      express = require('express'),
      passportService = require('./libs/passport'),
      passport = require('passport'),
      config = require('config'),
      path = require('path');


// Require login/auth
const requireAuth   = passport.authenticate('jwt', { session: false });
const requireLogin  = passport.authenticate('local', { session: false });

// Role types enum: ['sysadmin', 'vitenleader', 'user'],
const REQUIRE_SYSADMIN = "sysadmin",
      REQUIRE_LEADER = "vitenleader",
      REQUIRE_USER = "user";

module.exports = (app) => {
  // route groups
  const apiRoutes  = express.Router(),
        authRoutes = express.Router(),
        surveyRoutes = express.Router(),
        angularRoutes = express.Router(),
        centerRoutes = express.Router();
  // Set auth and survey routes as subgroup to apiRoutes
  apiRoutes.use('/auth', authRoutes);
  apiRoutes.use('/survey', surveyRoutes);
  apiRoutes.use('/center', centerRoutes);
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

  // get a referral link - requires admin rights
  authRoutes.get('/get_referral_link/:role',
                 requireAuth,
                 AuthenticationController.roleAuthorizationUp(REQUIRE_LEADER),
                 AuthenticationController.getReferralLink);

 if (config.util.getEnv('NODE_ENV') !== 'production') {
     authRoutes.post('/register_developer', AuthenticationController.register_developer);
 }

  // Request a new token
  authRoutes.get('/get_token', requireAuth, AuthenticationController.getJWT);

  // Delete the account with the provided JWT
  authRoutes.delete('/delete_account',
                    requireAuth,
                    AuthenticationController.roleAuthorizationUp(REQUIRE_LEADER),
                    AuthenticationController.deleteAccount);

  // Return all users to superadmin
  authRoutes.get('/all_users',
                    requireAuth,
                    AuthenticationController.roleAuthorizationUp(REQUIRE_LEADER),
                    AuthenticationController.getAllUsers);

  // // TODO Password reset request route
  // authRoutes.post('/forgot-password', AuthenticationController.forgotPassword);
  //
  // // TODO send mail with token
  // authRoutes.post('/reset-password/:token', AuthenticationController.verifyToken);
  //
  // Change password from within app
  authRoutes.post('/change_password', requireAuth, AuthenticationController.changePassword);
  //
  // // Confirm account from link sent with email
  // authRoutes.post('/confirm_account/:confirmation_string', AuthenticationController.confirmAccount);
  //
  // // Request new email
  // authRoutes.post('/request_new_email_confirmation', AuthenticationController.newConfirmationLink)
  //
  // Test authentication with roleAuthorization
  authRoutes.get('/test',
                 requireAuth,
                 AuthenticationController.roleAuthorization(REQUIRE_SYSADMIN),
                 AuthenticationController.test);

   authRoutes.get('test2',
                  requireAuth,
                  AuthenticationController.roleAuthorization(REQUIRE_LEADER),
                  AuthenticationController.test);
  //
  // change email for this account
  authRoutes.post('/change_email', requireAuth, AuthenticationController.changeEmail);
  //
  //



  surveyRoutes.get('/all_nicknames/:surveyId', SurveyController.getNicknamesForOneSurvey);

  // retrive all surveys as a json object
  surveyRoutes.get('/json', SurveyController.getAllSurveysAsJson);

  surveyRoutes.get('/csv/:surveyId',requireAuth, SurveyController.getSurveyAsCSV);

  surveyRoutes.post('/copy/:surveyId', requireAuth, SurveyController.copySurvey);

  surveyRoutes.post('/', requireAuth, SurveyController.createSurvey);


  surveyRoutes.get('/:surveyId', SurveyController.getOneSurvey);

  surveyRoutes.patch('/:surveyId', requireAuth, SurveyController.patchOneSurvey);

  // surveyRoutes.post('/linkPrePost', requireAuth, SurveyController.linkPrePost);

  surveyRoutes.delete('/:surveyId',
                      requireAuth,
                      AuthenticationController.roleAuthorizationUp(REQUIRE_USER),
                      SurveyController.deleteOneSurvey);


  surveyRoutes.post('/:surveyId', SurveyController.answerOneSurvey);


  /*
   |--------------------------------------------------------------------------
   | Center routes
   |--------------------------------------------------------------------------
  */
  centerRoutes.post('/', requireAuth,
    AuthenticationController.roleAuthorization(REQUIRE_SYSADMIN),
    CenterController.createCenter);

  centerRoutes.get('/',  CenterController.getAllCenters);

  // Is not needed
  // centerRoutes.get('/:centerId',  CenterController.getCenter);

  // Add or update password
  centerRoutes.patch('/escape/:centerId', requireAuth, CenterController.patchOneEscape);

  //Check if password is correct
  centerRoutes.post('/escape/:centerId', CenterController.checkOneEscape);


  // retrive one survey as a json object
  // surveyRoutes.get('/:json/:surveyId', SurveyController.getSurveyAsJson);
  angularRoutes.get('/', (req, res) => {
    res.sendFile(path.join(__dirname + '../client_viten/dist/index.html'));
});
app.use('/api', apiRoutes);
app.use('/', angularRoutes);
};
