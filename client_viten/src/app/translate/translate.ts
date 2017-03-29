import { InjectionToken } from '@angular/core';

// based on https://scotch.io/tutorials/simple-language-translation-in-angular-2-part-1

// import translations
import { LANG_EN_NAME, LANG_EN_TRANS } from './lang-en';
import { LANG_NO_NAME, LANG_NO_TRANS } from './lang-no';

// translation token
export const TRANSLATIONS = new InjectionToken('translations');

// all translations
// const dictionary = {
//     [LANG_EN_NAME]: LANG_EN_TRANS,
//     [LANG_NO_NAME]: LANG_NO_TRANS,
// };

const dictionary = {
  'en': LANG_EN_TRANS,
  'no': LANG_NO_TRANS
};

// providers
export const TRANSLATION_PROVIDERS = [
    { provide: TRANSLATIONS, useValue: dictionary },
];
