export const environment = {
  production: true,


    URL: {
      login:        'http://95.85.63.98:2000/api/auth/login',
      allUsers:     'http://95.85.63.98:2000/api/auth/all_users',
      delete:       'http://95.85.63.98:2000/api/auth/delete_account',
      refer:        'http://95.85.63.98:2000/api/auth/get_referral_link/',
      renewJWT:     'http://95.85.63.98:2000/api/auth/get_token/',
      newEmail:     'http://95.85.63.98:2000/api/auth/change_email/',
      newPassword:  'http://95.85.63.98:2000/api/auth/change_password/',
      survey:       'http://95.85.63.98:2000/api/survey',
      surveyCopy:   'http://95.85.63.98:2000/api/survey/copy',
      surveyAsJson: 'http://95.85.63.98:2000/api/survey/json',
      surveyAsCSV: 'http://95.85.63.98:2000/api/survey/csv',
      newUser: 'http://95.85.63.98:2000/api/auth/register',
      checkChoosesurvey: 'http://95.85.63.98:2000/api/survey/escape',
    }
};
