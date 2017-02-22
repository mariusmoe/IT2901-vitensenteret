import { Component, OnInit,Input,ElementRef, OnDestroy } from '@angular/core';
import { SurveyList } from '../../_models/survey_list';
import { SurveyService } from '../../_services/survey.service';


@Component({
  selector: 'app-choose-survey',
  templateUrl: './choose-survey.component.html',
  styleUrls: ['./choose-survey.component.scss']
})
export class ChooseSurveyComponent implements OnInit,OnDestroy {

  //all surveys that
  private allsurveys: SurveyList[];

  private recentsurveys: SurveyList[];
  private searchedsurveys: SurveyList[];

  private loaded: boolean = false;
  private search:string="";
  private search_result: boolean= false;

  @Input() id: string;


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
  }

  ngOnDestroy(){

  }

showresult():void{
//TODO add the survey list in a neat and formal manner
    if(this.search){
      this.search_result= true;}
    else{
      this.search_result=false;}
};

clicked(name,_id):void{
  for (let survey of this.allsurveys){
      if(survey._id.toString() == _id.toString()){
        //TODO open a new window with the survey related to the id
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
      console.log(survey);
    }
  }
  console.log("results"+this.searchedsurveys)
}



}
