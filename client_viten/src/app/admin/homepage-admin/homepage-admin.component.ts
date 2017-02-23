import { Component, OnInit } from '@angular/core';
import { SurveyService } from '../../_services/survey.service';

@Component({
  selector: 'app-homepage-admin',
  templateUrl: './homepage-admin.component.html',
  styleUrls: ['./homepage-admin.component.scss']
})
export class HomepageAdminComponent implements OnInit {

  private getSelectedSurvey;
  constructor(private surveyService: SurveyService) {
    this.getSelectedSurvey = this.surveyService.getSelectedSurvey().subscribe(survey => {
        console.log(survey); // Subscribe and get user from the authService
      });
    }

  ngOnInit() {
  }


}
