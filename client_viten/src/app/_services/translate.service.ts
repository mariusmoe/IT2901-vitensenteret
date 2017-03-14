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

    public getCurrentLang() {
        return this.currentLang;
    }

    constructor(@Inject(TRANSLATIONS) private _translations: any) {
    }

    public use(lang: string): void {
        // set current language
        this.currentLang = lang;
        localStorage.setItem('lang', lang);
    }

    private translate(key: string): string {
        // private perform translation
        const translation = key;

        if (this._translations[this.currentLang] && this._translations[this.currentLang][key]) {
            return this._translations[this.currentLang][key];
        }
        // TODO: make this return key; when done with translation
        throw Error('NO TRANSLATION FOUND FOR : ' + key);
    }


    public replace(word = '', words: string | string[] = '') {
        let translation: string = word;

        const values: string[] = [].concat(words);
        values.forEach((e, i) => {
            translation = translation.replace(this.PLACEHOLDER.concat(<any>i), e);
        });

        return translation;
        // return 'T:' + translation;
    }

    public instant(key: string, words?: string | string[]) { // add optional parameter
        const translation: string = this.translate(key);

        if (!words) { return translation; } // return 'T:' + translation; }
        return this.replace(translation, words); // call replace function
    }
}
