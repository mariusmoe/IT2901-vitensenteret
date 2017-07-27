// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `angular-cli.json`.

export const environment = {
  production: false,

  URL: {
    login:        'http://localhost:2000/api/auth/login',
    allUsers:     'http://localhost:2000/api/auth/all_users',
    delete:       'http://localhost:2000/api/auth/delete_account',
    refer:        'http://localhost:2000/api/auth/get_referral_link/',
    renewJWT:     'http://localhost:2000/api/auth/get_token/',
    newEmail:     'http://localhost:2000/api/auth/change_email/',
    newPassword:  'http://localhost:2000/api/auth/change_password/',
    survey:       'http://localhost:2000/api/survey',
    surveyAll:       'http://localhost:2000/api/survey/all',
    surveyCopy:   'http://localhost:2000/api/survey/copy',
    surveyAsJson: 'http://localhost:2000/api/survey/json',
    surveyAsCSV: 'http://localhost:2000/api/survey/csv',
    newUser: 'http://localhost:2000/api/auth/register',
    exitSurvey: 'http://localhost:2000/api/center/escape',
    allNicknames: 'http://localhost:2000/api/survey/all_nicknames',
    allCenters: 'http://localhost:2000/api/center/',
    folders: 'http://localhost:2000/api/folders/',
    newCenter: 'http://localhost:2000/api/center/new',
    newCenterName: 'http://localhost:2000/api/center/name',
  }
};
