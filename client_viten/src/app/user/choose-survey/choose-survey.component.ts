import { Component, OnInit, Input, ElementRef, OnDestroy } from '@angular/core';
import { SurveyList } from '../../_models/survey_list';
import { SurveyService } from '../../_services/survey.service';


@Component({
  selector: 'app-choose-survey',
  templateUrl: './choose-survey.component.html',
  styleUrls: ['./choose-survey.component.scss']
})
export class ChooseSurveyComponent implements OnInit, OnDestroy {

  private allsurveys: SurveyList[];
  private searchedsurveys: SurveyList[];
  private recentsurveys;
  private recentsurveysmax;


  private loaded = false;
  private search = '';
  private search_result = false;
  private tall = 0;




  constructor(private surveyService: SurveyService) {
    this.allsurveys = [];
    this.searchedsurveys = [];
    this.recentsurveys = [];
    this.recentsurveysmax = [];
  }

  ngOnInit() {
    // Loads all surveys from the local database to list
    this.surveyService.getAllSurveys().subscribe( (surveys) => {
      for (const survey of surveys) {
        if (!survey.active) { continue; }
        this.allsurveys.push(survey);
      }

      // No use of this yet since the database keeps the recent survey in the last indext of all surveys
      /*
      for (const survey of this.allsurveys) {
        this.recentsurveys.push([this.formatmilliseconds(survey.date), survey._id, survey.name]);
      }
      this.recentsurveys.reverse();
       */
      this.allsurveys.reverse();

      // Shows the 10 last surveys of all surveys
      for (const limit of this.allsurveys){
          if (this.tall === 10) {
            break;
          }else {
            this.recentsurveysmax.push(limit);
            this.tall++;
          };
      }

      this.loaded = true;
    });



}

  ngOnDestroy() {
  }

clicked(name, _id): void {
  for (const survey of this.allsurveys){
      if (survey._id.toString() === _id.toString()) {
        console.log('the id exists');
    }
  }
}

searched(search): void {
  if (this.search_result === false) {
    this.search_result = !this.search_result;
  }
  this.searchedsurveys.splice(0);
  for (const survey of this.allsurveys){
    if (survey.name.toLowerCase().indexOf(search.toLowerCase().trim()) > -1) {
      this.searchedsurveys.push(survey);
        }
  }
  console.log('results' + this.searchedsurveys);
}


recent(): void {

    }




formatDate(date): string {  return new Date(date).toLocaleDateString(); }
formatmilliseconds(date): number {  return new Date(date).valueOf(); }
}
