import { Component, ViewEncapsulation } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
    './app.component.scss',
    '../../node_modules/dragula/dist/dragula.min.css'
  ],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent {
}
