import { Component, OnInit,Input,ElementRef, OnDestroy } from '@angular/core';
import { Surveys } from '../../_models/surveys';



@Component({
  selector: 'app-choose-survey',
  templateUrl: './choose-survey.component.html',
  styleUrls: ['./choose-survey.component.scss']
})
export class ChooseSurveyComponent implements OnInit,OnDestroy {

  surveys: Surveys[]=[{id: 1, name: 'Utgang'}, {id: 2, name: 'Graviton'},{id: 3, name: 'planetarium'},{id: 4, name: 'makerspace'}];
  resultsfromdatabase:Surveys[]=[];
  search:string="";

  @Input() id: string;


  constructor(){

  }

  ngOnInit() {
    
  }


  ngOnDestroy(){

  }

showresult():void{
//TODO add the survey list in a neat and formal manner
//this.resultsfromdatabase.push({id:null,name:""});



console.log(this.search+"");
};




}
