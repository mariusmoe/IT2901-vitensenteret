import { Component, OnInit } from '@angular/core';
import { SurveyService } from '../../_services/survey.service';
import { Survey } from '../../_models/survey';
import { Router, ActivatedRoute, Params } from '@angular/router';


@Component({
  selector: 'app-homepage-admin',
  templateUrl: './homepage-admin.component.html',
  styleUrls: ['./homepage-admin.component.scss']
})
export class HomepageAdminComponent implements OnInit {

  private getSelectedSurvey;
  survey: Survey;

  loadingSurveys = false;

  constructor(private surveyService: SurveyService, private router: Router, private route: ActivatedRoute) {
    }

  ngOnInit() {
    // If we have a router parameter, we should attempt to use that first.
    const param = this.route.snapshot.params['surveyId'];
    this.getSurvey(param);

    // subscribe to continuous updates.
    this.surveyService.getSelectedSurvey().subscribe(surveyId => {
      if (surveyId) {
        this.getSurvey(surveyId);
      }
    });
  }



  private getSurvey(surveyId: string) {
    this.loadingSurveys = true;
    this.surveyService.getSurvey(surveyId).subscribe( (survey: Survey) => {
      this.loadingSurveys = false;
      this.survey = survey;
    });
  }
}
