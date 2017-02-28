import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-admin-outlet',
  templateUrl: './admin-outlet.component.html',
  styleUrls: ['./admin-outlet.component.scss']
})
export class AdminOutletComponent implements OnInit, OnDestroy {
  public breadcrumbs;
  private routerSub: Subscription;

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit() {
    // Update whenever you navigate
    this.routerSub = this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
      this.breadcrumbs = this.getBreadcrumbs();

    });
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }


  public getBreadcrumbs(): string[]  {
    const urls = [];

    const fullUrl = this.router.url;
    const urlList = fullUrl.split('/').splice(1); // first element is ''

    let accumulatedUrl = '';
    for (const url of urlList) {
      accumulatedUrl = accumulatedUrl + '\/' + url; // escaped forward slash
      urls.push({
        url: accumulatedUrl,
        text: url,
      });
    }
    return urls;
  }

}
