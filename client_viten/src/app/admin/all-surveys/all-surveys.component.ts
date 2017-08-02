import { Component, OnInit, OnDestroy, Inject, ViewChild, ElementRef } from '@angular/core';
import { SurveyList } from '../../_models/index';
import { Folder } from '../../_models/folder';
import { User } from '../../_models/user';
import { SurveyService } from '../../_services/survey.service';
import { UserFolderService } from '../../_services/userFolder.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { TranslateService } from '../../_services/translate.service';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Router, ActivatedRoute, Params, NavigationEnd } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { MdDialog, MdDialogRef, MdDialogConfig, MD_DIALOG_DATA } from '@angular/material';
import 'rxjs/add/operator/debounceTime';
// import { autoScroll } from 'dom-autoscroller';
import * as autoScroll from 'dom-autoscroller';

@Component({
  selector: 'app-all-surveys',
  templateUrl: './all-surveys.component.html',
  styleUrls: [
    './all-surveys.component.scss'
  ]
})
export class AllSurveysComponent implements OnInit, OnDestroy {
    loading = false;
    // searchInput = '';
    // searchFormControl = new FormControl();
    // searchLoading = false;
    // searchResultNum = 20;

    searchSubscription: Subscription;
    dragulaSubs: Subscription[] = [];


    tree: Folder[];
    root: Folder;
    @ViewChild('autoscroll') autoscroll: ElementRef;

    user: User;

    selectedSurvey: string;
    routerSub: Subscription;



    constructor(
      private router: Router,
      private dialog: MdDialog,
      public route: ActivatedRoute,
      public surveyService: SurveyService,
      public userFolderService: UserFolderService,
      private authenticationService: AuthenticationService,
      private dragulaService: DragulaService) {
        this.user = authenticationService.getUser();

        const dragulaFolderBagSettings = {
          revertOnSpill: true,
          direction: 'vertical',
          accepts: (el: Element, target: Element, source: Element, sibling: Element): boolean => {
            // elements can not be dropped within themselves or into their own children.
            // They also should not be allowed to drop into the same folder they came from
            //
           return !el.contains(target) && !(target === source);
          },
        };
        const dragulaSurveyBagSettings = {
          revertOnSpill: true,
          direction: 'vertical',
          accepts: (el: Element, target: Element, source: Element, sibling: Element): boolean => {
            // elements can not be dropped within themselves or into their own children.
           return !el.contains(target);
          },
        };
        this.dragulaService.setOptions('folderBag', dragulaFolderBagSettings);
        // this.dragulaService.setOptions('surveyBag', dragulaSurveyBagSettings);
        this.dragulaSubs.push(dragulaService.drop.subscribe((value) => { this.onDragulaDrop(value); }));
        this.dragulaSubs.push(dragulaService.drag.subscribe((value) => { this.onDragulaDrag(value); }));
        this.dragulaSubs.push(dragulaService.dragend.subscribe((value) => { this.onDragulaDragEnd(value); }));

        this.refreshFolders();
    }

    ngOnInit() {
      // this.searchSubscription = this.searchFormControl.valueChanges.debounceTime(500).subscribe(searchQuery => {
      //   this.searchInput = searchQuery;
      // });

      // whenever we navigate, we should update the survey ID to match for our selected survey
      this.selectedSurvey = this.route.snapshot.params['surveyId'];
      this.routerSub = this.router.events.filter(event => event instanceof NavigationEnd).subscribe( (event: NavigationEnd) => {
        const newParam = this.route.snapshot.params['surveyId'];
        if (newParam) { this.selectedSurvey = newParam; }
      });


      const scroll = autoScroll([
        this.autoscroll.nativeElement
      ], {
        margin: 20,
        maxSpeed: 10,
        scrollWhenOutside: true,
        autoScroll: function(){
          return this.down; // when mouse pressed
        }
      });
    }

