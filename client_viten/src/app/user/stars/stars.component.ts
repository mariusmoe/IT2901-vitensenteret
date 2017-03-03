import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QuestionObject } from '../../_models/survey';

@Component({
  selector: 'app-stars',
  templateUrl: './stars.component.html',
  styleUrls: ['./stars.component.scss']
})
export class StarsComponent implements OnInit {
  @Input() questionObject: QuestionObject;
  @Output() answer = new EventEmitter();
  selectedStar: number;
  private starList = [0, 1, 2, 3, 4];

  constructor() {
  }

  ngOnInit() {
  }

// This method emits the changes to its parent. The parent HTML listens for $event changes and call the addOrChangeAnswer(alt)
  private addChange(alt) {
    console.log('Answer changed');
    this.answer.emit(alt);
  }

  // This method fills the stars with >= selectedIDStar and calls addChange()
  fillStar(selectedStar) {
    this.selectedStar = selectedStar;
    this.addChange(selectedStar);
  }
}
