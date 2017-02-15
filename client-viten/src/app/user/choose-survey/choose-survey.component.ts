import { Component, OnInit,Input } from '@angular/core';
import { Surveys } from '../../_models/surveys';



@Component({
  selector: 'app-choose-survey',
  templateUrl: './choose-survey.component.html',
  styleUrls: ['./choose-survey.component.scss']
})
export class ChooseSurveyComponent implements OnInit {

  surveys: Surveys[]=[{id: 1, name: 'Utgang'}, {id: 2, name: 'Graviton'},{id: 3, name: 'planetarium'},{id: 4, name: 'makerspace'}];
  databasefetch:Surveys[]=[];
  search:string="";

  @Input() searching: string;

  constructor(){

  }

  ngOnInit() {
    console.log("test");
  }

showresult():void{
//TODO add the survey list in a neat and formal manner
this.databasefetch.push({id:null,name:""});
console.log(this.search+"");
};



}
