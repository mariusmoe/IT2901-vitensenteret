import { Component, OnInit, Input, ElementRef, OnDestroy } from '@angular/core';
import { SurveyList } from '../../_models/survey_list';
import { SurveyService } from '../../_services/survey.service';
import { CenterService } from '../../_services/center.service';
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
  centerId = null;
  centerData = null;
  allCenters = [];
  loaded = false;
  search = '';
  search_result = false;
  allSurveysNum = 12; // start at 12

  surveyList: SurveyList[] = [];

  constructor(
    public surveyService: SurveyService,
    public centerService: CenterService,
    public translateService: TranslateService) {
      // load center information
      const currentCenter = localStorage.getItem('center');
      this.centerId = currentCenter;

      const allCentersSub = this.centerService.getAllCenters().subscribe(result => {
        if (result) {
          this.allCenters = result;
          this.centerData = result.filter(c => { return c['_id'] === this.centerId})[0];
        }
        allCentersSub.unsubscribe();
      });

      if (this.centerId) {
        this.loadCenterData();
      }

    }

  ngOnInit() {
    // subscribe to the search form for searching
    this.searchFormControl.valueChanges.debounceTime(500).subscribe(searchQuery => {
      this.search = searchQuery;
    });
  }

  ngOnDestroy() {
  }
  // Shows the date on the format dd/mm/yyyy
  formatDate(date): string {  return new Date(date).toLocaleDateString(); }

  loadMore() {
    this.allSurveysNum += 12; // load 12 more
  }


  loadCenterData() {
    // Loads all active surveys directly
    this.loaded = false;
    localStorage.setItem('center', this.centerId);
    this.centerData = this.allCenters.filter(c => { return c['_id'] === this.centerId})[0];

    const sub = this.surveyService.getAllPublishedSurveys(this.centerId).subscribe( (surveys) => {
      this.surveyList = surveys;
      this.loaded = true;
      sub.unsubscribe();
    });
  }
}
