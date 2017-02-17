import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-active-survey',
  templateUrl: './active-survey.component.html',
  styleUrls: ['./active-survey.component.scss']
})
export class ActiveSurveyComponent implements OnInit {
  private started = false;

  constructor() { }

  ngOnInit() {
  }
  public hidePlayButton(){
    
  }
}
