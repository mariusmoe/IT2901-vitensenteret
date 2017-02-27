import { Component, OnInit } from '@angular/core';
import {MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA} from '@angular/material';

@Component({
  selector: 'app-survey-retrieval',
  templateUrl: './survey-retrieval.component.html',
  styleUrls: ['./survey-retrieval.component.scss']
})
export class SurveyRetrievalComponent implements OnInit {

  private chartType: String;
  private chartTypes = [
    {value: 'bar-chart', viewValue: 'Bar Chart'},
    {value: 'doughnut-chart', viewValue: 'Doughnut Chart'}
  ]

  constructor() { }

  ngOnInit() {
  }

}
