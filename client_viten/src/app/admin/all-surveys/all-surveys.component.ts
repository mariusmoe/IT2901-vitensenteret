import { Component, OnInit, OnDestroy } from '@angular/core';
import { SurveyList } from '../../_models/index';
import { Folder } from '../../_models/folder';
import { SurveyService } from '../../_services/survey.service';
import { UserFolderService } from '../../_services/userFolder.service';
import { DragulaService } from 'ng2-dragula/ng2-dragula';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import {FormControl} from '@angular/forms';
import 'rxjs/add/operator/debounceTime';


@Component({
  selector: 'app-all-surveys',
  templateUrl: './all-surveys.component.html',
  styleUrls: [
    './all-surveys.component.scss'
  ]
})
export class AllSurveysComponent implements OnInit, OnDestroy {
    loading = false;
    searchInput = '';
    searchFormControl = new FormControl();
    searchLoading = false;
    searchResultNum = 20;
    loadMoreValue = 20;

    searchSubscription: Subscription;
    dragulaSubs: Subscription[] = [];


    tree: Folder[];
    root: Folder;


    constructor(
      private router: Router,
      public route: ActivatedRoute,
      public surveyService: SurveyService,
      public userFolderService: UserFolderService,
      private dragulaService: DragulaService) {
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

        this.refreshFolders();
    }

    ngOnInit() {
      this.searchSubscription = this.searchFormControl.valueChanges.debounceTime(500).subscribe(searchQuery => {
        this.searchInput = searchQuery;
      });
    }
    ngOnDestroy() {
      this.searchSubscription.unsubscribe();
      this.dragulaService.destroy('folderBag');
      // this.dragulaService.destroy('surveyBag');
      for (const sub of this.dragulaSubs) {
        sub.unsubscribe();
      }
    }


    onDragulaDrop(value: any) {
      const bag = value[0];
      const el: Element = value[1];
      const targetFolderEl: Element = value[2];
      const sourceFolderEl: Element = value[3];
      const sibling: Element = value[4];

      // target folder is the 'ul' element. We need the parent li element which holds said ul element.
      console.log('step0');
      if (targetFolderEl.parentElement && targetFolderEl.parentElement.id) {
        console.log('step1');
        if (sourceFolderEl.parentElement && sourceFolderEl.parentElement.id) {
          console.log('step2');
          if (targetFolderEl.parentElement.id !== sourceFolderEl.parentElement.id) {
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
              console.log('step4 survey');
              const survey = sourceFolder.surveys.filter(s => s._id === el.id)[0];
              data.itemId = survey._id;
            } else {
              console.log('step4 folder');
              // we assume its folders (duh) being moved here
              const folder = sourceFolder.folders.filter(f => f._id === el.id)[0];
              console.log(sourceFolder.folders);
              console.log(folder);
              data.itemId = folder._id;
            }
            console.log(data);
            this.loading = true;
            const updateSub = this.userFolderService.updateFolders(data).subscribe(
              updateSuccess => {
                console.log('step5');
                updateSub.unsubscribe();
                this.refreshFolders(); // loading set to false again in this one.
              },
              error => {
                this.loading = false;
                updateSub.unsubscribe();
                console.log('hurr durr 2');
              }
            );
          }
        }
      }
    }


    toggleFolderOpenState(e: Event, folder: Folder) {
      e.stopPropagation();
      e.preventDefault();

      folder.open = !folder.open;
    }

    createNewFolder(parentFolder: Folder) {
      const testFolder: Folder = {
        // title: 'ff',
      };

      const sub = this.userFolderService.createFolder(testFolder, parentFolder).subscribe(result => {
        sub.unsubscribe();
        this.refreshFolders();
      });
    }

    refreshFolders() {
      this.loading = true;
      const requestNewTreeSub = this.userFolderService.getAllFolders().subscribe(newTree => {
        this.tree = newTree;
        this.root = newTree.filter(x => x.isRoot === true)[0];
        this.root.open = true;
        requestNewTreeSub.unsubscribe();
        this.loading = false;
        console.log(this.root);
      },
      error2 => {
        requestNewTreeSub.unsubscribe();
        this.loading = false;
      });
    }
}
