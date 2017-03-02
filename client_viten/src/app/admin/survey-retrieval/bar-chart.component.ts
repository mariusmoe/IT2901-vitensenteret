import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-barchart',
  templateUrl: './bar-chart.component.html',
  styleUrls: ['./bar-chart.component.scss']
})
export class BarChartComponent {
  @Input() answers;

  public  barChartOptions: Object = {
    scaleShowVerticalLines: false,
    responsive: true
  };

  barChartLabels: string[] = [ 'Veldig dårlig', 'Dårlig', 'Middels', 'Bra', 'Veldig bra' ];

  barChartType = 'bar';

  barChartLegend = true;

  barChartData: Object[] = [
    {data: [65, 59, 80, 81, 56, 55, 40], label: 'Jente'},
    {data: [28, 48, 40, 19, 86, 27, 90], label: 'Gutt'},
  ];

  // events
  chartClicked(e) {
    console.log(e);
  }

  chartHovered(e) {
    console.log(e);
  }

}
