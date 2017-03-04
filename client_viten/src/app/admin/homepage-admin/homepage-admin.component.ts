import { Component, OnInit, OnDestroy, ViewChild, animate, state, style, transition, trigger  } from '@angular/core';
import { SurveyService } from '../../_services/survey.service';
import { TranslateService } from '../../_services/translate.service';
import { Survey } from '../../_models/survey';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { DatePipe } from '@angular/common';

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

  constructor(private surveyService: SurveyService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    private translateService: TranslateService) {
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

  /**
   * Loads a survey into the component
   * @param  {string} surveyId the id of the survey to load
   */
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

  /**
   * Initiates a download of a PDF containing data of the given survey
   */
  downloadAsPDF() {
    // notify component that we are generating the PDF
    this.generatingPDF = true;
    const pdf = new jsPDF();

    // define functions that allow us some text position manipulation
    const centeredText = function(y, text) {
      const textWidth = pdf.getStringUnitWidth(text) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
      const textOffset = (pdf.internal.pageSize.width - textWidth) / 2;
      pdf.text(textOffset, y, text);
    };
    const rightAlignedText = function(margin, y, text) {
      const textWidth = pdf.getStringUnitWidth(text) * pdf.internal.getFontSize() / pdf.internal.scaleFactor;
      const textOffset = pdf.internal.pageSize.width - textWidth - margin;
      pdf.text(textOffset, y, text);
    };

    // start wroting data to the PDF.
    pdf.setFontSize(30);
    centeredText(22, 'Vitensenteret');
    pdf.setFontSize(18);
    pdf.text(25, 35, this.survey.name);
    pdf.setFontSize(8);
    pdf.text(25, 44, this.survey.comment);
    // Dates and num answers are right-aligned
    rightAlignedText(25, 34, this.translateService.instant('Date created: d', this.datePipe.transform(this.survey.date, 'yyyy-MM-dd')));
    const now = Date.now();
    const nowText = this.datePipe.transform(now, 'yyyy-MM-dd');

    rightAlignedText(25, 39, this.translateService.instant('Date printed: d', nowText));
    const answers = this.survey.questionlist[0].answer.length || 0;
    rightAlignedText(25, 44, this.translateService.instant('Number of responses: n', answers.toString()));

    // Get our charts (canvases)
    const canvases = this.surveyDOM.nativeElement.querySelectorAll('canvas.surveyQuestionChart');
    // Set up a dummy canvas. This dummy canvas is used to set a white background
    // and to avoid other corruptions to / of the actual real canvases
    const dummyCanvas = document.createElement('canvas');
    const dummyCanvasContext = dummyCanvas.getContext('2d');
    dummyCanvas.width = canvases[0].height * 2;
    dummyCanvas.height = canvases[0].height;
    dummyCanvasContext.fillStyle = '#FFFFFF';

    // Declare variables that are used to handle positioning of our charts
    let index = 0;
    let i = 0;
    let firstPage = 35;
    for (const canvas of canvases) {
      // Add another page if necessary
      if ((i * 90) > 180 || index === 2) {
        pdf.addPage();
        i = 0;
      }
      // Draw our white background on the dummy canvas
      dummyCanvasContext.fillRect(0, 0, dummyCanvas.width, dummyCanvas.height);
      // Draw the chart from the real canvas onto our dummy canvas, centered in the dummy canvas
      dummyCanvasContext.drawImage(canvas, dummyCanvas.width / 2 - canvas.width / 2, 0);
      // Add the chart with white background into our PDF at the right position
      pdf.addImage(dummyCanvas.toDataURL('image/jpeg', 0.6), 'JPEG', 25, 20 + firstPage + (i * 90), 160, 80);
      // Update our positioning variables
      if (index === 1) { firstPage = 0; }
      i++;
      index++;
    }
    // save our doc with a OS-friendly filename that is related to the survey at hand
    const filename = this.survey.name.replace(/ /g, '_').replace(/\?/g, '').replace(/\./g, '') + '.pdf';
    pdf.save(filename);
    // update our component with our new status
    this.generatingPDF = false;
  }
}
