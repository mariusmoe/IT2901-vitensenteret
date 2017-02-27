const AuthenticationController = require('./controllers/authentication'),
      SurveyController = require('./controllers/surveys'),
      ErrorController = require('./controllers/error'),
      express = require('express'),
      passportService = require('./libs/passport'),
      passport = require('passport')


// Require login/auth
const requireAuth   = passport.authenticate('jwt', { session: false });
const requireLogin  = passport.authenticate('local', { session: false });

// Role types
const REQUIRE_ADMIN = "admin",
      REQUIRE_MEMBER = "member";

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

  // get a referral link - requires admin rights
  authRoutes.get('/get_referral_link/:role',
                 requireAuth,
                 AuthenticationController.roleAuthorization(REQUIRE_ADMIN),
                 AuthenticationController.getReferralLink);


  authRoutes.post('/register_developer', AuthenticationController.register_developer);

  // Request a new token
  authRoutes.get('/get_token', requireAuth, AuthenticationController.getJWT);

  // Delete the account with the provided JWT
  authRoutes.delete('/delete_account',
                    requireAuth,
                    AuthenticationController.roleAuthorization(REQUIRE_ADMIN),
                    AuthenticationController.deleteAccount);

  // Return all users to superadmin
  authRoutes.get('/all_users',
                    requireAuth,
                    AuthenticationController.roleAuthorization(REQUIRE_ADMIN),
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
                 AuthenticationController.roleAuthorization(REQUIRE_ADMIN),
                 AuthenticationController.test);

   authRoutes.get('test2',
                  requireAuth,
                  AuthenticationController.roleAuthorization(REQUIRE_MEMBER),
                  AuthenticationController.test);
  //
  // change email for this account
  authRoutes.post('/change_email', requireAuth, AuthenticationController.changeEmail);
  //
  //

  // retrive all surveys as a json object
  surveyRoutes.get('/json', SurveyController.getAllSurveysAsJson);

  surveyRoutes.get('/json/:surveyId', SurveyController.getSurveyAsJson);

  surveyRoutes.get('/csv/:surveyId',requireAuth, SurveyController.getSurveyAsCSV);


  surveyRoutes.post('/', requireAuth, SurveyController.createSurvey);

  surveyRoutes.get('/',  SurveyController.getAllSurveys);

  surveyRoutes.get('/:surveyId', SurveyController.getOneSurvey);

  surveyRoutes.patch('/:surveyId', requireAuth, SurveyController.patchOneSurvey);

  surveyRoutes.delete('/:surveyId',
                      requireAuth,
                      AuthenticationController.roleAuthorization(REQUIRE_ADMIN),
                      SurveyController.deleteOneSurvey);


  // retrive one survey as a json object
  // surveyRoutes.get('/:json/:surveyId', SurveyController.getSurveyAsJson);



app.use('/api', apiRoutes);
};
