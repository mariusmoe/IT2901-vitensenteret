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

  constructor(public surveyService: SurveyService, public translateService: TranslateService) {

  }

  ngOnInit() {
    // Loads all active surveys
    this.surveySub = this.surveyService.getAllSurveys().subscribe( (surveys) => {
      this.loaded = true;
      console.log('oninit');
    });
    // subscribe to the search form for searching
    this.searchFormControl.valueChanges.debounceTime(500).subscribe(searchQuery => {
      this.search = searchQuery;
    });
  }

  ngOnDestroy() {
    console.log('ondestroy');
    this.surveySub.unsubscribe();
  }


  formatDate(date): string {  return new Date(date).toLocaleDateString(); }
  formatmilliseconds(date): number {  return new Date(date).valueOf(); }
}
