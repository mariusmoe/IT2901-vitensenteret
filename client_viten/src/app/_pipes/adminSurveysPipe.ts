import { Injectable, Pipe, PipeTransform } from '@angular/core';
import { SurveyList } from '../_models/survey_list';
@Pipe({
    name: 'adminSurveyPipe'
})
@Injectable()
export class AdminSurveysPipe implements PipeTransform {
    transform(items: SurveyList[], query: string, maxResults: number, showPosts: boolean, onlyActive: boolean): SurveyList[] {
      let array = items;
      if (showPosts || onlyActive) {
        array = array.filter(s => {
          return ((onlyActive && s.active) || !onlyActive) && ((s.isPost && showPosts) || !s.isPost);
        });
      }
      if (query && query.length > 0) {
        const queryWords = query.toLowerCase().split(/[ ]+/);
        array = array.filter(item => {
          return queryWords.every(s => {
            return item.name.toLowerCase().indexOf(s) >= 0 ||
              item.comment.toLowerCase().indexOf(s) >= 0;
          });
        });
      }
      return array
        .sort((s1, s2) => {
          const d1 = new Date(s1.date).valueOf();
          const d2 = new Date(s2.date).valueOf();
          if (d1 > d2) {
            return -1; // recent surveys at the top (inverted list)
          }
          if (d1 < d2) {
            return 1;
          }
          return + s1.name.localeCompare(s2.name); })
        .slice(0, maxResults);
        // 20 entries shown, max!
    }
}

// item.name.toLowerCase().indexOf(q) !== -1 || (item.comment && item.comment.toLowerCase().indexOf(q) !== -1);
