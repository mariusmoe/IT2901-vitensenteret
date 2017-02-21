import { Component } from '@angular/core';

@Component({
  selector: 'app-survey-doughnut-chart',
  templateUrl: './survey-doughnut-chart.component.html',
  styleUrls: ['./survey-doughnut-chart.component.scss']
})

export class SurveyDoughnutChartComponent {

  public doughnutChartLabels:string[] = ['Gutt', 'Jente', 'Intetkjønn']
  public doughnutChartData:number[] = [338,436,100]
  public doughnutChartType:string = 'doughnut';

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }
}
