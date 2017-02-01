import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ActivatedRoute, Params } from '@angular/router';


@Component ({
  moduleId: module.id,
  selector: 'admin',
  templateUrl: '../templates/admin.html',
  styleUrls: []
})

export class AdminComponent {

  constructor(
    private router: Router,
    private route: ActivatedRoute
  ){}
}
