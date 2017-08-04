import { Component, OnInit, OnDestroy, ViewChild, Inject } from '@angular/core';
import { trigger, state, style, transition, animate } from '@angular/animations';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA, MdSnackBar } from '@angular/material';
import { SurveyService } from '../../_services/survey.service';
import { TranslateService } from '../../_services/translate.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { CenterService } from '../../_services/center.service';
import { Survey } from '../../_models/survey';
import { Response } from '../../_models/response';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { DatePipe } from '@angular/common';
import 'rxjs/add/operator/filter';

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
  public  dialogRef2: MdDialogRef<PublishDialog>;
  private center: string;
  private centerObject: Object;
  private centerName: string;


  // constructor
  constructor(private surveyService: SurveyService,
    private router: Router,
    private route: ActivatedRoute,
    private datePipe: DatePipe,
    public dialog: MdDialog,
    public snackBar: MdSnackBar,
    public authenticationService: AuthenticationService,
    public centerService: CenterService,
    private translateService: TranslateService) {
  }

  ngOnInit() {
    // whenever we navigate, we should query for the survey.
    const param = this.route.snapshot.params['surveyId'];
    if (param) { this.getSurvey(param); }
    this.routerSub = this.router.events.filter(event => event instanceof NavigationEnd).subscribe( (event: NavigationEnd) => {
      const newParam = this.route.snapshot.params['surveyId'];
      if (newParam) { this.getSurvey(newParam); }
    });
    if (this.authenticationService.getUser().role === 'sysadmin') {
      this.centerName = 'VitenSurvey';
    } else {
      this.center = localStorage.getItem('center');
      const sub = this.centerService.getCenter(this.center).subscribe((center) => {
        this.centerName = center['name'];
        this.centerObject = center;
        sub.unsubscribe();
      });
    }
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
    const sub = this.surveyService.getSurvey(surveyId).subscribe( (response) => {
      this.responses = <Response[]>response.responses;
      this.survey = <Survey>response.survey;
      sub.unsubscribe();
      if (this.survey.postKey && this.survey.postKey.length > 0) {
        this.loadingPostSurvey = true;
        const sub2 = this.surveyService.getSurvey(this.survey.postKey).subscribe( (postResponse) => {
          this.postResponses = <Response[]>postResponse.responses;
          this.postSurvey = <Survey>postResponse.survey;
          this.loadingPostSurvey = false;
          sub2.unsubscribe();
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

  openPublishWarning(isPublish: boolean) {
    const config: MdDialogConfig = {
      data: {
        isPublish: isPublish,
      }
    };
    this.dialogRef2 = this.dialog.open(PublishDialog, config);
    this.dialogRef2.afterClosed().subscribe(result => {
      if (result === 'yes') {
        this.toggleActive();
      }
      this.dialogRef2 = null;
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
      this.getSurvey(this.survey._id);
      sub1.unsubscribe();
    }, error => {
      // reset if things went bad
      this.survey.active = toggleStateBeforePatch;

      sub1.unsubscribe();
    });
  }


  /**
   * Opens a snackbar with the input message and action
   * @param  {string} message The message to be displayed
   * @param  {string} action  the action message to be displayed
   */
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

      const jsonObject = {
        survey: this.survey,
        responses: this.responses
      };
      if (this.survey.postKey && this.survey.postKey.length > 0) {
        jsonObject['postSurvey'] = this.postSurvey;
        jsonObject['postResponses'] = this.postResponses;
      }

      const blob = new Blob([JSON.stringify(jsonObject, null, '\t')], { type: 'application/json' } );
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
      error => {console.error('error downloading as ' + type); }, // TODO: clean up error logging
    );
  }

  /**
   * Initiates a download of a PDF containing data of the given survey
   */
  downloadAsPDF() {
    // console.log('starting pdf download...');
    const self = this;
    // notify component that we are generating the PDF
    this.generatingPDF = true;
    const pdf = new jsPDF();
    // Get date of today
    const today = Date.now();
    const todayFormatted = this.datePipe.transform(today, 'yyyy-MM-dd');

    let imageLoaded = false;
    let pdfDoneRenderingPages = false;
    let pageNr = 1;           // page number (starting at 1)

    const preparePDF = () => {
      // console.log('saving pdf...')
      // save our doc with a OS-friendly filename that is related to the survey at hand
      const filename = todayFormatted + '_' + self.survey.name.replace(/ /g, '_').replace(/\?/g, '').replace(/\./g, '') + '.pdf';
      pdf.save(filename);
      // update our component with our new status
      self.generatingPDF = false;
    };


    if (this.centerObject && this.centerObject['pathToLogo']) {
      const img = new Image();
      img.src = '../../assets/uploads/' + this.centerObject['pathToLogo'];
      const logoSize = 15;
      img.onload = function() {
        pdf.setPage(1);
        const canvas = document.createElement('canvas') as any;
        canvas.width = img.width;
        canvas.height = img.height;
        const imageWidth = (img.width / img.height) * 15;
        canvas.getContext('2d').drawImage(img, 0, 0);
        // pdf.addImage(canvas.toDataURL('image/png', 1), 'PNG',
        pdf.addImage(canvas.toDataURL('image/png', 1), 'PNG',
          pdf.internal.pageSize.width - imageWidth - 23, 12, imageWidth, logoSize
        );
        // console.log('image done loading');
        pdf.setPage(pageNr);
        if (pdfDoneRenderingPages) { preparePDF(); }
        imageLoaded = true;
      };
    } else {
      imageLoaded = true;
    }

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

    let prePostEqual = true;
    if (this.survey && this.postSurvey) {
      if (this.survey.questionlist.length === this.postSurvey.questionlist.length) {
        prePostEqual = !this.survey.questionlist.some((qo, i, array) => {
          const qo2 = this.postSurvey.questionlist[i];
          return (qo.mode !== qo2.mode);
        });
      } else {
        prePostEqual = false;
      }
    }

    // start writing data to the PDF.
    pdf.setFontSize(30);
    pdf.text(25, 22, this.centerName);
    pdf.setFontSize(18);
    pdf.text(25, 35, this.survey.name);
    pdf.setFontSize(8);
    pdf.text(25, 44, this.survey.comment);
    if (!prePostEqual) {
      pdf.setFontSize(18);
      pdf.text(25, 55, 'PRE');
      pdf.setFontSize(8);
    }

    // Dates and num answers are right-aligned (Logo added at the very bottom)
    rightAlignedText(25, 34, this.translateService.instant('Last modified: d',
      this.datePipe.transform(this.survey.date, 'yyyy-MM-dd')));
    if (this.survey.activationDate) {
      rightAlignedText(25, 39, this.translateService.instant('Published: d',
        this.datePipe.transform(this.survey.activationDate, 'yyyy-MM-dd')));
      if (this.survey.deactivationDate) {
        rightAlignedText(25, 44, this.translateService.instant('Completed: d',
        this.datePipe.transform(this.survey.deactivationDate, 'yyyy-MM-dd')));
      }
    }
    const responses = this.responses.length;
    const postResponses = this.responses.length;
    if (this.postSurvey) {
      rightAlignedText(25, 49, this.translateService.instant('Number of responses: n, m',
        [responses.toString(), postResponses.toString()]));
    } else {
      rightAlignedText(25, 49, this.translateService.instant('Number of responses: n',
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
    let baseOffset = 65;      // The fixed base offset from the top of the page
    const chartHeight = 70;   // The drawn chart's height in the PDF
    const tableOffset = 5;
    const itemWidth = chartHeight * 2; // this has to be a constant ratio
    let counter = 0;
    let postIsSet = false;    // 'Post' should only be written once
    // canvases.forEach((canvas, i) => {

    let allQuestions = this.survey.questionlist;    // All questions holds all questions to be iterated over in pdf
    if (this.postSurvey && !prePostEqual) {
      allQuestions = allQuestions.concat(this.postSurvey.questionlist);
    }
    let canvasIterator = 0;
    allQuestions.forEach((question, i) => {
      let canvas;
      if (question.mode !== 'text') {
        canvas = canvases[canvasIterator];

        if (i === 1 || counter === 2) {
          pageNr += 1;
          counter = 0;
          pdf.addPage();
          baseOffset = 18;
        }
        const chartPos = counter === 0 ? baseOffset : (pdf.internal.pageSize.height / 2);
        if (!prePostEqual && !postIsSet && (i > this.survey.questionlist.length)) {
          pdf.setFontSize(18);
          pdf.text(25, 18, 'POST');
          // console.log('Printed POST on survey!');
          pdf.setFontSize(8);
          postIsSet = true;
        }
        // Draw our white background on the dummy canvas
        dummyCanvasContext.fillRect(0, 0, dummyCanvas.width, dummyCanvas.height);
        // Draw the chart from the real canvas onto our dummy canvas, centered in the dummy canvas
        dummyCanvasContext.drawImage(canvas, dummyCanvas.width / 2 - canvas.width / 2, 0);
        dummyCanvasContext.drawImage(canvas, dummyCanvas.width / 2 - canvas.width / 2, 0);
        // Add the chart with white background into our PDF at the right position
        pdf.addImage(dummyCanvas.toDataURL('image/jpeg', 0.8), 'JPEG',
          (pdf.internal.pageSize.width - itemWidth) / 2, chartPos, itemWidth, chartHeight);

        pdf.setFontSize(5);
        centeredText(chartPos + chartHeight + 2, this.translateService.instant('Figure: n', (i + 1).toString()));

        // Modify our table slightly, as to make it pretty for the PDF.
        // This circumvents the fact that the autoTableHtmlToJson does not deal with
        // html cell attribute colspan.
        const tableClone = tables[canvasIterator].cloneNode(true); // true => copy children.
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
        centeredText(pdf.autoTable.previous.finalY + 3, this.translateService.instant('Table: n', (i + 1).toString()));
        // <-- END TABLE
        counter++;
        canvasIterator++;
      } else {
        // Add text answers
        // 3 on each page

        if (!prePostEqual && !postIsSet && (i > this.survey.questionlist.length)) {
          pdf.setFontSize(18);
          pdf.text(25, 18, 'POST');
          // console.log('Printed POST on survey!');
          pdf.setFontSize(8);
          postIsSet = true;
        }

        pdf.setFontSize(12);
        const activePageWidth = pdf.internal.pageSize.width - 25 * 2;
        // console.log(activePageWidth);
        // console.log('not a canvas');
        if (i !== 0) {
          pageNr++;
          pdf.addPage();
         }
        pdf.setLineWidth(50);
        const addTextAnswers = (_responses: Response[], index) => {
          let _counter = 1;
          let textQuestionHeight = 30;
          if (i === 0) {
            textQuestionHeight = 60;
          }
          const questionText = (question.lang.en
            && this.translateService.getCurrentLang() === 'en') ? question.lang.en.txt : question.lang.no.txt;
          pdf.text(25, textQuestionHeight, index.toString() + '. ' + questionText);
          _responses.forEach((response) => {
            // console.log(response.questionlist, index);
            if (response.questionlist[index]) {
              if (_counter % 3 === 0) {
                pageNr++;
                pdf.addPage();
              }
              pdf.text(25, 44 + ((_counter % 3) * 60), pdf.splitTextToSize(
                this.translateService.instant('Response: ') +
                response.questionlist[index], activePageWidth
              ) );
              _counter++;
            }
          });
          // pageNr++;
          // pdf.addPage();
          counter = 2;

        };
        if (!prePostEqual && (i >= this.survey.questionlist.length)) {
          addTextAnswers(this.postResponses, i - this.survey.questionlist.length);
        } else if (!prePostEqual && (i < this.survey.questionlist.length)) {
          addTextAnswers(this.responses, i);
        } else if (prePostEqual && this.postResponses) {
          addTextAnswers(this.responses.concat(this.postResponses), i);
        } else {
          addTextAnswers(this.responses, i);
        }
      }
    });

    // Add page count to the bottom of the page
    pdf.setFontSize(8);
    for (let i = 1; i <= pageNr; i++) {
      pdf.setPage(i); // Set the current page to write on first, then add page count to each page
      rightAlignedText(20, pdf.internal.pageSize.height - 18, i + '/' + pageNr);
    }


    // if the image loads first, we execute the preparePDF here.
    // Else it happens once the image is done loading
    if (imageLoaded) {
      preparePDF();
    }
    pdfDoneRenderingPages = true;
    // console.log('reached end of PDF...')
  }

  /**
   * Copies a survey
   * @param  {boolean} includeResponses whether to include the responses for the survey
   */
  copySurvey() {
    this.surveyService.copySurvey(this.survey._id).subscribe(survey => {
      // force redraw by going to just /admin/
      this.router.navigate([this.route.parent.snapshot.url.join('/')],
        {skipLocationChange: true});
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



@Component({
  selector: 'publish-dialog',
  template: `
  <h1 md-dialog-title>{{ 'Warning' | translate }}</h1>
  <div md-dialog-content>
    <div *ngIf="data.isPublish == true">
      <p>{{ 'A survey can only be published once. When it is published it cannot be changed.' | translate }}</p>
      <br>
      <p>{{ 'All responses up until this point in time will be deleted.' | translate }}</p>
    </div>
    <div *ngIf="data.isPublish == false">
      <p>{{ 'When a survey is unpublished it will no logner accept responses.' | translate }}</p>
      <br>
      <p>{{ 'To run the survey again, try to copy it.' | translate }}</p>
    </div>
  </div>
  <div md-dialog-actions align="center">
  <button md-raised-button color="warn"  (click)="dialogRef.close('yes')">
  {{(data.isPublish ? 'Publish' : 'Unpublish') | translate }}</button>
  <button md-raised-button md-dialog-close color="primary">{{ 'Cancel' | translate }}</button>
  </div>
  `,
  styleUrls: ['./homepage-admin.component.scss']
})
export class PublishDialog {
  public isCopied = false;
  public text = '';
  constructor(public dialogRef: MdDialogRef<PublishDialog>, @Inject(MD_DIALOG_DATA) public data: any) { }

}
