import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-doughnut-chart',
  templateUrl: './doughnut-chart.component.html',
  styleUrls: ['./doughnut-chart.component.scss']
})

export class DoughnutChartComponent {
  @Input() answers;

  doughnutChartLabels = ['Gutt', 'Jente'];
  doughnutChartData = [338, 436];
  doughnutChartType = 'doughnut';

  // events
  public chartClicked(e) {
    console.log(e);
  }

  public chartHovered(e) {
    console.log(e);
  }
}
