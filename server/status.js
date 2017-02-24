module.exports = {
  USER_NOT_FOUND: {
    message: 'Could not find user',
    code: 2011
  },
  ACCOUNT_CREATED: {
    message: 'Account successfully created',
    code: 1000
  },
  EMAIL_NOT_AVILIABLE: {
    message: 'The email is already in use',
    code: 2013
  },
  NO_EMAIL_OR_PASSWORD: {
    message: 'Missing email or password',
    code: 2014
  },
  TRY_AGAIN: {
    message: 'could not do that, try again',
    code: 2015
  },
  REFERRAL_CREATED: {
    message: 'Referral link established correctly',
    code: 1012
  },
  NO_REFERRAL_LINK: {
    message: 'You need a referral link',
    code: 2016
  },
  NOT_AN_ACTIVE_REFERRAL: {
    message: 'The referral link is too old or not correct',
    code: 2017
  },
  ROLE_INCORRECT: {
    message: 'The role provided is invalid',
    code: 2013
  },
  ROUTE_USERS_VALID_NO_USERS: {
    message: 'Route valid but no users was found',
    code: 2024
  },


  // SURVEY CODES
  SURVEY_UNPROCESSABLE: {
    message: 'Survey could not be processed. Check validity.',
    code: 2018
  },
  SURVEY_NOT_FOUND: {
    message: 'Survey could not be found',
    code: 2019
  },
  SURVEY_OBJECT_MISSING: { // used when a survey is supposedly being TO the server
    message: 'Could not find a survey',
    code: 2020
  },
  SURVEY_UPDATED: {
    message: 'Survey has been updated',
    code: 1013
  },
  SURVEY_DELETED: {
    message: 'Survey has been deleted',
    code: 1014,
  },
  SURVEY_BAD_ID: {
    message: 'The id provided for the survey is malformed.',
    code: 2021
  },

  // ROUTER CODES
  ROUTE_INVALID: {
    message: "The requested route does not exist. Did you forget a param?",
    code: 2022
  },
  ROUTE_SURVEYS_VALID_NO_SURVEYS: {
    message: "Request successful, but no surveys exist.",
    code: 1015
  },
}