    ngOnDestroy() {
      // this.searchSubscription.unsubscribe();
      this.dragulaService.destroy('folderBag');
      // this.dragulaService.destroy('surveyBag');
      for (const sub of this.dragulaSubs) {
        sub.unsubscribe();
      }
    }


    onDragulaDrag(value: any) {
      document.getElementById('folderTree').classList.add('over');
    }
    onDragulaDragEnd(value: any) {
      document.getElementById('folderTree').classList.remove('over');
    }



    onDragulaDrop(value: any) {
      const bag = value[0];
      const el: Element = value[1];
      const targetFolderEl: Element = value[2];
      const sourceFolderEl: Element = value[3];
      const sibling: Element = value[4];

      // target folder is the 'ul' element. We need the parent li element which holds said ul element.
      if (targetFolderEl.parentElement && targetFolderEl.parentElement.id &&
        sourceFolderEl.parentElement && sourceFolderEl.parentElement.id &&
        targetFolderEl.parentElement.id !== sourceFolderEl.parentElement.id) {

        const targetFolder = this.tree.filter(f => f._id === targetFolderEl.parentElement.id)[0];
        const sourceFolder = this.tree.filter(f => f._id === sourceFolderEl.parentElement.id)[0];

        const movedObjectWasASurvey = el.classList.contains('survey');
        const data = {
          targetFolderId: targetFolder._id,
          sourceFolderId: sourceFolder._id,
          isSurvey: movedObjectWasASurvey,
          itemId: null,
          isMultiFolder: true, // REQUIRED!!
        };

        if (movedObjectWasASurvey) {
          const survey = sourceFolder.surveys.filter(s => s._id === el.id)[0];
          data.itemId = survey._id;
        } else {
          // we assume its folders (duh) being moved here
          const folder = sourceFolder.folders.filter(f => f._id === el.id)[0];
          data.itemId = folder._id;
        }
        this.loading = true;
        const updateSub = this.userFolderService.updateFolders(data).subscribe(
          updateSuccess => {
            updateSub.unsubscribe();
            this.refreshFolders(); // loading set to false again in this one.
          },
          error => {
            this.loading = false;
            updateSub.unsubscribe();
          }
        );
      }
    }


    refreshFolders() {
      this.loading = true;
      const requestNewTreeSub = this.userFolderService.getAllFolders().subscribe(newTree => {
        this.tree = newTree;
        this.root = newTree.filter(x => x.isRoot === true)[0];
        this.root.open = true;

        requestNewTreeSub.unsubscribe();
        this.loading = false;
      },
      error2 => {
        requestNewTreeSub.unsubscribe();
        this.loading = false;
      });
    }

    toggleFolderOpenState(e: Event, folder: Folder) {
      e.stopPropagation();
      e.preventDefault();

      folder.open = !folder.open;

      if (folder.isRoot) {
        return;
      }

      const updatedFolder: Folder = {
        _id: folder._id,
        title: folder.title,
        user: folder.user,
        open: folder.open,
      };

      const updateSub = this.userFolderService.patchFolder(updatedFolder).subscribe(
        updateSuccess => {
          updateSub.unsubscribe();
        },
        error => {
          updateSub.unsubscribe();
        }
      );
    }

    createNewFolder(folder: Folder) {
      const newFolder: Folder = {
      };

      const sub = this.userFolderService.createFolder(newFolder, folder).subscribe(
        result => {
          sub.unsubscribe();
          this.refreshFolders();
        },
        error => {
          console.log('Error creating folder');
          sub.unsubscribe();
          this.refreshFolders();
        });
    }


    openRenameFolderDialog(folder: Folder) {
      const config: MdDialogConfig = {
        data: {
          folder: folder,
          isRename: true,
          callbackSuccess: () => { this.refreshFolders(); },
          callbackError: () => { this.refreshFolders(); },
        }
      };
      this.dialog.open(FolderOptionsDialog, config);
    }

