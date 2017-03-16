


// optional flag: '?', usage: optionalField?: valueTypeOfOptionalField

export interface QuestionObject {
  mode: string; // allowed values: 'binary', 'star', 'single', multi', 'smily', 'text'
  required: boolean;
  lang: {
    en?: {
      txt: string;
      options?: string[];
    };
    no: {
      txt: string;
      options?: string[];
    };
  };
}


export interface Survey {
  _id?: string;
  name: string;
  postKey: string;
  comment?: string;
  date: string;
  activationDate: string;
  deactivationDate?: string;
  active: boolean;
  questionlist?: QuestionObject[];
  endMessage: {
    no: string;
    en?: string;
  };
}

/*
    EXAMPLE SURVEY:


    let validJsonObject = {
      "name": "måneraketten3",
      "date": "2012-04-23T18:25:43.511Z",
      "activationDate": "2012-04-23T18:25:43.511Z",
      "deactivationDate": "2012-04-23T18:25:43.511Z",
      "active": true,
      "questionlist": [{
        "mode": "smiley",
        "required": true,
        // no comment property here. Admin only. see its own test below.
        "lang": {
          "en": {
              "txt": "what do you think about mars?",
              "options": ["AWSOME","coooool","blody iron planet"]
          },
          "no": {
            "txt": "Hva synes du om Mars?",
            "options": ["UTROLIG","kuuuuul","teit jernplanet"]
          },
        }
      }],
      "endMessage": {
        "no": "Takk for at du gjennomførte denne undersøkelsen!"
      }
    }

*/
