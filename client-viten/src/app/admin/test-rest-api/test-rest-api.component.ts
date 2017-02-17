import { Component, OnInit } from '@angular/core';
import { SurveyService } from '../../_services/survey.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { Survey, QuestionObject, Lang, Question, EndMessage } from '../../_models/survey';

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
        s.endMessage = new EndMessage();
        s.endMessage.no = "Takk!"

        let qo = new QuestionObject();
        qo.mode = "smily";
        qo.answer = [];

        let lang = new Lang();
        lang.en = new Question();
        lang.en.txt = "Question?";
        lang.en.options = ["1", "2", "3"];

        qo.lang = lang;
        s.questionlist[0] = qo;
        console.log("ORIGINAL SURVEY:");
        console.log(s);



        this.surveyService.postSurvey(s).subscribe(postResult => {
          console.log("POST RETURN SURVEY:");
          console.log(postResult);

          s.name = "PATCHED TEST Survey";
          s.questionlist[1] = qo; // add one more question

          this.surveyService.patchSurvey(postResult._id, s).subscribe(patchResult => {
            console.log("PATCH RETURN SURVEY:");
            console.log(patchResult);

            this.surveyService.deleteSurvey(postResult._id).subscribe(deleteResult => {
              console.log("DELETE RETURN:");
              console.log(deleteResult);
            });
          });
        });
      });

    }

  ngOnInit() {

  }

}
