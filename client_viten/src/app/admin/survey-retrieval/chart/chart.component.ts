import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { QuestionObject } from '../../../_models/survey';
import { TranslateService } from '../../../_services/translate.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class BarChartComponent implements OnInit {
  @Input() questionObject: QuestionObject;
  @ViewChild('canvas') canvas;

  barChartOptions: Object;
  barChartLabels: string[];
  barChartData: Object[];
  barChartColours: Object[] = [];

  chartType = 'bar';
  chartTypes = ['bar', 'doughnut', 'pie', 'line', 'polarArea' ];
  chartTypesVerbose = ['Bar', 'Doughnut', 'Pie', 'Line', 'PolarArea' ];
  bigCharts = ['doughnut', 'pie', 'polarArea'];
  chartLegends = ['doughnut', 'pie', 'polarArea'];
  chartLabels; // instantiated in constructor
  colours; // instantiated in ngOnInit

  constructor(public languageService: TranslateService) {
    this.chartLabels = {
                // TODO: VERIFY THE ORDER OF THESE!!!
      'binary': [languageService.instant('No'), languageService.instant('Yes')],
      'star': [languageService.instant('1 Star'), languageService.instant('2 Stars'),
              languageService.instant('3 Stars'), languageService.instant('4 Stars'),
              languageService.instant('5 Stars')
      ],
      'multi': undefined,
      'smiley': [languageService.instant('Sad'), languageService.instant('Neutral'),
                languageService.instant('Happy') // TODO: VERIFY THE ORDER OF THESE!!!
      ],
    };
  }

  ngOnInit() {
    // this.questionObject = changes['questionObject'].currentValue;
    // console.log("CHANGE!")
    // console.log(this.questionObject);

    // set up the bar chart
    if (!this.questionObject) {
      return;
      // TODO: error.
    }
    if (this.questionObject.mode === 'text') {
      return;
    }

    if (this.questionObject.mode === 'multi') {
      this.barChartLabels = this.questionObject.lang.no.options;
    } else {
      this.barChartLabels = this.chartLabels[this.questionObject.mode];
    }

    this.barChartData = [{ 'data': new Array(this.barChartLabels.length) }];
    for (let i = 0; i < this.barChartLabels.length; i++) {
      this.barChartData[0]['data'][i] = 0;
    }
    for (const answer of this.questionObject.answer) {
      // console.log('adding following answer: ' + answer);
      this.barChartData[0]['data'][answer] += 1;
      this.barChartData[0]['fillColor'] = 'red';
    }

    // Set colours (TODO: FIXME)
    this.colours = [
      getComputedStyle(this.canvas.nativeElement.parentNode, null).color,
      getComputedStyle(this.canvas.nativeElement.parentNode, null).borderColor
    ];
    this.setChartOptions();
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
    // TODO: Colours are difficult to do.
    this.barChartColours = [];
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
