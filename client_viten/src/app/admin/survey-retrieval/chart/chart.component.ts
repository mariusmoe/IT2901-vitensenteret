import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { QuestionObject } from '../../../_models/survey';
import { Response } from '../../../_models/response';
import { TranslateService } from '../../../_services/translate.service';

@Component({
  selector: 'app-chart',
  templateUrl: './chart.component.html',
  styleUrls: ['./chart.component.scss']
})
export class ChartComponent implements OnInit {
  @Input() index: number;
  @Input() questionObject: QuestionObject;
  @Input() responses: Response[];
  @Input() postResponses: Response[];
  @ViewChild('canvas') canvas;

  chartOptions: Object;
  chartData: Object[];
  chartColours: Object[] = [];
  total: number;

  chartType = 'bar';
  chartTypes = ['bar', 'doughnut', 'pie', 'line', 'polarArea' ];
  chartTypesVerbose = ['Bar', 'Doughnut', 'Pie', 'Line', 'PolarArea' ];
  bigCharts = ['doughnut', 'pie', 'polarArea'];
  chartLegends = ['doughnut', 'pie', 'polarArea'];
  chartLabels; // instantiated in constructor

  constructor(public translateService: TranslateService) {
    this.chartLabels = {
      'binary': [translateService.instant('No'), translateService.instant('Yes')],
      'star': [translateService.instant('1 Star'), translateService.instant('2 Stars'),
              translateService.instant('3 Stars'), translateService.instant('4 Stars'),
              translateService.instant('5 Stars')
      ],
      'single': undefined,
      'multi': undefined,
      'smiley': [translateService.instant('Sad'), translateService.instant('Neutral'),
                translateService.instant('Happy') // TODO: VERIFY THE ORDER OF THESE!!!
      ],
    };
  }

  ngOnInit() {
    // set up the chart
    if (!this.questionObject || this.questionObject.mode === 'text') {
      return;
    }
    if (this.questionObject.mode === 'multi' || this.questionObject.mode === 'single') {
      this.chartLabels = this.questionObject.lang.no.options;
    } else {
      this.chartLabels = this.chartLabels[this.questionObject.mode];
    }

    this.chartData = [{ 'data': new Array(this.chartLabels.length) }];
    if (this.postResponses && this.postResponses.length > 0) {
      this.chartData[0]['label'] = this.translateService.instant('Pre');
      this.chartData.push({
        'data': new Array(this.chartLabels.length),
        'label': this.translateService.instant('Post')
      });
    }


    for (let i = 0; i < this.chartLabels.length; i++) {
      this.chartData[0]['data'][i] = 0;
    }
    for (const response of this.responses) {
      if (this.questionObject.mode === 'multi') {
        for (const option of response.questionlist[this.index]) {
          this.chartData[0]['data'][option] += 1;
        }
      } else {
        this.chartData[0]['data'][response.questionlist[this.index]] += 1;
      }
    }
    if (this.postResponses && this.postResponses.length > 0) {
      for (let i = 0; i < this.chartLabels.length; i++) {
        this.chartData[1]['data'][i] = 0;
      }
      for (const response of this.postResponses) {
        if (this.questionObject.mode === 'multi') {
          for (const option of response.questionlist[this.index]) {
            this.chartData[1]['data'][option] += 1;
          }
        } else {
          this.chartData[1]['data'][response.questionlist[this.index]] += 1;
        }
      }
    }
    // Count the total number of responses that; not including "did not answer"
    this.total = this.chartData[0]['data'].reduce((a, b) => a + b, 0);

    // Set colours
    const colourChoices = ['#fa7337', '#6ecdb4', '#c8dc32', '#b44682', '#7378cd', '#5a96d7', '#a0968c', '#c8c8c8'];
    // initialize our variable holder. We need each of the properties we want to adjust in here
    this.chartColours = [ // two lists. pre and post.
      { backgroundColor: [], pointBackgroundColor: [], borderColor: [], pointBorderColor: [] },
      { backgroundColor: [], pointBackgroundColor: [], borderColor: [], pointBorderColor: [] }
    ];
    for (const colour of colourChoices) {
      // follows the static order above. Expansion opportunity; Filter out the theme colours and adjust order accordingly
      this.chartColours[0]['backgroundColor'].push(this.hexConverter(colour, 0.65));
      this.chartColours[0]['pointBackgroundColor'].push(this.hexConverter(colour, 0.65));
      this.chartColours[0]['borderColor'].push(this.hexConverter(colour, 1));
      this.chartColours[0]['pointBorderColor'].push(this.hexConverter(colour, 1));

      const colourShaded = this.shadeColor(colour, -0.25);
      this.chartColours[1]['backgroundColor'].push(this.hexConverter(colourShaded, 0.75));
      this.chartColours[1]['pointBackgroundColor'].push(this.hexConverter(colourShaded, 0.75));
      this.chartColours[1]['borderColor'].push(this.hexConverter(colourShaded, 1));
      this.chartColours[1]['pointBorderColor'].push(this.hexConverter(colourShaded, 1));
    }
    // Angular 2 charts properties:
    // backgroundColor, borderColor, pointBackgroundColor,
    // pointBorderColor, pointHoverBackgroundColor, pointHoverBorderColor
    this.setChartOptions();
  }


