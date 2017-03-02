import { Component, OnInit, OnChanges, Input, ViewChild, SimpleChanges } from '@angular/core';
import { QuestionObject } from '../../../_models/survey';


@Component({
  selector: 'app-barchart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent implements OnInit, OnChanges {
  @Input() questionObject: QuestionObject;
  @ViewChild('canvas') canvas;

  barChartOptions: Object = {
    scaleShowVerticalLines: false,
    responsive: true,
    scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true
          }
      }]
    }
  };
  barChartLabels: string[];
  barChartData: Object[];
  barChartColours = [{
    backgroundColor: '#2e68be' // TODO: FIXME
  }];

  // barChartLegend = true; not used, yet.

  constructor() {
  }

  ngOnInit() {

  }
  ngOnChanges(changes: SimpleChanges) {
    this.questionObject = changes['questionObject'].currentValue;
    // console.log("CHANGE!")
    // console.log(this.questionObject);

    // set up the bar chart
    if (!this.questionObject) {
      return;
      // TODO: error.
    }
    switch (this.questionObject.mode) {
      case 'binary':
        this.barChartLabels = ['No', 'Yes']; // TODO: VERIFY THE ORDER OF THESE!!!
        break;
      case 'star':
        this.barChartLabels = ['1 Star', '2 Stars', '3 Stars', '4 Stars', '5 Stars'];
        break;
      case 'multi':
        this.barChartLabels = this.questionObject.lang.no.options;
        break;
      case 'smiley':
        this.barChartLabels = ['Sad', 'Neutral', 'Happy'];
        break;
      case 'txt':
        this.barChartLabels = ['Sad', 'Neutral', 'Happy'];
        break;
      default:
        break;
    }

    // populate data
    this.barChartData = [{ 'data': new Array(this.barChartLabels.length) }];
    for (let i = 0; i < this.barChartLabels.length; i++) {
      this.barChartData[0]['data'][i] = 0;
    }
    for (const answer of this.questionObject.answer) {
      // console.log('adding following answer: ' + answer);
      this.barChartData[0]['data'][answer] += 1;
    }
    console.log(this.barChartData);
  }

  // events
  chartClicked(e) {
    console.log(e);
  }

  chartHovered(e) {
    console.log(e);
  }

  /**
   * Downloads the chart as a png
   * Based on http://stackoverflow.com/a/30393357
   * answered May 22 '15 at 9:40 david.barkhuizen
   */
  downloadAsPng() {
    const image = this.canvas.nativeElement.toDataURL('image/png');

    const MIME_TYPE = 'image/png';
    const dlLink = document.createElement('a');
    dlLink.download = this.questionObject.lang.no.txt.replace(/ /g, '_').replace(/\?/g, '').replace(/\./g, '') + '.png';
    dlLink.href = image;

    document.body.appendChild(dlLink);
    dlLink.click();
    document.body.removeChild(dlLink);
  }

}
