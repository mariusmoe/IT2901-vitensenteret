// based on https://scotch.io/tutorials/simple-language-translation-in-angular-2-part-1

export const LANG_EN_NAME = 'en';

export const LANG_EN_TRANS = {
  // Application
  'Center - AdminPortal': '%0 - AdminPortal',
  'Center - Survey': '%0 - Survey',

  // Generic
  'Edit': 'Edit',
  'Create': 'Create',
  'Survey': 'Survey',
  'survey': 'survey',
  'Title': 'Title',
  'Questions': 'Questions',
  'Question': 'Question',
  'Delete': 'Delete',
  'Submit': 'Submit',
  'Alternative': 'Alternative',
  'Cancel': 'Cancel',
  'Save': 'Save',
  'Settings': 'Settings',
  'Log out': 'Log out',
  'Search': 'Search',
  'Email': 'Email',
  'Password': 'Password',
  'User ID': 'User ID',
  'Role': 'Role',
  'Language': 'Language',
  'Copy': 'Copy',
  'CopyLabel': 'Copy',
  'Okay': 'Okay',
  'Success': 'Success',
  'Download': 'Download',
  'Active': 'Active',
  'Inactive': 'Inactive',
  'Option': 'Option',
  'Percentage': 'Percentage',
  'Responses': 'Responses',
  'Response: ': 'Response: ',
  'User': 'User',
  'Nickname': 'Nickname',
  'Code': 'Code',
  'Contributors': 'Contributors',
  'Help': 'Help',
  'Center': 'Center',
  'Action': 'Action',
  'Actions': 'Actions',
  'Back': 'Back',
  'Progress': 'Progress',
  'Filesize': 'Filesize',
  'Filename': 'Filename',
  'Status': 'Status',
  'Publish': 'Publish',
  'Unpublish': 'Unpublish',
  'Warning': 'Warning',

  // guard
  'Session expired': 'Session expired',
  'Connection issues': 'Nettverksproblemer',

  // Permissions
  'You do not have the required permissions for this action!': 'You do not have the required permissions for this action!',

  // Languages
  'Norwegian': 'Norwegian',
  'English': 'English',

  // Forms
  'This field is required.': 'This field is required.',
  'This field is a duplicate.': 'This field is a duplicate.',
  'This field is invalid.': 'This field is invalid.',
  'Bad format': 'Bad format',

  // Survey Question modes
  'binary': 'Yes/No',
  'star': '5 Stars',
  'single': 'Single Choice',
  'multi': 'Multiple Choice',
  'smiley': 'Smiley',
  'text': 'Free Text',

  // Image URL in create survey
  'This field is OPTIONAL. The field takes a full URL. Example: https://www.myWebsite.com/myImage.png. www.imgur.com is an image hosting service you can use.':
    'This field is OPTIONAL. The field takes a full URL. Example: https://www.myWebsite.com/myImage.png. www.imgur.com is an image hosting service you can use.',
  'Bad format. This field requires a full URL to an image, beginning with https://':
    'Bad format. This field requires a full URL to an image, beginning with https://',

  // Survey Pre post labels
  'Pre': 'Pre',
  'Post': 'Post',
  'Pre survey': 'Pre survey',
  'Post survey': 'Post survey',

  // Survey response numbers
  'Number of responses: n': 'Number of responses: %0',
  'Number of responses: n, m': 'Number of responses: %0, %1',

  // Dynamic loading controls
  'Load more': 'Load more',

  // Survey Question mode labels
  'Yes': 'Yes',
  'No': 'No',
  '1 Star': '1 Star',
  '2 Stars': '2 Stars',
  '3 Stars': '3 Stars',
  '4 Stars': '4 Stars',
  '5 Stars': '5 Stars',
  'Sad': 'Sad',
  'Neutral': 'Neutral',
  'Happy': 'Happy',

  // Admin outlet component
  'Admin Home': 'Admin Home',
  'Create New Survey': 'Create New Survey',
  'Select a survey from the left side menu': 'Select a survey from the left side menu',
  'Did not answer': 'Did not answer',

  // Create survey component
  'Survey options': 'Survey options',
  'Fill in every field marked as required': 'Fill in every field marked as required',
  'Admin-only Comment': 'Admin-only Comment',
  'Active status': 'Active status',
  'Enable English for this survey?': 'Enable English for this survey?',
  'Final message': 'Final message',
  'The final text to be displayed as a user completes a survey': 'The final text to be displayed as a user completes a survey',
  'Message (Norwegian)': 'Message (Norwegian)',
  'Message (English)': 'Message (English)',
  'No alternatives need to be set.': 'No alternatives need to be set.',
  'Question (Norwegian)': 'Question (Norwegian)',
  'Question (English)': 'Question (English)',
  'Alternatives: n/m': 'Alternatives: %0/%1',
  'Set Alternatives': 'Set Alternatives',
  'Add a question': 'Add a question',
  'Image URL (not requrired)': 'Image URL (not required)',
  'At least two alternatives must be set, with a maximum of 6.': 'At least two alternatives must be set, with a maximum of 6.',
  'Deletes this particular question! Careful!': 'Deletes this particular question! Careful!',
  'Several fields are required. Verify that you have filled out all required fields.':
    'Several fields are required. Verify that you have filled out all required fields.',
  'Add Option': 'Add Option',
  'Post results': 'Post results',
  'Could not post your survey. Error:': 'Could not post your survey. The server replied:',
  'The system cannot proceed until the issue has been resolved.': 'The system cannot proceed until the issue has been resolved.',
  'Required question': 'Required question',
  'Warning!': 'Warning!',
  'All responses to this survey will be lost if you proceed.': 'All responses to this survey will be lost if you proceed.',
  'Do you wish to proceed?': 'Do you wish to proceed?',
  'The survey is completed and cannot be republished. If you want to run the survey again, try to copy it.':
    'The survey is completed and cannot be republished. If you want to run the survey again, try to copy it.',
  'Survey completed': 'Survey completed',
  'Documentation settings': 'Documentation settings',
  'Choose documentation pdf': 'Choose documentation pdf',

  // All surveys component
  'n total surveys. A maximum of m items are displayed.': '%0 total surveys. A maximum of %1 items are displayed.',
  'Filter results on title and / or admin comment': 'Filter results on title and / or admin comment',

  // Login component
  'Login': 'Login',
  'Log in': 'Log in',
  'Email and password are required': 'Email and password are required',
  'Email or password is incorrect': 'Email or password is incorrect',
  'There was an issue connecting to the server': 'There was an issue connecting to the server',

  // New user component
  'You need to write the same pasword twice': 'You need to write the same pasword twice',
  'Register New User': 'Register New User',
  'Could not register account': 'Could not register account',

  // Admin homepage component
  'Download as PDF': 'Download as PDF',
  'Download Raw Data': 'Download Raw Data',
  'Download as JSON': 'Download as JSON',
  'No responses have been registered, so there is nothing to show here yet.':
    'No responses have been registered, so there is nothing to show here yet.',
  'Create post-survey': 'Create post-survey',
  'Edit post-survey': 'Edit post-survey',
  'Survey deleted': 'Survey deleted',
  'Are you sure you want to delete this survey?': 'Are you sure you want to delete this survey?',
  'The survey will be deleted! This action is permanent!': 'The survey will be deleted! This action is permanent!',
  'Go to survey': 'Go to survey',
  'Go to post survey': 'Go to post survey',
  'The survey is not active': 'The survey is not active',
  'A survey can only be published once. When it is published it cannot be changed.':
  'A survey can only be published once. When it is published it cannot be changed.',
  'All responses up until this point in time will be deleted.':
  'All responses up until this point in time will be deleted.',
  'When a survey is unpublished it will no logner accept responses.':
  'When a survey is unpublished it will no logner accept responses.',
  'To run the survey again, try to copy it.':
    'To run the survey again, try to copy it.',
  'The pre and post survevys do not match, so they have been separated.':
    'The pre and post survevys do not match, so they have been separated.',

  // Admin settings component
  'Retype password': 'Retype password',
  'Minimum 4 characters': 'Minimum 4 characters',
  'Minimum 4 numbers': 'Minimum 4 numbers',
  'Password changed': 'Password changed',
  'Admin settings': 'Admin settings',
  'Change password': 'Change password',
  'Refer user': 'Refer user',
  'Change email': 'Change email',
  'User settings': 'User settings',
  'Refer admin': 'Refer admin',
  'Refer member': 'Refer member',
  'You need to write the same password twice': 'You need to write the same password twice',
  'Delete account': 'Delete account',
  'Change the preferred language here': 'Change the preferred language here',
  'Could not change your email': 'Could not change your email',
  'Could not change your password': 'Could not change your password',
  'Can\'t delete this user': 'Can\'t delete this user',
  'User has been deleted': 'User has been deleted',
  'Can\'t delete current user': 'Can\'t delete current user',
  'Are you sure you want to delete this account?': 'Are you sure you want to delete this account?',
  'The account will be deleted! This action is permanent!': 'The account will be deleted! This action is permanent!',
  'Refer a userType': 'Refer a %0',
  'A referral link is only active for two weeks': 'A referral link is only active for two weeks',
  'You have now changed your email': 'You have now changed your email',
  'You have now changed your password': 'You have now changed your password',
  'You will now be logged out': 'You will now be logged out',
  'Referral link': 'Referral link',
  'Code to exit survey': 'Code to exit survey',
  'Current role: role': 'Current role: %0',
  'Center settings': 'Center settings',
  'Update center': 'Update center',
  'New center': 'New center',

  // New center component
  'Change title': 'Change title',
  'Logo settings': 'Logo settings',
  'Choose file': 'Choose file',
  'Upload and replace logo': 'Upload and replace logo',
  'Upload and replace documentation': 'Upload and replace documentation',
  'Center title updated': 'Center title updated',
  'Could not change center title at this time': 'Could not change center title at this time',
  'Create new center': 'Create new center',
  'Do note, it is highly recommended to use images of low file size. Images above 10MB will be ignored.':
    'Do note, it is highly recommended to use images of low file size. Images above 10MB will be ignored.',



  // survey retrieval chart component
  'Download as PNG': 'Download as PNG',

  // survey retrieval component
  'Text based question. Download raw data to extract this.': 'Text based question. Download raw data to extract this.',

  // Chart types
  'Bar': 'Bar chart',
  'Doughnut': 'Doughnut chart',
  'Pie': 'Pie chart',
  'Line': 'Line chart',
  'PolarArea': 'PolarArea chart',

  // choose-survey component
  'All Surveys': 'All Surveys',
  'Search results for search': 'Search results for %0:',
  'Start': 'Start',
  'Start POST': 'Start POST',
  'Start survey': 'Start survey',
  'Choose center': 'Choose center',
  'Could not find any published surveys at this time.': 'Could not find any published surveys at this time.',

  // PDF download lines
  'Last modified: d': 'Last modified: %0',
  'Published: d': 'Published: %0',
  'Completed: d': 'Completed: %0',
  'Figure: n': 'Figure: %0',
  'Table: n': 'Table: %0',

  // Nickname component
  'Name': 'What is your name?',
  'You need to answer the pre survey first': 'You need to answer the pre survey first',
    'This nickname is taken, choose another one': 'This nickname is taken, choose another one',

  // Modal dialog in active survey
  'Sorry': 'Sorry',
  'ContactError': 'Something went wrong! Please contact the staff.',

  // quit survey prompt
  'Enter the code to quit': 'Enter the code to quit',
  'Incorrect code': 'Incorrect code',

  // play-survey - Free text
  'Max 255 characters': 'Max 255 characters',
  'Your answer': 'Your answer',

  // play survey
  'Show image': 'Show image',

  // Footer
  'Group n': 'Group %0',
  'IT2901 - Informatics Project II': 'IT2901 - Informatics Project II',

  // Folder system
  'Warning! This will delete the folder along with ALL surveys inside!':
    'Warning! This will delete the folder along with ALL surveys inside!',
  'Rename folder': 'Rename folder',
  'Delete folder': 'Delete folder',
  'Create subfolder': 'Create subfolder',
  'Folder Options': 'Folder Options',
  'New name': 'New name',

};
