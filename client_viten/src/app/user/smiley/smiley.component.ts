import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { QuestionObject } from '../../_models/survey';

@Component({
  selector: 'app-smiley',
  templateUrl: './smiley.component.html',
  styleUrls: ['./smiley.component.scss']
})
export class SmileyComponent implements OnInit {
  @Input() questionObject: QuestionObject;
  @Output() answer = new EventEmitter();
  selectedSmile: number;

  constructor() {  }

  ngOnInit() {}

// This method emits the changes to its parent. The parent HTML listens for $event changes and call the addOrChangeAnswer(alt)
  addChange(alt) {
    console.log('Answer changed');
    this.answer.emit(alt);
  }

  // This method selects the smiley and calls addChange()
  selectSmile(selectedSmile) {
    this.selectedSmile = selectedSmile;
    this.addChange(this.selectedSmile);
  }
}
