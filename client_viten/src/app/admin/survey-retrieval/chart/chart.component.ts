import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { QuestionObject } from '../../../_models/survey';
import { Response } from '../../../_models/response';
import { TranslateService } from '../../../_services/translate.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class BarChartComponent implements OnInit {
  @Input() index: number;
  @Input() questionObject: QuestionObject;
  @Input() responses: Response[];
  @ViewChild('canvas') canvas;

  barChartOptions: Object;
  barChartLabels: string[];
  barChartData: Object[];
  barChartColours: Object[] = [];
  total: number;

  chartType = 'bar';
  chartTypes = ['bar', 'doughnut', 'pie', 'line', 'polarArea' ];
  chartTypesVerbose = ['Bar', 'Doughnut', 'Pie', 'Line', 'PolarArea' ];
  bigCharts = ['doughnut', 'pie', 'polarArea'];
  chartLegends = ['doughnut', 'pie', 'polarArea'];
  chartLabels; // instantiated in constructor

  constructor(public languageService: TranslateService) {
    this.chartLabels = {
                // TODO: VERIFY THE ORDER OF THESE!!!
      'binary': [languageService.instant('No'), languageService.instant('Yes')],
      'star': [languageService.instant('1 Star'), languageService.instant('2 Stars'),
              languageService.instant('3 Stars'), languageService.instant('4 Stars'),
              languageService.instant('5 Stars')
      ],
      'single': undefined,
      'multi': undefined,
      'smiley': [languageService.instant('Sad'), languageService.instant('Neutral'),
                languageService.instant('Happy') // TODO: VERIFY THE ORDER OF THESE!!!
      ],
    };
  }

  ngOnInit() {
    // set up the bar chart
    if (!this.questionObject || this.questionObject.mode === 'text') {
      return;
    }
    if (this.questionObject.mode === 'multi' || this.questionObject.mode === 'single') {
      this.barChartLabels = this.questionObject.lang.no.options;
    } else {
      this.barChartLabels = this.chartLabels[this.questionObject.mode];
    }

    this.barChartData = [{ 'data': new Array(this.barChartLabels.length) }];
    for (let i = 0; i < this.barChartLabels.length; i++) {
      this.barChartData[0]['data'][i] = 0;
    }
    for (const response of this.responses) {
      if (this.questionObject.mode === 'multi') {
        for (const option of response.questionlist[this.index]) {
          this.barChartData[0]['data'][option] += 1;
        }
      } else {
        this.barChartData[0]['data'][response.questionlist[this.index]] += 1;
      }
    }
    // Count the total number of responses that; not including "did not answer"
    this.total = this.barChartData[0]['data'].reduce((a, b) => a + b, 0);

    // Set colours
    const colourChoices = ['#fa7337', '#6ecdb4', '#c8dc32', '#b44682', '#7378cd', '#5a96d7', '#a0968c', '#c8c8c8'];
    // initialize our variable holder. We need each of the properties we want to adjust in here
    this.barChartColours = [{backgroundColor: [], pointBackgroundColor: [], borderColor: [], pointBorderColor: [] }];
    for (const colour of colourChoices) {
      // follows the static order above. Expansion opportunity; Filter out the theme colours and adjust order accordingly
      this.barChartColours[0]['backgroundColor'].push(this.hexConverter(colour, 0.65));
      this.barChartColours[0]['pointBackgroundColor'].push(this.hexConverter(colour, 0.65));
      this.barChartColours[0]['borderColor'].push(this.hexConverter(colour, 1));
      this.barChartColours[0]['pointBorderColor'].push(this.hexConverter(colour, 1));
    }
    // Angular 2 charts properties:
    // backgroundColor, borderColor, pointBackgroundColor,
    // pointBorderColor, pointHoverBackgroundColor, pointHoverBorderColor
    this.setChartOptions();
  }

  private hexConverter(hex: string, opacity: number) {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
  }

  /**
   * Sets the chart options based on chartType
   */
  setChartOptions() {
    // Set options

    // Use English text if English language is selected and an English question text exists.
    // Otherwise use Norwegian
    let titleText = this.questionObject.lang.no.txt;
    if (this.languageService.getCurrentLang() === 'en' && this.questionObject.lang.en && this.questionObject.lang.en.txt) {
      titleText = this.questionObject.lang.en.txt;
    }

    // SetOptions, setting title text and legend if Legend is needed
    this.barChartOptions = {
      responsive: true,
      title: {
          display: true,
          text: titleText,
      },
      legend: {
        position: 'bottom',
        // if the legend is set for this type of chart, then display it.
        display: (this.chartLegends.indexOf(this.chartType) >= 0),
      }
    };
    if (this.chartType === 'bar') {
      this.barChartOptions['scales'] = {
        yAxes: [{ ticks: { beginAtZero: true } }]
      };
      // for (const colour of this.colours) {
      //   this.barChartColours.push({
      //     backgroundColor: colour
      //   });
      // }
    }
  }

  /**
   * Downloads the chart as a png
   * Based on http://stackoverflow.com/a/30393357
   * answered May 22 '15 at 9:40 david.barkhuizen
   */
  downloadAsPng() {
    // Get the canvas as image
    const image = this.canvas.nativeElement.toDataURL('image/png');
    // Create a link element to insert into DOM. This link element allows us to
    // control how the browser interprets the download. We want the browser to
    // interpret our image as a .png, and we want to control the file name.
    // As such we replace all non-filepath-friendly characters from the question
    // and add the .png extension.
    const dlLink = document.createElement('a');
    dlLink.download = this.questionObject.lang.no.txt.replace(/ /g, '_').replace(/\?/g, '').replace(/\./g, '') + '.png';
    // the href is still just the image, though! That is what we want the user to download! The browser INTERPRETS
    // our image as a png, but the binary data is still the same. If we do not let the browser interpret it as anything,
    // it downloads as a 'file', and has no filename other than what the browser assigns to it. i.e. download.file
    dlLink.href = image;
    // Then we do some DOM trickery to click this link to begin the download
    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);
  }

}
