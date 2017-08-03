// based on https://scotch.io/tutorials/simple-language-translation-in-angular-2-part-1

export const LANG_NO_NAME = 'no';

export const LANG_NO_TRANS = {
  // Application
  'Center - AdminPortal': '%0 - AdminPortal',
  'Center - Survey': '%0 - Undersøkelse',


  // Generic
  'Edit': 'Endre',
  'Create': 'Lag',
  'Survey': 'Undersøkelse',
  'survey': 'undersøkelse',
  'Title': 'Navn',
  'Questions': 'Spørsmål',
  'Question': 'Spørsmål',
  'Delete': 'Slett',
  'Submit': 'Lagre',
  'Alternative': 'Alternativ',
  'Cancel': 'Avbryt',
  'Save': 'Lagre',
  'Settings': 'Instillinger',
  'Log out': 'Logg ut',
  'Search': 'Søk',
  'Email': 'Epost',
  'Password': 'Passord',
  'User ID': 'BrukerID',
  'Role': 'Kontotype',
  'Language': 'Språk',
  'Copy': 'Kopier',
  'CopyLabel': 'Kopi',
  'Okay': 'Ok',
  'Success': 'Suksess',
  'Active': 'Aktiv',
  'Inactive': 'Inaktiv',
  'Download': 'Last ned',
  'Option': 'Valg',
  'Percentage': 'Prosent',
  'Responses': 'Svar',
  'Response: ': 'Svar: ',
  'User': 'Bruker',
  'Nickname': 'Kallenavn',
  'Code': 'Kode',
  'Contributors': 'Bidragsytere',
  'Help': 'Hjelp',
  'Center': 'Senter',
  'Action': 'Handling',
  'Actions': 'Handlinger',
  'Back': 'Tilbake',
  'Progress': 'Progressjon',
  'Filesize': 'Filstørrelse',
  'Filename': 'Filnavn',
  'Status': 'Status',
  'Publish': 'Publiser',
  'Unpublish': 'Avpubliser',
  'Warning': 'Advarsel',

  // guard
  'Session expired': 'Økten er utgått',
  'Connection issues': 'Nettverksproblemer',

  // Permissions
  'You do not have the required permissions for this action!': 'Du har ikke de nødvendige rettighetene for dette!',

  // Languages
  'Norwegian': 'Norsk',
  'English': 'Engelsk',

  // Forms
  'This field is required.': 'Dette feltet er påkrevd.',
  'This field is a duplicate.': 'Dette feltet er et duplikat.',
  'This field is invalid.': 'Dette feltet er ugyldig.',
  'Bad format': 'Feil format',

  // Survey Question modes
  'binary': 'Ja/Nei',
  'star': '5 stjerner',
  'single': 'Enkelt valg',
  'multi': 'Flervalgs',
  'smiley': 'Smiley',
  'text': 'Tekst',

  // Image URL in create survey
  'This field is OPTIONAL. The field takes a full URL. Example: https://www.myWebsite.com/myImage.png. www.imgur.com is an image hosting service you can use.':
    'Dette feltet er VALGFRITT. Feltet tar en hel URL. Eksempel: https://www.myWebsite.com/myImage.png. www.imgur.com er en bilde-delingstjeneste du kan bruke.',
  'Bad format. This field requires a full URL to an image, beginning with https://':
    'Feil format. Dette feltet krever en hel URL til et bilde, og den må starte med https://',

  // Survey Pre post labels
  'Pre': 'Pre',
  'Post': 'Post',
  'Pre survey': 'Pre-undersøkelse',
  'Post survey': 'Post-undersøkelse',

  // Survey response numbers
  'Number of responses: n': 'Antall svar: %0',
  'Number of responses: n, m': 'Antall svar: %0, %1',

  // Dynamic loading controls
  'Load more': 'Last in flere',

  // Survey Question mode labels
  'Yes': 'Ja',
  'No': 'Nei',
  '1 Star': '1 Stjerne',
  '2 Stars': '2 Stjerner',
  '3 Stars': '3 Stjerner',
  '4 Stars': '4 Stjerner',
  '5 Stars': '5 Stjerner',
  'Sad': 'Trist',
  'Neutral': 'Nøytral',
  'Happy': 'Glad',

  // Admin outlet component
  'Admin Home': 'Administrator Hjem',
  'Create New Survey': 'Lag ny undersøkelse',
  'Select a survey from the left side menu': 'Velg en undersøkelse fra menyen til venstre',
  'Did not answer': 'Svarte ikke',

  // Create survey component
  'Survey options': 'Innstillinger for undersøkelse',
  'Fill in every field marked as required': 'Fyll inn alle påkrevde felt',
  'Admin-only Comment': 'Kommentar for administratorer',
  'Active status': 'Skal undersøkelsen være tilgjengelig for besøkende?',
  'Enable English for this survey?': 'Skal undersøkelsen også ha med engelske spørsmål?',
  'Final message': 'Takkskjerm',
  'The final text to be displayed as a user completes a survey': 'Fyll inn beskjeden som gis til brukere når de fullfører undersøkelsen',
  'Message (Norwegian)': 'beskjed (Norsk)',
  'Message (English)': 'beskjed (Engelsk)',
  'No alternatives need to be set.': 'Ingen alternativer er påkrevd.',
  'Question (Norwegian)': 'Spørsmål (Norsk)',
  'Question (English)': 'Spørsmål (Engelsk)',
  'Alternatives: n/m': 'Alternativer: %0/%1',
  'Set Alternatives': 'Sett alternativer',
  'Add a question': 'Legg til spørsmål',
  'Image URL (not requrired)': 'URL til bilde (om ønskelig)',
  'At least two alternatives must be set, with a maximum of 6.':
    'Minst to av alternativene må være satt. Det kan settes opp til 6 alternativer.',
  'Deletes this particular question! Careful!': 'Forsiktig! Spørsmålet blir slettet!',
  'Several fields are required. Verify that you have filled out all required fields.':
    'Flere felt er påkrevd. Overse at alle de påkrevde er utfyllt.',
  'Add Option': 'Legg til et alternativ',
  'Post results': 'Resultat',
  'Could not post your survey. Error:': 'Kunne ikke lagre undersøkelsen. Feilmelding:',
  'The system cannot proceed until the issue has been resolved.': 'Systemet kan ikke fortsette før feilen har blitt rettet opp.',
  'Required question': 'Må besvares',
  'Warning!': 'Advarsel!',
  'All responses to this survey will be lost if you proceed.': 'Alle svar til denne undersøkelsen vil bli slettet om du fortsetter.',
  'Do you wish to proceed?': 'Ønsker du å fortsette?',

  // All surveys component
  'n total surveys. A maximum of m items are displayed.': '%0 totalt antall undersøkelser. Maksimum %1 er vist samtidig.',
  'Filter results on title and / or admin comment': 'Filtrer listen etter tittel eller kommentar for administratorer',

  // Login component
  'Login': 'Innlogging',
  'Log in': 'Logg inn',
  'Email and password are required': 'Både epost og passord er påkrevd',
  'Email or password is incorrect': 'Epost eller passord er galt',
  'There was an issue connecting to the server': 'Kunne ikke koble opp til servern',

  // New user component
  'You need to write the same pasword twice': 'You need to write the same pasword twice',
  'Register New User': 'Register New User',
  'Could not register account': 'Kunne ikke registrere brukeren',

  // Admin homepage component
  'Download as PDF': 'Last ned som PDF',
  'Download Raw Data': 'Last ned rådata',
  'Download as JSON': 'Last ned som JSON',
  'No responses have been registered, so there is nothing to show here yet.':
    'Ingen svar har blitt registrert, så det finnes ingen data som kan vises ennå.',
  'Create post-survey': 'Lag post-undersøkelse',
  'Edit post-survey': 'Endre post-undersøkelse',
  'Survey deleted': 'Undersøkelse slettet',
  'Are you sure you want to delete this survey?': 'Er du sikker på at du vil slette denne undersøkelsen?',
  'The survey will be deleted! This action is permanent!': 'Undersøkelsen vil bli slettet! Denne handlingen er permanent!',
  'Go to survey': 'Gå til undersøkelsen',
  'Go to post survey': 'Gå til post undersøkelse',
  'The survey is not active': 'Undersøkelsen er ikke aktiv',
  'The survey is completed and cannot be republished. If you want to run the survey again, try to copy it.':
    'Undersøkelsen er over og kan ikke publiseres på nytt. Hvis du ønsker å kjøre undersøkelsen på nytt, prøv å kopiere den.',
  'Survey completed': 'Undersøkelse avsluttet',
  'A survey can only be published once. When it is published it cannot be changed.':
  'En undersøkelse kan kun publiseres èn gang. Når den er publisert kan den ikke endres',
  'All responses up until this point in time will be deleted.':
  'Alle svar på undersøkelsen til nå vil bli slettet.',
  'When a survey is unpublished it will no logner accept responses.':
  'Når en undersøkelse avpubliseres vil den ikke lengre akseptere svar',
  'To run the survey again, try to copy it.':
    'For å kjøre undersøkelsen igjen, prøv å kopiere den.',
  'The pre and post survevys do not match, so they have been separated.':
    'For- og etterundersøkelsene stemmer ikke overens, og har derfor blitt separert.',


  // Admin settings component
  'Retype password': 'Skriv passordet igjen',
  'Minimum 4 characters': 'Minimum 4 tegn',
  'Minimum 4 numbers': 'Minimum 4 tall',
  'Password changed': 'Passord endret',
  'Admin settings': 'Admininstillinger',
  'Change password': 'Bytt passord',
  'Refer user': 'Inviter bruker',
  'Change email': 'Bytt epostkonto',
  'User settings': 'Brukerinstillinger',
  'Refer admin': 'Generer invitasjonslink for superadmin',
  'Refer member': 'Generer invitasjonslink for adminbruker',
  'You need to write the same password twice': 'Du må skrive passordet to ganger',
  'Delete account': 'Slett kontoen',
  'Change the preferred language here': 'Bytt ditt foretrukne språk her',
  'Could not change your email': 'Kunne ikke endre din epostkonto',
  'Could not change your password': 'Kunne ikke endre passordet ditt',
  'Can\'t delete this user': 'Kan ikke slette denne brukeren',
  'User has been deleted': 'Brukeren har blitt slettet',
  'Can\'t delete current user': 'Kan ikke slette brukeren du er logget inn med',
  'Are you sure you want to delete this account?': 'Er du sikker på at du vil slette denne kontoen?',
  'The account will be deleted! This action is permanent!': 'Kontoen vil bli slettet! Dette er permanent!',
  'Refer a userType': 'Referer en %0',
  'A referral link is only active for two weeks': 'En invitasjonslink er kun gyldig i to uker',
  'You have now changed your email': 'Du har nå byttet epostkonto for brukeren din',
  'You have now changed your password': 'Du har nå byttet passord',
  'You will now be logged out': 'Du blir nå logget ut',
  'Referral link': 'Referral link',
  'Code to exit survey': 'kode for å komme ut av undersøkelsen',
  'Current role: role': 'Din rolle: %0',
  'Center settings': 'Senterinstillinger',
  'Update center': 'Endre senter',
  'New center': 'Nytt senter',
  'Documentation settings': 'Dokumentasjonsinstillinger',
  'Choose documentation pdf': 'Velg dokumentasjon pdf',

  // New center component
  'Change title': 'Bytt navn',
  'Logo settings': 'Logoinnstillinger',
  'Choose file': 'Velg bildefil',
  'Upload and replace logo': 'Last opp og bytt logo',
  'Center title updated': 'Senterets navn er oppdatert',
  'Could not change center title at this time': 'Kunne ikke endre navnet på senteret på dette tidspunktet',
  'Create new center': 'Lag nytt senter',

  // survey retrieval chart component
  'Download as PNG': 'Last ned som PNG',

  // survey retrieval component
  'Text based question. Download raw data to extract this.': 'Tekstbasert spørsmål. Last ned rådataen for å se svarene.',

  // Chart types
  'Bar': 'Stolpediagram',
  'Doughnut': 'Smultringdiagram',
  'Pie': 'Sektordiagram',
  'Line': 'Linjediagram',
  'PolarArea': 'Rosediagram',

  // choose-survey component
  'All Surveys': 'Alle undersøkelsene',
  'Search results for search': 'Søkeresultatene for %0:',
  'Start': 'Start',
  'Start POST': 'Start POST',
  'Start survey': 'Start undersøkelse',
  'Choose center': 'Velg senter',
  'Could not find any published surveys at this time.': 'Tjenesten kunne ikke finne noen publiserte undersøkelser på dette tidspunktet.',

  // PDF download lines
  'Last modified: d': 'Sist oppdatert: %0',
  'Published: d': 'Publisert: %0',
  'Completed: d': 'Avsluttet: %0',
  'Figure: n': 'Figur: %0',
  'Table: n': 'Tabell: %0',

  // Nickname component
  'Name': 'Hva heter du?',
  'You need to answer the pre survey first': 'Du må svare på pre undersøkelsen først',
  'This nickname is taken, choose another one': 'Dette kallenavnet er tatt, velg et annet',

  // Modal dialog in active survey
  'Sorry': 'Beklager',
  'ContactError': 'Noe gikk galt! Venligst kontakt de ansatte.',

  // quit survey prompt
  'Enter the code to quit': 'Skriv inn koden for å avslutte undersøkelsen',
  'Incorrect code': 'Feil kode',

  // play-survey - Free text
  'Max 255 characters': 'Maks 255 bokstaver',
  'Your answer': 'Ditt svar',

  // play survey
  'Show image': 'Vis bilde',

  // Footer
  'Group n': 'Gruppe %0',
  'IT2901 - Informatics Project II': 'IT2901 - Informatikk Prosjektarbeid II',

  // Folder system
  'Warning! This will delete the folder along with ALL surveys inside!':
    'Advarsel! Dette vil slette mappen samt ALLE undersøkelser i mappen!',
  'Rename folder': 'Endre mappenavn',
  'Delete folder': 'Slett mappen',
  'Create subfolder': 'Lag ny undermappe',
  'Folder Options': 'Mappealternativer',
  'New name': 'Nytt mappenavn',
};
