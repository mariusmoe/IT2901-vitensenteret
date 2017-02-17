import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormBuilder, ReactiveFormsModule, Validators, FormArray } from '@angular/forms';
import { SurveyService } from '../../_services/survey.service';
import { Survey, QuestionObject, Lang, Question, EndMessage } from '../../_models/survey';


@Component({
  selector: 'app-create-survey',
  templateUrl: './create-survey.component.html',
  styleUrls: ['./create-survey.component.scss']
})
export class CreateSurveyComponent implements OnInit {
  private surveyForm: FormGroup;
  private loading: boolean = false;
  private error: string;
  @Input() survey: Survey;

  private allowedTypes = ['binary', 'star', 'multi', 'smily', 'text'];


  constructor(private fb: FormBuilder, private surveyService: SurveyService) {
    this.surveyForm = fb.group({
      'name': [null, Validators.required],
      'date': [null, Validators.required],
      'endMessage': this.fb.group({
        'no': [null, Validators.required],
        'en': [null, Validators.required],
      }),
      'active': [null],
      'questionlist': this.fb.array([this.initQuestions()])
    });
  }

  ngOnInit() {
  }



  initQuestions() {
    // initialize our questions
    return this.fb.group({
        mode: ['smily', Validators.required],
        lang: this.fb.group({
          'no': this.fb.group({ 'txt': [null, Validators.required], 'options': this.fb.array([])}),
          'en': this.fb.group({ 'txt': [null, Validators.required], 'options': this.fb.array([])}),
        }),
    });
  }

  addQuestions() {
    // add address to the list
    const control = <FormArray>this.surveyForm.controls['questionlist'];
    control.push(this.initQuestions());
  }

  removeQuestions(i: number) {
    // remove address from the list
    const control = <FormArray>this.surveyForm.controls['questionlist'];
    control.removeAt(i);
  }


  initOptions(type:string) {
    switch (type) {
      case 'smily':
        return this.fb.control(null, Validators.required);
      case 'multi':
        return this.fb.control(null, Validators.required);
      case 'text':
        return this.fb.control(null, Validators.required);
      default:
        return;
    }
  }


  submitForm(survey: any){
    this.loading = true;

    console.log(survey);

    this.loading = true;
    this.surveyService.postSurvey(this.survey)
        .subscribe(result => {
          // console.log("Got response!")
            if (result) {
              // yay
            } else {
                this.error = 'Email or password is incorrect';
                this.loading = false;
            }
        },
        error => {
          this.error = 'Email or password is incorrect.';
          this.loading = false;
        }
      );
  }

}
