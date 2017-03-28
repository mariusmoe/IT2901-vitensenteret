import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { Survey, QuestionObject } from '../../_models/survey';
import { Response } from '../../_models/response';
import { CompleterService, CompleterData } from 'ng2-completer';
import { SurveyService } from '../../_services/survey.service';

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
  public nickname: string; // The written nickname
  key; // The key used to store a nickname in localstorage
  allNames; // A list of all nicknames a survey has registered
  taken; // Testvariable for whether a nickname is taken or not

  public searchStr: string;
  public dataService: CompleterData;
  protected searchData = [
    { color: 'red', value: '#f00' },
    { color: 'green', value: '#0f0' },
    { color: 'blue', value: '#00f' },
    { color: 'cyan', value: '#0ff' },
    { color: 'magenta', value: '#f0f' },
    { color: 'yellow', value: '#ff0' },
    { color: 'black', value: '#000' }
  ];

  // Randomly generated combination of nicknames will be added based on the nickname written
  // was taken or not. See updateAnswers()
  public suggestions = [];
  // public suggestions = ['James T. Kirk', 'Benjamin Sisko', 'Jean-Luc Picard', 'Spock',
  // 'Jonathan Archer', 'Hikaru Sulu', 'Christopher Pike', 'Rachel Garrett' ];

  constructor(private completerService: CompleterService, private surveyService: SurveyService) {
    this.dataService = completerService.local(this.searchData, 'color', 'color');
  }

  ngOnInit() {
    console.log(this.survey._id);
    const sub  = this.surveyService.getNicknames(this.survey._id)
      .subscribe( result => {
       console.log(result);
       this.allNames = result;
       console.log('These are the names: ', this.allNames);
       sub.unsubscribe();
    },
    error => {
      console.log('error when get nicknames')
      console.log(error);
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
    updateAnswers() {
      // Clear suggestions
      this.suggestions = [];
      // Check if nickname is taken
      this.taken = false;
      if (!this.taken) {
        // If false, emit nickname
        this.answer.emit(this.nickname);
        localStorage.setItem(this.key, this.nickname);
      }
      // if nickname is taken, use the ng2-completer tool to suggest other names and combinations of them.
      // Database is checked if nick is taken
      if (this.nickname ) {}

      console.log(this.suggestions);

    }

    /**
     * Checks if nickname is taken based on pre or post. If it is a post-survey, it will
     * allow matching names to pass. If it is a pre-survey, matching names will recieve suggestions of
     * new nicknames, to not cause duplicates.
     * @return {[type]} [description]
     */
    openNickname () {
      if (!this.allNames.contains(this.nickname)) {
        console.log('nickname is open');
        return true;
      }
      console.log('nickname is taken');
      this.suggestions = [
        this.nickname + '123', this.nickname + '456'
      ];
      return false;
    }

}
