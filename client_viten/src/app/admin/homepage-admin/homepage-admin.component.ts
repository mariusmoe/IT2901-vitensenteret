import { Component, OnInit, OnDestroy, ViewChild } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { SurveyService } from '../../_services/survey.service';
import { TranslateService } from '../../_services/translate.service';
import { AuthenticationService } from '../../_services/authentication.service';
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

    public  dialogRef: MdDialogRef<DeleteSurveyDialog>;

  constructor(private surveyService: SurveyService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    public authenticationService: AuthenticationService,
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
    console.log(this.authenticationService.getUser());
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
   * Delete current survey
   *
   * Promts the user to delete the survey
   */
  deleteSurvey(surveyId: string) {

      this.dialogRef = this.dialog.open(DeleteSurveyDialog, {
        disableClose: false,
        width: '500px',
      });
      this.dialogRef.afterClosed().subscribe(result => {
        // console.log('result: ' + result);
        if (result === 'yes') {
          this.surveyService.deleteSurvey(surveyId).subscribe(
            _result => {
              // delete SUCCESS
              this.openSnackBar(this.translateService.instant('Survey deleted'), 'SUCCESS');
              this.router.navigate(['admin']);
            },
            error => {
              console.error('Error deleting ' + surveyId);
            }
          );
        }
        this.dialogRef = null;
      });
  }

  /**
   * Toggles the active state of the survey
   */
  toggleActive() {
    // store current state
    const toggleStateBeforePatch = this.survey.active;
    // set new state
    this.survey.active = !this.survey.active;
    // patch the survey
    const sub1 = this.surveyService.patchSurvey(this.survey._id, this.survey).subscribe(result => {
      // update the all surveys list as well
      const sub2 = this.surveyService.getAllSurveys().subscribe(r => sub2.unsubscribe() );

      sub1.unsubscribe();
    }, error => {
      // reset if things went bad
      this.survey.active = toggleStateBeforePatch;

      sub1.unsubscribe();
    });
  }


  openSnackBar(message: string, action: string) {
    this.snackBar.open(message, action, {
      duration: 4000,
    });
  }

  /**
   * Downloads the raw data of the survey
   * @param  {string} type the type of raw data. Either 'csv' or 'json'
   */
  downloadAs(type: string) {
    if (type === 'json') {
      const dlLink = document.createElement('a') as any;
      dlLink.download = this.survey.name.replace(/ /g, '_').replace(/\?/g, '').replace(/\./g, '') + '.' + type;

      const blob = new Blob([JSON.stringify({ survey: this.survey, responses: this.responses}, null, '\t')], { type: 'application/json' });
      const url = window.URL.createObjectURL(blob);
      dlLink.href = url;
      // Then we do some DOM trickery to click this link to begin the download
      document.body.appendChild(dlLink);
      dlLink.click();
      document.body.removeChild(dlLink);
      return;
    }

    this.surveyService.getSurveyAsCSV(this.survey._id).subscribe(
      result => {
        const data = result._body;
        const dlLink = document.createElement('a') as any;
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

    // start writing data to the PDF.
    pdf.setFontSize(30);
    centeredText(22, 'Vitensenteret');
    pdf.setFontSize(18);
    pdf.text(25, 35, this.survey.name);
    pdf.setFontSize(8);
    pdf.text(25, 44, this.survey.comment);
    // Dates and num answers are right-aligned (Logo added at the very bottom)
    rightAlignedText(25, 34, this.translateService.instant('Date created: d', this.datePipe.transform(this.survey.date, 'yyyy-MM-dd')));
    rightAlignedText(25, 39, this.translateService.instant('Date printed: d', todayFormatted));
    const responses = this.responses.length;
    const postResponses = this.responses.length;
    if (this.postSurvey) {
      rightAlignedText(25, 44, this.translateService.instant('Number of responses: n, m',
        [responses.toString(), postResponses.toString()]));
    } else {
      rightAlignedText(25, 44, this.translateService.instant('Number of responses: n',
        responses.toString()));
    }

    // Get our charts (canvases)
    const canvases = this.surveyDOM.nativeElement.querySelectorAll('canvas.surveyQuestionChart');
    // Get a list withe all the tables
    const tables = this.surveyDOM.nativeElement.querySelectorAll('table.chartData');
    // Set up a dummy canvas. This dummy canvas is used to set a white background
    // and to avoid other corruptions to / of the actual real canvases
    const dummyCanvas = document.createElement('canvas') as any;
    const dummyCanvasContext = dummyCanvas.getContext('2d') as any;
    dummyCanvas.width = canvases[0].height * 2;
    dummyCanvas.height = canvases[0].height;
    dummyCanvasContext.fillStyle = '#FFFFFF';

    // Declare variables that are used to handle positioning of our charts
    let pageNr = 1;           // page number (starting at 1)
    let baseOffset = 65;      // The fixed base offset from the top of the page
    const chartHeight = 70;   // The drawn chart's height in the PDF
    const tableOffset = 5;
    const itemWidth = chartHeight * 2; // this has to be a constant ratio
    let counter = 0;
    canvases.forEach((canvas, i) => {
      if (i === 1 || counter === 2) {
        pageNr += 1;
        counter = 0;
        pdf.addPage();
        baseOffset = 18;
      }
      const chartPos = counter === 0 ? baseOffset : (pdf.internal.pageSize.height / 2);
      // Draw our white background on the dummy canvas
      dummyCanvasContext.fillRect(0, 0, dummyCanvas.width, dummyCanvas.height);
      // Draw the chart from the real canvas onto our dummy canvas, centered in the dummy canvas
      dummyCanvasContext.drawImage(canvas, dummyCanvas.width / 2 - canvas.width / 2, 0);
      dummyCanvasContext.drawImage(canvas, dummyCanvas.width / 2 - canvas.width / 2, 0);
      // Add the chart with white background into our PDF at the right position
      pdf.addImage(dummyCanvas.toDataURL('image/jpeg', 0.8), 'JPEG',
        (pdf.internal.pageSize.width - itemWidth) / 2, chartPos, itemWidth, chartHeight);

      pdf.setFontSize(5);
      centeredText(chartPos + chartHeight + 2, this.translateService.instant('Figure: n', i + 1));

      // Modify our table slightly, as to make it pretty for the PDF.
      // This circumvents the fact that the autoTableHtmlToJson does not deal with
      // html cell attribute colspan.
      const tableClone = tables[i].cloneNode(true); // true => copy children.
      const prepostRow = tableClone.querySelector('tr.prepost');
      const prepostRowHeaders = tableClone.querySelectorAll('tr.prepost th');
      if (prepostRowHeaders && prepostRowHeaders.length > 0) {
        const preObject = prepostRowHeaders[0].cloneNode();
        // prepostRowHeaders: empty, PRE, POST
        prepostRow.insertBefore(preObject, prepostRowHeaders[2]);
        prepostRow.appendChild(preObject.cloneNode());
        // should now be: empty, PRE, empty, POST, empty
      }
      // End of circumventing the colspan issue here.

      // Append our clone to the pdf
      const res = pdf.autoTableHtmlToJson(tableClone);
      const tablePos = counter === 0 ? (baseOffset + chartHeight + tableOffset) :
        (pdf.internal.pageSize.height / 2) + chartHeight + tableOffset;
      pdf.autoTable(res.columns, res.data, {
        startY: tablePos,
        margin: {horizontal: (pdf.internal.pageSize.width - itemWidth) / 2},
        styles: {fontSize: 7 },
        tableWidth: itemWidth
      });
      pdf.setFontSize(5);
      centeredText(pdf.autoTable.previous.finalY + 3, this.translateService.instant('Table: n', i + 1));
      // <-- END TABLE
      counter++;
    });

    // Add page count to the bottom of the page
    pdf.setFontSize(8);
    for (let i = 1; i <= pageNr; i++) {
      pdf.setPage(i); // Set the current page to write on first, then add page count to each page
      rightAlignedText(20, pdf.internal.pageSize.height - 18, i + '/' + pageNr);
    }

    pdf.setPage(1);
    const img = new Image();
    img.src = '../../assets/images/vitenlogo.png';
    const self = this;
    const logoSize = 15;
    img.onload = function() {
        const canvas = document.createElement('canvas') as any;
        canvas.width = img.width;
        canvas.height = img.height;
        canvas.getContext('2d').drawImage(img, 0, 0);
        pdf.addImage(canvas.toDataURL('image/png', 1), 'PNG',
          pdf.internal.pageSize.width - logoSize - 23, 12, logoSize, logoSize
        );

        // save our doc with a OS-friendly filename that is related to the survey at hand
        const filename = todayFormatted + '_' + self.survey.name.replace(/ /g, '_').replace(/\?/g, '').replace(/\./g, '') + '.pdf';
        pdf.save(filename);
        // update our component with our new status
        self.generatingPDF = false;
    };
  }


  copySurvey(includeResponses: boolean) {
    this.surveyService.copySurvey(this.survey._id, includeResponses).subscribe(survey => {
      // force redraw by doing 2 redirects
      this.router.navigate([this.route.parent.snapshot.url.join('/')]).then((success) => {
        this.router.navigate([this.route.parent.snapshot.url.join('/'), survey._id]);
      });
    },
    error => {
      // TODO: add informational box to user explaining why it failed.
    });
  }

}



/**
 * DeleteSurveyDialog
 *
 * Holds dialog logic
 */
@Component({
  selector: 'delete-survey-dialog',
  styleUrls: ['./homepage-admin.component.scss'],
  template: `
  <h1 md-dialog-title>{{ 'Are you sure you want to delete this survey?' | translate }}</h1>
  <div md-dialog-content>
    {{ 'The survey will be deleted! This action is permanent!' | translate }}
  </div>
  <div md-dialog-actions align="center">
    <button md-raised-button color="warn"  (click)="dialogRef.close('yes')">{{ 'Delete' | translate }}</button>
    <button md-raised-button md-dialog-close color="primary" class="alignRight">{{ 'Cancel' | translate }}</button>
  </div>
  `
})
export class DeleteSurveyDialog {
  constructor(public dialogRef: MdDialogRef<DeleteSurveyDialog>) { }
}
