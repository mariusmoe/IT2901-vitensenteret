import { Component, OnInit, OnDestroy, ViewChild, animate, state, style, transition, trigger  } from '@angular/core';
import { SurveyService } from '../../_services/survey.service';
import { Survey } from '../../_models/survey';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
//  import * as jsPDF from 'jspdf';
declare const jsPDF: any;

@Component({
  selector: 'app-homepage-admin',
  templateUrl: './homepage-admin.component.html',
  styleUrls: ['./homepage-admin.component.scss'],
  animations: [
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate('0.3s ease-in-out', style({opacity: 1 }))])
    ])
  ]
})
export class HomepageAdminComponent implements OnInit, OnDestroy {
  survey: Survey = null;
  loadingSurvey = false;
  @ViewChild('surveyDOM') surveyDOM;
  generatingPDF = false;

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



  /**
   * Downloads the raw data of the survey
   * @param  {string} type the type of raw data. Either 'csv' or 'json'
   */
  downloadAs(type: string) {
    this.surveyService.getSurveyAs(this.survey._id, type).subscribe(
      result => {
        const data = (type === 'csv' ? result._body : result.json());
        const dlLink = document.createElement('a');
        dlLink.download = this.survey.name.replace(/ /g, '_').replace(/\?/g, '').replace(/\./g, '') + '.' + type;
        const blob = new Blob([result._body], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        dlLink.href = url;
        // Then we do some DOM trickery to click this link to begin the download
        document.body.appendChild(dlLink);
        dlLink.click();
        document.body.removeChild(dlLink);
      },
      error => {console.log('error downloading as ' + type); }, // TODO: clean up error logging
    );
  }

  downloadAsPDF() {
    const that = this;
    this.generatingPDF = true;
    const pdf = new jsPDF();
    const filename = this.survey.name.replace(/ /g, '_').replace(/\?/g, '').replace(/\./g, '') + '.pdf';

    pdf.setFontSize(20);
    pdf.text(10, 10, this.survey.name);
    pdf.setFontSize(12);
    pdf.text(10, 20, this.survey.comment);
    const canvases = this.surveyDOM.nativeElement.querySelectorAll('canvas');
    console.log(canvases);


    function canvasesAdded() {
      pdf.save(filename);
      that.generatingPDF = false;
    }


    function recursiveAddQuestions(index, offset) {
      if (index < canvases.length) {
        pdf.addHTML(canvases[index], 0, offset, function() {
          recursiveAddQuestions(index + 1, offset + 100);
          console.log('added following canvas at offset: ' + 100);
          console.log(canvases[index]);
        });
      } else {
        canvasesAdded();
      }
    }
    // add canvases
    recursiveAddQuestions(0, 30);
  }
}
