import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-new-center',
  templateUrl: './new-center.component.html',
  styleUrls: ['./new-center.component.scss']
})
export class NewCenterComponent implements OnInit {
  public URL = '/api/';

  public uploader:FileUploader = new FileUploader({url: '/api/'});
  public hasBaseDropZoneOver:boolean = false;
  public hasAnotherDropZoneOver:boolean = false;
  constructor() { }

  ngOnInit() {
  }
  public fileOverBase(e:any):void {
    this.hasBaseDropZoneOver = e;
  }

  public fileOverAnother(e:any):void {
    this.hasAnotherDropZoneOver = e;
  }

}
