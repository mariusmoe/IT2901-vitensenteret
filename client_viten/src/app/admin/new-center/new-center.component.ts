import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';

@Component({
  selector: 'app-new-center',
  templateUrl: './new-center.component.html',
  styleUrls: ['./new-center.component.scss']
})
export class NewCenterComponent implements OnInit {
  public URL = '/api/';

  public uploader: FileUploader = new FileUploader({url: '/api/'});
  public hasBaseDropZoneOver = false;
  public hasAnotherDropZoneOver = false;
  constructor() {
  console.log('Trying to load upload component...'); }

  ngOnInit() {
  }

  public _onChange(files: any) {
    console.log(files);
    console.log(this.uploader.queue);
    if (files && files.length > 0) {
     const file: File = files.item(0);
     // Now you can get
     console.log(file.name);
     console.log(file.size);
     console.log(file.type);
   }
   if (this.uploader.queue.length > 1) {
     this.uploader.queue.shift();
   }
  }

}
