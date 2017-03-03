import { Component, OnInit, Input, ElementRef, OnDestroy } from '@angular/core';
import { SurveyList } from '../../_models/survey_list';
import { SurveyService } from '../../_services/survey.service';
import { FormControl } from '@angular/forms';
import { TranslateService } from '../../_services/translate.service';


@Component({
  selector: 'app-choose-survey',
  templateUrl: './choose-survey.component.html',
  styleUrls: ['./choose-survey.component.scss']
})
export class ChooseSurveyComponent implements OnInit, OnDestroy {

  allsurveys: SurveyList[];
  searchFormControl = new FormControl();


  loaded = false;
  search = '';
  search_result = false;




  constructor(private surveyService: SurveyService, private translateService: TranslateService) {
    this.allsurveys = [];
  }

  ngOnInit() {
    // Loads all active surveys from the local database to list
    this.surveyService.getAllSurveys().subscribe( (surveys) => {
      for (const survey of surveys) {
        if (!survey.active) { continue; }
        this.allsurveys.push(survey);
      }

      // subscribe to the search form for searching
      this.searchFormControl.valueChanges.debounceTime(500).subscribe(searchQuery => {
        this.search = searchQuery;
      });
      this.loaded = true;
    });



}

  ngOnDestroy() {
  }


  formatDate(date): string {  return new Date(date).toLocaleDateString(); }
  formatmilliseconds(date): number {  return new Date(date).valueOf(); }
}
