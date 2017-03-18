import { Component, OnInit, OnDestroy, ViewChild, animate, state, style, transition, trigger  } from '@angular/core';
import { SurveyService } from '../../_services/survey.service';
import { TranslateService } from '../../_services/translate.service';
import { Survey } from '../../_models/survey';
import { Response } from '../../_models/response';
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
  postSurvey: Survey = null;
  responses: Response[] = null;
  postResponses: Response[] = null;
  loadingSurvey = false;
  loadingPostSurvey = false;
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
    // reset vars first.
    this.survey = undefined;
    this.responses = undefined;
    this.postSurvey = undefined;
    this.postResponses = undefined;

    this.loadingSurvey = true;
    this.surveyService.getSurvey(surveyId).subscribe( (response) => {
      this.responses = <Response[]>response.responses;
      this.survey = <Survey>response.survey;

      if (this.survey.postKey && this.survey.postKey.length > 0) {
        this.loadingPostSurvey = true;
        this.surveyService.getSurvey(this.survey.postKey).subscribe( (postResponse) => {
          this.postResponses = <Response[]>postResponse.responses;
          this.postSurvey = <Survey>postResponse.survey;
          this.loadingPostSurvey = false;
        });
      }
      this.loadingSurvey = false;
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
    // Get date of today
    const today = Date.now();
    const todayFormatted = this.datePipe.transform(today, 'yyyy-MM-dd');

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

    rightAlignedText(25, 39, this.translateService.instant('Date printed: d', todayFormatted));
    const answers = this.responses.length;
    rightAlignedText(25, 44, this.translateService.instant('Number of responses: n', answers.toString()));

    // Get our charts (canvases)
    const canvases = this.surveyDOM.nativeElement.querySelectorAll('canvas.surveyQuestionChart');
    // Get a list withe all the tables
    const tables = this.surveyDOM.nativeElement.querySelectorAll('table.chartData');
    // Set up a dummy canvas. This dummy canvas is used to set a white background
    // and to avoid other corruptions to / of the actual real canvases
    const dummyCanvas = document.createElement('canvas');
    const dummyCanvasContext = dummyCanvas.getContext('2d');
    dummyCanvas.width = canvases[0].height * 2;
    dummyCanvas.height = canvases[0].height;
    dummyCanvasContext.fillStyle = '#FFFFFF';

    // Declare variables that are used to handle positioning of our charts
    let pageNr = 1;           // page number (starting at 1)
    let baseOffset = 65;      // The fixed base offset from the top of the page
    const chartHeight = 80;   // The drawn chart's height in the PDF
    const tableOffset = 10;
    canvases.forEach((canvas, i) => {
      if (i > 0) {
        pageNr += 1;
        pdf.addPage();
        baseOffset = 30; // Base page offset is 20, plus 10
      }
      // Draw our white background on the dummy canvas
      dummyCanvasContext.fillRect(0, 0, dummyCanvas.width, dummyCanvas.height);
      // Draw the chart from the real canvas onto our dummy canvas, centered in the dummy canvas
      dummyCanvasContext.drawImage(canvas, dummyCanvas.width / 2 - canvas.width / 2, 0);
      dummyCanvasContext.drawImage(canvas, dummyCanvas.width / 2 - canvas.width / 2, 0);
      // Add the chart with white background into our PDF at the right position
      pdf.addImage(dummyCanvas.toDataURL('image/jpeg', 0.6), 'JPEG', 25,
                   baseOffset, 160, chartHeight);

      // Modify our table slightly, as to make it pretty for the PDF.
      // This circumvents the fact that the autoTableHtmlToJson does not deal with
      // html cell attribute colspan.
      const tableClone = tables[i].cloneNode(true); // true => copy children.
      const prepostRow = tableClone.querySelector('tr.prepost');
      const prepostRowHeaders = tableClone.querySelectorAll('tr.prepost th');
      if (prepostRowHeaders) {
        const preObject = prepostRowHeaders[0].cloneNode();
        // prepostRowHeaders: empty, PRE, POST
        prepostRow.insertBefore(preObject, prepostRowHeaders[2]);
        prepostRow.appendChild(preObject.cloneNode());
        // should now be: empty, PRE, empty, POST, empty
      }
      // End of circumventing the colspan issue here.

      // Append our clone to the pdf
      const res = pdf.autoTableHtmlToJson(tableClone);
      const localOffset = baseOffset + chartHeight + tableOffset;
      pdf.autoTable(res.columns, res.data, {startY: localOffset} );
      // <-- END TABLE
    });

    // Add page count to the bottom of the page
    pdf.setFontSize(8);
    for (let i = 1; i <= pageNr; i++) {
      pdf.setPage(i); // Set the current page to write on first, then add page count to each page
      rightAlignedText(25, pdf.internal.pageSize.height - 20, i + '/' + pageNr);
    }

    // save our doc with a OS-friendly filename that is related to the survey at hand
    const filename = todayFormatted + '_' + this.survey.name.replace(/ /g, '_').replace(/\?/g, '').replace(/\./g, '') + '.pdf';
    pdf.save(filename);
    // update our component with our new status
    this.generatingPDF = false;
  }
}