  /**
   * Converts colours from hex to RGBA
   * @param  {string} hex     the colour code, in hex
   * @param  {number} opacity the opacity to use
   * @return {string}         the converted colour in rgba format
   */
  private hexConverter(hex: string, opacity: number): string {
    hex = hex.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return 'rgba(' + r + ',' + g + ',' + b + ',' + opacity + ')';
  }

  /**
   * Darkens or brightens the colour by the percentage given
   * Based on: http://stackoverflow.com/a/13542669
   * @param  {string} hex     the colour code, in hex
   * @param  {number} percent percent to darken or brighten, ranging from -1 (dark) to +1 (light)
   * @return {string}         the darkened or brightened colour
   */
  private shadeColor(hex: string, percent: number): string {
    const val = parseInt(hex.replace('#', ''), 16);
    const r = val >> 16;
    const g = val >> 8 & 0x00FF;
    const b = val & 0x0000FF;

    const end = percent > 0 ? 255 : 0;
    const absPercent = Math.abs(percent);

    const newR = (Math.round((end - r) * absPercent) + r) * 0x10000;
    const newG = (Math.round((end - g) * absPercent) + g) * 0x100;
    const newB = Math.round((end - b) * absPercent) + b;

    return '#' + (0x1000000 + (newR + newG + newB)).toString(16).slice(1);
  }


  private drawValue(context) {
    const chartInstance = this.canvas.nativeElement;
    const ctx = chartInstance.ctx;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'bottom';
    this.chartData.forEach(function (dataset: any, i) {
        const meta = chartInstance.controller.getDatasetMeta(i);
        meta.data.forEach(function (bar, index) {
            const data = dataset.data[index];
            ctx.fillText(data, bar._model.x, bar._model.y - 5);
        });
    });
  }


  /**
   * Sets the chart options based on chartType
   */
  setChartOptions() {
    // Set options

    // Use English text if English language is selected and an English question text exists.
    // Otherwise use Norwegian
    let titleText = this.questionObject.lang.no.txt;
    if (this.translateService.getCurrentLang() === 'en' && this.questionObject.lang.en && this.questionObject.lang.en.txt) {
      titleText = this.questionObject.lang.en.txt;
    }


    const self = this;
    const animFunction = function(input) {
      let anim = 1;
      let height = 0;
      // console.log(input);
      if (input) {
        height = input.chartInstance.chart.height;
        anim = input.animationObject.currentStep / input.animationObject.numSteps;
      }

      // this context is that of the normal js this here!
      const chartInstance = this.chart;
      const ctx = chartInstance.ctx;
      ctx.fillStyle = '#444';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'bottom';
      this.data.datasets.forEach(function (dataset, i) {
          const meta = chartInstance.controller.getDatasetMeta(i);
          if (self.bigCharts.indexOf(meta.type) >= 0) {
            // All of these are circular.
            meta.data.forEach(function (obj, index) {
              if (obj.hidden) { return; }

              const data = dataset.data[index];
              const angle = obj._model.startAngle + (obj._model.endAngle - obj._model.startAngle) / 2;
              const offset = obj._model.innerRadius + (obj._model.outerRadius - obj._model.innerRadius) / 2;
              ctx.fillText(data, obj._model.x + Math.cos(angle) * offset, obj._model.y + Math.sin(angle) * offset);
              ctx.fillText(dataset.label, obj._model.x + Math.cos(angle) * offset, obj._model.y + Math.sin(angle) * offset + 15);
            });
          } else {
            const offset = meta.type === 'bar' ? 22 : -10;
            meta.data.forEach(function (obj, index) {
              if (obj.hidden) { return; }

              const data = dataset.data[index];
              ctx.fillText(data, obj._model.x, obj._model.y + offset);
              ctx.fillText(dataset.label, obj._model.x, obj._model.y + offset + 15);
            });
          }
      });
    };


    // SetOptions, setting title text and legend if Legend is needed
    this.chartOptions = {
      responsive: true,
      title: {
          display: true,
          text: titleText,
      },
      tooltips: {
        // enabled: false,
      },
      legend: {
        position: 'bottom',
        // if the legend is set for this type of chart, then display it.
        display: (this.chartLegends.indexOf(this.chartType) >= 0),
      },
      animation: {
        onComplete: animFunction,
        onProgress: animFunction
      }
    };
    if (this.chartType === 'bar') {
      this.chartOptions['scales'] = {
        yAxes: [{ ticks: { beginAtZero: true } }]
      };
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
    const dlLink = document.createElement('a') as any; // as any disables tslinting.

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


  /**
   * Rounds a value to the given number of decimals
   * @param  {number} value    the float value to fix to a given decimal point
   * @param  {number} decimals the number of decimals to show, as an int.
   * @return string            a string representation of the value, with fixed decimal points
   */
  round(value: number, decimals: number): string {
    if (typeof value !== 'number') {
      return '0.00';
    }
    return value.toFixed(2);
  }
}
