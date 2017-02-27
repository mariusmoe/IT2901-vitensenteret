import {Injectable, Inject} from '@angular/core';
import { TRANSLATIONS } from '../translate/translate';

// based on https://scotch.io/tutorials/simple-language-translation-in-angular-2-part-1


@Injectable()
export class TranslateService {
    private currentLang: string;
    private supportedLangs = [
      { display: 'English', value: 'en' },
      { display: 'Norsk (Bokmål)', value: 'no' },
    ];

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

    public instant(key: string) {
        return this.translate(key);
    }
}
