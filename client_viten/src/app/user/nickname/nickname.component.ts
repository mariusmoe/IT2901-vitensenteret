import { Component, OnInit, OnDestroy, Output, Input, EventEmitter } from '@angular/core';
import { Survey, QuestionObject } from '../../_models/survey';
import { Response } from '../../_models/response';
import { FormControl } from '@angular/forms';
import { SurveyService } from '../../_services/survey.service';
import 'rxjs/add/operator/startWith';
import {Subscription} from 'rxjs/Subscription';

@Component({
  selector: 'app-nickname',
  templateUrl: './nickname.component.html',
  styleUrls: ['./nickname.component.scss']
})
export class NicknameComponent implements OnInit, OnDestroy {
  @Input() questionObject: QuestionObject;
  @Input() response: Response;
  @Input() survey: Survey;
  @Output() answer = new EventEmitter();
  @Input() isNicknameTaken: boolean;
  @Input() nicknamesForSurvey: string[];
  public searchNickname: string; // The written nickname
  key; // The key used to store a nickname in localstorage
  allNames: any; // A list of all nicknames a survey has registered
  taken; // Testvariable for whether a nickname is taken or not

  nickCtrl = new FormControl();
  subscription: Subscription;
  nickNameNotRegistered = false;



  // Randomly generated combination of nicknames will be added based on the nickname written
  // was taken or not. See updateAnswers()
  // public suggestions = [];
  // public suggestions = ['James T. Kirk', 'Benjamin Sisko', 'Jean-Luc Picard', 'Spock',
  // 'Jonathan Archer', 'Hikaru Sulu', 'Christopher Pike', 'Rachel Garrett' ];

  constructor( private surveyService: SurveyService) {
    this.nickCtrl = new FormControl();
  }

  filterNicknames(val: string) {
    return val ? this.nicknamesForSurvey.filter((s) => new RegExp(val, 'gi').test(s)) : this.nicknamesForSurvey;
  }

  ngOnInit() {
    this.subscription = this.nickCtrl.valueChanges.subscribe(value => {
      // do something with value here
      if (this.nicknamesForSurvey.indexOf(value) === -1 && this.survey.isPost) {
        // tell the user to do the pre survey first
        if (value.length > 2) {
          this.nickNameNotRegistered = true;
          return;
        }
      }
      // Assume everything is okay here
      this.answer.emit(value);
      this.nickNameNotRegistered = false;
    });
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  /**
   * This updates the variables that posts to the active-survey component
   * @param  {number[]} userChoice An output number that shows which answer was chosen by a user
   */
    updateAnswers(nickname: string) {
      if (this.nicknamesForSurvey.indexOf(nickname) === -1 && this.survey.isPost) {
        // tell the user to do the pre survey first
        if (nickname.length > 2) {
          this.nickNameNotRegistered = true;
        }
      } else {
        this.nickNameNotRegistered = false;
      }
      this.answer.emit(nickname);
    }

    /**
     * Checks if nickname is taken based on pre or post. If it is a post-survey, it will
     * allow matching names to pass. If it is a pre-survey, matching names will recieve suggestions of
     * new nicknames, to not cause duplicates.
     */
    openNickname () {
      if (!this.allNames.contains(this.searchNickname)) {
        return true;
      }
      // this.suggestions = [
      //   this.nickname + '123', this.nickname + '456'
      // ];
      return false;
    }

}
