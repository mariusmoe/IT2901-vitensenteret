import { Component, OnInit } from '@angular/core';
import { SurveyService } from '../../_services/survey.service';
import { AuthenticationService } from '../../_services/authentication.service';
import { Survey } from '../../_models/survey';

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
        let s = {
          active: true,
          name: 'New TEST survey',
          comment: 'for testing purposes!',
          date: '2012-04-23T18:25:43.511Z',
          questionlist: [
            {
              mode: 'smily',
              lang: {
                no: {
                  txt: 'question?',
                }
              }
            }
          ],
          endMessage: {
            no: 'takk!'
          }
        }
        console.log("ORIGINAL SURVEY:");
        console.log(s);



        this.surveyService.postSurvey(s).subscribe(postResult => {
          console.log("POST RETURN SURVEY:");
          console.log(postResult);

          s.name = "PATCHED TEST Survey";
          // add one more question
          s.questionlist[1] = {mode: 'smily', lang: {no: { txt: 'wat'}}}

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
