import { Pipe, PipeTransform } from '@angular/core';
import { TranslateService } from '../_services/translate.service';

// based on https://scotch.io/tutorials/simple-language-translation-in-angular-2-part-1

@Pipe({
    name: 'translate',
})

export class TranslatePipe implements PipeTransform {

    constructor(private _translate: TranslateService) { }

    transform(value: string, args: any[]): any {
        if (!value) { return; }
        return 'T:' + this._translate.instant(value);
    }
}