    openDeleteFolderDialog(folder: Folder) {
      const config: MdDialogConfig = {
        data: {
          folder: folder,
          isRename: false,
          callbackSuccess: () => { this.refreshFolders(); },
          callbackError: () => { this.refreshFolders(); },
        }
      };
      this.dialog.open(FolderOptionsDialog, config);
    }
}




@Component({
  selector: 'folder-options-dialog',
  styleUrls: ['./all-surveys.component.scss'],
  template: `
  <h1 md-dialog-title class="alignCenter">{{ 'Folder Options' | translate }}</h1>
  <div md-dialog-content align="center">


    <!-- DELETE FOLDER CONTENTS -->
    <div *ngIf="!data.isRename">
      <p>{{ 'Warning! This will delete the folder along with ALL surveys inside!' | translate}}</p>
      <button md-raised-button (click)="deleteFolder()" color="warn">
        {{ 'Delete' | translate }}
      </button>
    </div>
    <!-- DELETE FOLDER CONTENTS END -->




    <!-- RENAME FOLDER CONTENTS -->
    <form [formGroup]="renameForm" (ngSubmit)="submitForm()" *ngIf="data && data.isRename">
      <md-input-container md-block>
        <input mdInput class="form-control" type="text" autocomplete="off"
        placeholder="{{'New name' | translate }}" [formControl]="renameForm.controls['rename']" required>
        <md-hint ngClass="{'warning': true}" *ngIf="renameForm.controls['rename'].hasError('required') &&
          renameForm.controls['rename'].touched">
          {{ 'This field is required.' | translate }}
        </md-hint>
        <md-hint ngClass="{'warning': true}" *ngIf="!renameForm.controls['rename'].hasError('required') &&
            renameForm.controls['rename'].invalid && renameForm.controls['rename'].touched">
          {{ 'This field is invalid.' | translate }}
        </md-hint>
      </md-input-container>

      <button md-raised-button #submitRenameForm type="submit" class="btn btn-success" [disabled]="!renameForm.valid"
        color="primary">
        {{ 'Submit' | translate }}
      </button>
    </form>
    <!-- RENAME FOLDER CONTENTS END-->


  </div>
  <div md-dialog-actions align="center">
    <button md-raised-button color="primary" (click)="close()">{{ 'Close' | translate }}</button>
  </div>
  `
})
export class FolderOptionsDialog {
  renameForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private userFolderService: UserFolderService,
    public dialogRef: MdDialogRef<FolderOptionsDialog>,
    @Inject(MD_DIALOG_DATA) public data: any,
    ) {
      this.renameForm = fb.group({
      'rename': [null, Validators.pattern('.*\\S.*')],
    });
  }


  submitForm() {
    if (this.data.isRename) {
      this.renameFolder();
    } else {
      this.deleteFolder();
    }
  }


  deleteFolder() {
    const sub = this.userFolderService.deleteFolder(this.data.folder._id).subscribe(
      result => {
        // console.log(result);
        sub.unsubscribe();
        this.data.callbackSuccess(result);
        this.close();
      },
      error => {
        console.log(error.json().message);
        sub.unsubscribe();
        this.data.callbackError(error);
        this.close();
      });
  }


  renameFolder() {
    this.data.folder.title = this.renameForm.value;
    const updatedFolder: Folder = {
      _id: this.data.folder._id,
      title: this.renameForm.value.rename,
      user: this.data.folder.user,
      open: this.data.folder.open,
    };
    const sub = this.userFolderService.patchFolder(updatedFolder).subscribe(
      result => {
        // console.log(result);
        sub.unsubscribe();
        this.data.callbackSuccess(result);
        this.close();
      },
      error => {
        console.log(error.json().message);
        sub.unsubscribe();
        this.data.callbackError(error);
        this.close();
      });
  }

  /**
   * close()
   *
   * Hides the dialog window.
   */
  close() {
    this.dialogRef.close();
  }
}
