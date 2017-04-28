import {Injectable, Inject} from '@angular/core';
import { TRANSLATIONS } from '../translate/translate';

// based on https://scotch.io/tutorials/simple-language-translation-in-angular-2-part-1


@Injectable()
export class TranslateService {
    private currentLang: string;
    private supportedLangs = [
      { display: 'English', value: 'en' },
      { display: 'Norwegian', value: 'no' },
    ];
    private PLACEHOLDER = '%';

    constructor(@Inject(TRANSLATIONS) private _translations: any) {
    }

    /**
     * Gets the currently used language
     * @return {string} the currenly used language, in short. I.e. 'en'.
     */
    public getCurrentLang(): string {
        return this.currentLang;
    }

    /**
     * Changes the translation language
     * @param {string} lang the new language ot be used, in short. I.e. 'en'.
     */
    public use(lang: string): void {
        // set current language
        this.currentLang = lang;
        localStorage.setItem('lang', lang);
    }

    /**
     * Translates a key into the readable output in the selected language
     * @param  {string} key the text key that is to be translated
     * @return {string}     the translated text
     */
    private translate(key: string): string {
        // private perform translation
        const translation = key;

        if (this._translations[this.currentLang] && this._translations[this.currentLang][key]) {
            return this._translations[this.currentLang][key];
        }
        return key;
        // make this return key; when done with translation
        // throw Error('NO TRANSLATION FOUND FOR : ' + key);
    }

    /**
     * Formats text and substitutes the placeholder tag with the input text
     * @param  {string}    word='' the text that is to be formatted
     * @param  {string || string[]} words The string or strings that is to be filled into text
     * @return {string}            The final formatted string
     */
    public replace(word = '', words: string | string[] = ''): string {
        let translation: string = word;

        const values: string[] = [].concat(words);
        values.forEach((e, i) => {
            translation = translation.replace(this.PLACEHOLDER.concat(<any>i), e);
        });

        return translation;
        // return 'T:' + translation;
    }

    /**
     * translate text
     * @param  {string}    key the key that is to be translated
     * @param  {string || string[]}    words The string or strings that is to be filled into text
     * @return {string}        The translated text
     */
    public instant(key: string, words?: string | string[]): string { // add optional parameter
        const translation: string = this.translate(key);

        if (!words) { return translation; } // return 'T:' + translation; }
        return this.replace(translation, words); // call replace function
    }
}
