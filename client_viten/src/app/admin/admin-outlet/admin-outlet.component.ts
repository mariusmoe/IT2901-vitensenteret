import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AuthenticationService } from '../../_services/authentication.service';
import { TranslateService } from '../../_services/translate.service';
import { Title } from '@angular/platform-browser';

@Component({
  selector: 'app-admin-outlet',
  templateUrl: './admin-outlet.component.html',
  styleUrls: ['./admin-outlet.component.scss']
})
export class AdminOutletComponent implements OnInit, OnDestroy {
  public breadcrumbs;
  private routerSub: Subscription;

  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: AuthenticationService,
    private translateService: TranslateService,
    private title: Title) {
      title.setTitle(translateService.instant('Vitensenteret - AdminPortal'));
    }

  ngOnInit() {
    // Update whenever you navigate
    this.routerSub = this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
      this.breadcrumbs = this.getBreadcrumbs();

    });
  }

  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }

  /**
   * Logs the user out
   */
  public logout() {
    this.service.logOut();
  }

  /**
   * Gets the page navigation breadcrumbs
   * @return {string[]} The breadcrumbs
   */
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
