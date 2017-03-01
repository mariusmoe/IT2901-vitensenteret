import 'rxjs/add/operator/switchMap';

import { Component, OnInit } from '@angular/core';
import { SurveyList } from '../../_models/index';
import { SurveyService } from '../../_services/survey.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import {FormControl} from '@angular/forms';
import 'rxjs/add/operator/debounceTime';


@Component({
  selector: 'app-all-surveys',
  templateUrl: './all-surveys.component.html',
  styleUrls: ['./all-surveys.component.scss']
})
export class AllSurveysComponent implements OnInit {
    loading = false;
    searchInput = '';
    searchFormControl = new FormControl();
    searchLoading = false;
    searchResultNum = 20;

    constructor(
      private router: Router,
      public route: ActivatedRoute,
      public surveyService: SurveyService) {
        // request fresh list of surveys
        this.getSurveys();
      }

    ngOnInit() {
      this.searchFormControl.valueChanges.debounceTime(500).subscribe(searchQuery => {
        this.searchInput = searchQuery;
      });
    }

    /**
     * Select one survey form the list
     * @param  {string} surveyId the survey ID
     * Appends the surveyId to the router navigation.
     */
    select(surveyId: string) {
      this.router.navigate(['/admin', surveyId]);
    }

    /**
     * get all surveys as a list
     */
    private getSurveys() {
      this.loading = true;
      const sub = this.surveyService.getAllSurveys().subscribe(result => {
        this.loading = false;
        sub.unsubscribe();
      });
    }

    formatDate(dateString: string) {
      return new Date(dateString).toLocaleDateString();
    }
}
