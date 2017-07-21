import { Component, OnInit, OnDestroy } from '@angular/core';
import { SurveyList } from '../../_models/index';
import { Folder } from '../../_models/folder';
import { SurveyService } from '../../_services/survey.service';
import { UserFolderService } from '../../_services/userFolder.service';
import { Router, ActivatedRoute, Params } from '@angular/router';
import { Observable } from 'rxjs/Observable';
import { Subscription } from 'rxjs/Subscription';
import {FormControl} from '@angular/forms';
import { NodeEvent, TreeModel, RenamableNode, Ng2TreeSettings } from 'ng2-tree';
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


    tree: Folder[];
    root: Folder;

    // treeSettings: Ng2TreeSettings = {
    //   rootIsVisible: false,
    // };
    //
    // private treeNodeSettings = {
    //   'rightMenu': true,
    //   // 'leftMenu': true,
    //   'templates': {
    //     'node': '<i class="material-icons">folder</i>',
    //     'leaf': '<i class="material-icons">insert_chart</i>',
    //     'leftMenu': '<i class="fa fa-navicon fa-lg"></i>'
    //   }
    // };


    constructor(
      private router: Router,
      public route: ActivatedRoute,
      public surveyService: SurveyService,
      public userFolderService: UserFolderService) {
        // request fresh list of surveys
        this.getSurveys();
      }

    ngOnInit() {
      this.searchSubscription = this.searchFormControl.valueChanges.debounceTime(500).subscribe(searchQuery => {
        this.searchInput = searchQuery;
      });
      const folderSub = this.userFolderService.getAllFolders().subscribe(result => {
        this.tree = result;
        this.root = this.tree.filter(x => x.isRoot = true)[0];
        folderSub.unsubscribe();
      },
      error => {
        folderSub.unsubscribe();
        console.error(error);
      });
    }
    ngOnDestroy() {
      this.searchSubscription.unsubscribe();
    }


    /**
     * treeNodeSelected is executed when a node is selected in the tree
     * @param  {NodeEvent} e the event that took place
     */
    treeNodeSelected(e: NodeEvent) {
      if (e.node.isLeaf()) {
        this.router.navigate(['/admin', e.node.value.survey._id]);
      }
    }


    /**
     * get all surveys as a list
     */
    private getSurveys() {
      this.loading = true;
      const sub = this.surveyService.getAllSurveys().subscribe(result => {
        this.loading = false;
        sub.unsubscribe();
      });
    }

    /**
     * Takes a utc datestring and returns a local time datestring
     * @param  {string} dateString the utc datestring
     * @return {string}            local time datestring
     */
    formatDate(dateString: string): string {
      return new Date(dateString).toLocaleDateString();
    }

    /**
     * Load more surveys in menu on the left
     */
    loadMore() {
      this.searchResultNum += this.loadMoreValue;
    }
}
