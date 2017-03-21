import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-logo-component',
  templateUrl: './logo-component.component.html',
  styleUrls: ['./logo-component.component.scss']
})
export class LogoComponentComponent implements OnInit {
  @Input() logoVariant = 'icon'; // 'icon' or 'full' or 'text', see ngOnInit for default
  @Input() color: string; // primary or accent
  @Input() useColorContrast: boolean; // use the CONTRAST colour of the selected colour
  @Input() width: string;
  @Input() height: string;

  viewBoxValues = {
    'icon': '10 -5 100 80',
    'full': '0 0 100 100',
    'text': '0 72 100 13',
  };

  constructor() { }

  ngOnInit() {
  }

}
