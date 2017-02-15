import { Component, OnInit } from '@angular/core';
import { SurveyService } from '../../_services/survey.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { Survey, QuestionObject, Lang, Question } from '../../_models/survey';

@Component({
  selector: 'app-test-rest-api',
  templateUrl: './test-rest-api.component.html',
  styleUrls: ['./test-rest-api.component.scss']
})
export class TestRestAPIComponent implements OnInit {

  constructor(
    private surveyService: SurveyService,
    private authenticationService: AuthenticationService) {
      console.log("testteesdfsdfsd");
      this.authenticationService.login("test@test.no", "test").subscribe(result => {
        if (result != true) {
          console.log("TEST messed up on login");
          return;
        }

        let s = new Survey();
        s.active = true;
        s.name = "New TEST survey";
        s.date = "2012-04-23T18:25:43.511Z";
        s.questionlist = [];

        let qo = new QuestionObject();
        qo.mode = "smily";
        qo.answer = [];

        let lang = new Lang();
        lang.en = new Question();
        lang.en.txt = "Question?";
        lang.en.options = ["1", "2", "3"];

        qo.lang = lang;
        s.questionlist[0] = qo;



        this.surveyService.postSurvey(s).subscribe(postResult => {
          console.log("SURVEY");
          console.log(postResult);
        });
      });

    }

  ngOnInit() {

  }

}
