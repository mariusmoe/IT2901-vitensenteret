import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Survey, QuestionObject } from '../../_models/survey';
import { Response } from '../../_models/response';
import { FormControl } from '@angular/forms';
import { SurveyService } from '../../_services/survey.service';
import 'rxjs/add/operator/startWith';

@Component({
  selector: 'app-nickname',
  templateUrl: './nickname.component.html',
  styleUrls: ['./nickname.component.scss']
})
export class NicknameComponent implements OnInit {
  @Input() questionObject: QuestionObject;
  @Input() response: Response;
  @Input() survey: Survey;
  @Output() answer = new EventEmitter();
  public searchNickname: string; // The written nickname
  key; // The key used to store a nickname in localstorage
  allNames: any; // A list of all nicknames a survey has registered
  taken; // Testvariable for whether a nickname is taken or not

  nickCtrl = new FormControl();
  filteredNicknames: any;

  nickNameNotRegistered = false;

  nicknames = [];


  // Randomly generated combination of nicknames will be added based on the nickname written
  // was taken or not. See updateAnswers()
  // public suggestions = [];
  // public suggestions = ['James T. Kirk', 'Benjamin Sisko', 'Jean-Luc Picard', 'Spock',
  // 'Jonathan Archer', 'Hikaru Sulu', 'Christopher Pike', 'Rachel Garrett' ];

  constructor( private surveyService: SurveyService) {
    this.nickCtrl = new FormControl();
    this.filteredNicknames = this.nickCtrl.valueChanges
        .startWith(null)
        .map(name => this.filterNicknames(name));
  }

  filterNicknames(val: string) {
  return val ? this.nicknames.filter((s) => new RegExp(val, 'gi').test(s)) : this.nicknames;
}

  ngOnInit() {
    console.log(this.survey);
    const sub  = this.surveyService.getNicknames(this.survey._id)
      .subscribe( result => {
        if (this.survey.isPost) {
          this.allNames = result;
          console.log('These are the names: ', this.allNames);
          this.allNames.forEach((x) => { this.nicknames.push(x.nickname); });
        }
       sub.unsubscribe();
    },
    error => {
      console.log('error when get nicknames');
      console.log(error);
    });
    this.nickCtrl.valueChanges.subscribe(value => {
      // do something with value here
      if (this.nicknames.indexOf(value) === -1 && this.survey.isPost) {
        // tell the user to do the pre survey first
        if (value.length > 2) {
          this.nickNameNotRegistered = true;
        }
      } else {
        this.answer.emit(value);
        this.nickNameNotRegistered = false;

      }
    });
  }

    /**
     * This method emits the changes to its parent. The parent HTML listens for $event changes and call the addOrChangeAnswer(alt)
     * @param  {number[]} alt The output answer sent to active-survey-component
     */
    addChange(alt) {
      this.answer.emit(alt);
    }

  /**
   * This updates the variables that posts to the active-survey component
   * @param  {number[]} userChoice An output number that shows which answer was chosen by a user
   */
    updateAnswers(nickname: string) {
      if (this.nicknames.indexOf(nickname) === -1 && this.survey.isPost) {
        // tell the user to do the pre survey first
        if (nickname.length > 2) {
          this.nickNameNotRegistered = true;
        }
      } else {
        this.nickNameNotRegistered = false;
        this.answer.emit(nickname);
      }
    }

    /**
     * Checks if nickname is taken based on pre or post. If it is a post-survey, it will
     * allow matching names to pass. If it is a pre-survey, matching names will recieve suggestions of
     * new nicknames, to not cause duplicates.
     * @return {[type]} [description]
     */
    openNickname () {
      if (!this.allNames.contains(this.searchNickname)) {
        console.log('nickname is open');
        return true;
      }
      console.log('nickname is taken');
      // this.suggestions = [
      //   this.nickname + '123', this.nickname + '456'
      // ];
      return false;
    }

}
