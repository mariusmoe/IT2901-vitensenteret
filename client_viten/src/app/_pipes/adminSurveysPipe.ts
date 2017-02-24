import {Injectable, Pipe, PipeTransform } from '@angular/core';
import { SurveyList } from '../_models/survey_list';
@Pipe({
    name: 'adminSurveyPipe'
})
@Injectable()
export class AdminSurveysPipe implements PipeTransform {
    transform(items: SurveyList[], query: string): SurveyList[] {
        return items.filter(item => {
            if (query && query.length > 0) {
              return item.name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
              (item.comment && item.comment.toLowerCase().indexOf(query.toLowerCase()) !== -1);
            } else {
              return true;
            }
          })
          .sort((s1, s2) => {
            if (s1.active && !s2.active) {
              return 1;
            }
            if (!s1.active && s2.active) {
              return -1;
            }
            const d1 = new Date(s1.date).valueOf();
            const d2 = new Date(s2.date).valueOf();
            if (d1 > d2) {
              return -1; // recent surveys first!
            }
            if (d1 < d2) {
              return 1;
            }
            return + s1.name.localeCompare(s2.name); })
          .slice(0, 20);
          // 20 entries shown, max!
    }
}
