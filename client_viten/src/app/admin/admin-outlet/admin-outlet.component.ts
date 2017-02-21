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

    for (let child of this.route.snapshot.firstChild.pathFromRoot) {
      // hardcoded the /admin/. the router here is based on the router outlet in THIS component.
      // TODO: fix hardcoding?
      let url = '/admin/' + child.url.map(segment => segment.path).join("/");
      let text = child.url.map(segment => segment.path).join("/");
      urls.push({
        url: url,
        text: text,
      });
    }


    return urls;
  }

}
