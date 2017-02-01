const AuthenticationController = require('./controllers/authentication'),
      UserController = require('./controllers/users'),
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
        userRoutes = express.Router();

  // Set auth routes as subgroup to apiRoutes
  apiRoutes.use('/auth', authRoutes);

  /*
   |--------------------------------------------------------------------------
   | Auth routes
   |--------------------------------------------------------------------------
  */

  // Register a user
  authRoutes.post('/register', AuthenticationController.register);

  // Login a user
  authRoutes.post('/login', requireLogin, AuthenticationController.login);

  // TODO Password reset request route
  authRoutes.post('/forgot-password', AuthenticationController.forgotPassword);

  // TODO send mail with token
  authRoutes.post('/reset-password/:token', AuthenticationController.verifyToken);

  // Change password from within app
  authRoutes.post('/change_password', requireAuth, AuthenticationController.changePassword);

  // Confirm account from link sent with email
  authRoutes.post('/confirm_account/:confirmation_string', AuthenticationController.confirmAccount);

  // Request new email
  authRoutes.post('/request_new_email_confirmation', AuthenticationController.newConfirmationLink)

  // Test authentication
  authRoutes.get('/test', requireAuth, AuthenticationController.test)

  // change email for this account
  authRoutes.post('/change_email', requireAuth, AuthenticationController.changeEmail);

  // Delete the account with the provided JWT
  authRoutes.delete('/delete_my_account', requireAuth, AuthenticationController.delteAccount);

  // Request a new token
  authRoutes.get('/get_new_token', requireAuth, AuthenticationController.getNewJWT);



app.use('/api', apiRoutes);
};
