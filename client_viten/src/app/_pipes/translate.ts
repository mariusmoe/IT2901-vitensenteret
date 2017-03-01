import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '../_services/translate.service';

// based on https://scotch.io/tutorials/simple-language-translation-in-angular-2-part-1

@Pipe({
    name: 'translate',
    pure: false // required to make translations update when language changes.
})

export class TranslatePipe implements PipeTransform {

    constructor(private _translate: TranslateService) { }

    transform(value: string, args: string | string[]): any {
        if (!value) { return; }
        return this._translate.instant(value, args);
    }
}
