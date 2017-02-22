import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-admin-outlet',
  templateUrl: './admin-outlet.component.html',
  styleUrls: ['./admin-outlet.component.scss']
})
export class AdminOutletComponent implements OnInit {
  private breadcrumbs;


  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Update whenever you navigate
    this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
      this.breadcrumbs = this.getBreadcrumbs();

    });

  }


  private getBreadcrumbs(): string[]  {
    let urls = [];

    let fullUrl = this.router.url;
    let urlList = fullUrl.split('/').splice(1); // first element is ''

    let accumulatedUrl: string = '';
    for (let url of urlList) {
      accumulatedUrl = accumulatedUrl + '\/' + url; // escaped forward slash
      urls.push({
        url: accumulatedUrl,
        text: url,
      });
    }
    return urls;
  }

}
