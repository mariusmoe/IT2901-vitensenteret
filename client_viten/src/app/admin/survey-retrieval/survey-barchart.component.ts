import { Component } from '@angular/core';

@Component({
  selector: 'app-survey-barchart',
  templateUrl: './survey-barchart.component.html',
  styleUrls: ['./survey-barchart.component.scss']
})
export class SurveyBarChartComponent {

  public  barChartOptions:any = {
    scaleShowVerticalLines:false,
    responsive:true
  };

  public barChartLabels:string[] = ['Veldig dårlig','Dårlig','Middels','Bra','Veldig bra']

  public barChartType:string = 'bar';

  public barChartLegend:boolean = true;

  public barChartData:any[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Jente'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Gutt'},
  ];

  // events
  public chartClicked(e:any):void {
    console.log(e);
  }

  public chartHovered(e:any):void {
    console.log(e);
  }

}
