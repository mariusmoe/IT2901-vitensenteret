import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { AuthenticationService } from '../../_services/authentication.service';
import { TranslateService } from '../../_services/translate.service';
import { Title } from '@angular/platform-browser';
import { CenterService } from '../../_services/center.service';


import 'rxjs/add/operator/filter';

@Component({
  selector: 'app-admin-outlet',
  templateUrl: './admin-outlet.component.html',
  styleUrls: ['./admin-outlet.component.scss']
})
export class AdminOutletComponent implements OnInit, OnDestroy {
  public breadcrumbs;
  private routerSub: Subscription;
  public center = 'Science Center';
  // public logoPath = '../assets/images/vitenlogo.png';
  public logoPath: string;



  constructor(private router: Router,
    private route: ActivatedRoute,
    private service: AuthenticationService,
    private centerService: CenterService,
    private translateService: TranslateService,
    private title: Title) {
      title.setTitle(translateService.instant('Center - AdminPortal', 'Center'));
    }

  ngOnInit() {
    // Update whenever you navigate
    this.routerSub = this.router.events.filter(event => event instanceof NavigationEnd).subscribe(event => {
      this.breadcrumbs = this.getBreadcrumbs();
    });
    function checkImage(imageSrc, good, bad) {
        const img = new Image();
        img.onload = good;
        img.onerror = bad;
        img.src = imageSrc;
    }
    this.centerService.getAllCenters().subscribe(result => {
      if (result) {
        const currentCenter = localStorage.getItem('center');
        console.log(currentCenter);
        const center = result.filter(c => { return c['_id'] === currentCenter})[0];
            this.center = center['name'];
            this.title.setTitle(this.translateService.instant('Center - AdminPortal', this.center));
            console.log(this.center)
            if (center.pathToLogo) {
              this.logoPath = '/assets/uploads/' + center.pathToLogo;
            }

      }
    });


  }


  ngOnDestroy() {
    this.routerSub.unsubscribe();
  }

  openUserManual() {
    window.open('/assets/manuals/manual-usermanual-2.pdf', '_blank');
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
