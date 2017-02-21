import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'active-survey',
  templateUrl: './active-survey.component.html',
  styleUrls: ['./active-survey.component.scss']
})
export class ActiveSurveyComponent implements OnInit {
  private started = false;
  //q_type: string[] = ['multi', 'smily', 'star', 'text'];
  testquestions: string[] = ["q1", "q2", "q3", "q4"];

  constructor() { }

  ngOnInit() {
  }
  public hidePlayButton(){

  }
}
