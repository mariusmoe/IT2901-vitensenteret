import { Component, OnInit,Input,ElementRef, OnDestroy } from '@angular/core';
import { SurveyList } from '../../_models/survey_list';
import { SurveyService } from '../../_services/survey.service';


@Component({
  selector: 'app-choose-survey',
  templateUrl: './choose-survey.component.html',
  styleUrls: ['./choose-survey.component.scss']
})
export class ChooseSurveyComponent implements OnInit,OnDestroy {

  private allsurveys: SurveyList[];
  private searchedsurveys: SurveyList[];
  private recentsurveys;


  private loaded: boolean = false;
  private search:string="";
  private search_result: boolean= false;




  constructor(private surveyService: SurveyService){
    this.allsurveys = [];
    this.recentsurveys = [];
    this.searchedsurveys = [];
  }

  ngOnInit() {
    this.surveyService.getAllSurveys().subscribe( (surveys) => {
      for (let survey of surveys) {
        if (!survey.active) { continue; }
        this.allsurveys.push(survey);
      }
      console.log(this.allsurveys);
      this.loaded = true;
    });

    this.recent();
  }

  ngOnDestroy(){
  }

clicked(name,_id):void{
  for (let survey of this.allsurveys){
      if(survey._id.toString() == _id.toString()){
        console.log("the id exists");
    }
  }
}

searched(search): void {
  if(this.search_result == false){
    this.search_result = !this.search_result;
  }
  this.searchedsurveys.splice(0);
  for(let survey of this.allsurveys){
    if(survey.name.toLowerCase().indexOf(search.toLowerCase().trim()) > -1){
      this.searchedsurveys.push(survey);
        }
  }
  console.log("results"+this.searchedsurveys)
}


recent(): void{
for(let survey of this.allsurveys){
  this.recentsurveys.push(this.formatmilliseconds(survey.date));

  console.log(this.allsurveys);
  console.log(this.recentsurveys);

  }

}
formatDate(date): string{  return new Date(date).toLocaleDateString();}
formatmilliseconds(date): number{  return new Date(date).valueOf();}
}
