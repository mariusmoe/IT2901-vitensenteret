import { Component, OnInit, OnDestroy } from '@angular/core';
import { SurveyService } from '../../_services/survey.service';
import { Survey } from '../../_models/survey';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-homepage-admin',
  templateUrl: './homepage-admin.component.html',
  styleUrls: ['./homepage-admin.component.scss']
})
export class HomepageAdminComponent implements OnInit, OnDestroy {
  survey: Survey = null;
  loadingSurvey = false;

  private routerSub: Subscription;

  constructor(private surveyService: SurveyService, private router: Router, private route: ActivatedRoute) {
  }

  ngOnInit() {
    // whenever we navigate, we should query for the survey.
    this.routerSub = this.router.events.filter(event => event instanceof NavigationEnd).subscribe( (event: NavigationEnd) => {
      const param = this.route.snapshot.params['surveyId'];
      if (param) {
        this.getSurvey(param);
      }
    });
  }

  ngOnDestroy() {
    // unsubscribe when this component gets destroyed!
    this.routerSub.unsubscribe();
  }

  private getSurvey(surveyId: string) {
    this.loadingSurvey = true;
    this.surveyService.getSurvey(surveyId).subscribe( (survey: Survey) => {
      this.loadingSurvey = false;
      this.survey = survey;
    });
  }
}
