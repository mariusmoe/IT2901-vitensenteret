import { Component, OnInit, Input, ElementRef, OnDestroy } from '@angular/core';
import { SurveyList } from '../../_models/survey_list';
import { SurveyService } from '../../_services/survey.service';
import { FormControl } from '@angular/forms';
import { TranslateService } from '../../_services/translate.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-choose-survey',
  templateUrl: './choose-survey.component.html',
  styleUrls: ['./choose-survey.component.scss']
})
export class ChooseSurveyComponent implements OnInit, OnDestroy {

  searchFormControl = new FormControl();
  surveySub: Subscription;
  loaded = false;
  search = '';
  search_result = false;
  allSurveysNum = 12; // start at 12

  constructor(public surveyService: SurveyService, public translateService: TranslateService) {  }

  ngOnInit() {
    // Loads all active surveys
    this.surveySub = this.surveyService.getAllSurveys().subscribe( (surveys) => {
      this.loaded = true;
    });
    // subscribe to the search form for searching
    this.searchFormControl.valueChanges.debounceTime(500).subscribe(searchQuery => {
      this.search = searchQuery;
    });
  }

  ngOnDestroy() {
    this.surveySub.unsubscribe();
  }
  // Shows the date on the format dd/mm/yyyy
  formatDate(date): string {  return new Date(date).toLocaleDateString(); }

  loadMore() {
    this.allSurveysNum += 12; // load 12 more
  }
}
