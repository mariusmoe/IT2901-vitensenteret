import { Component, OnInit } from '@angular/core';
import { SurveyService } from '../../_services/survey.service';
import { Survey } from '../../_models/survey';
import { Router, ActivatedRoute, Params, NavigationStart } from '@angular/router';


@Component({
  selector: 'app-homepage-admin',
  templateUrl: './homepage-admin.component.html',
  styleUrls: ['./homepage-admin.component.scss']
})
export class HomepageAdminComponent implements OnInit {
  survey: Survey = null;
  loadingSurvey = false;

  constructor(private surveyService: SurveyService, private router: Router, private route: ActivatedRoute) {
    // set survey to null initially.
    this.survey = null;
    // If we have a router parameter, we should attempt to use that first.
    const param = this.route.snapshot.params['surveyId'];
    if (param) {
      this.getSurvey(param);
    }
    // whenever the route *starts* to change we should be up and ready to query for data
    // so that it is available to the user asap.
    this.router.events.filter(event => event instanceof NavigationStart).subscribe( (event: NavigationStart) => {
      const newParam: string = event.url.slice(event.url.lastIndexOf('/') + 1); // + 1 to remove the /
      this.getSurvey(newParam);
    });
  }

  ngOnInit() {

  }

  private getSurvey(surveyId: string) {
    this.loadingSurvey = true;
    this.surveyService.getSurvey(surveyId).subscribe( (survey: Survey) => {
      this.loadingSurvey = false;
      this.survey = survey;
    });
  }
}
