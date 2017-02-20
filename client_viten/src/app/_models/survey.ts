


// optional flag: '?', usage: optionalField?: valueTypeOfOptionalField

export interface QuestionObject {
  mode: string; // allowed values: 'binary', 'star', 'multi', 'smily', 'text'
  answer?: number[];
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
  comment?: string;
  date: string;
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
      "active": true,
      "questionlist": [{
        "mode": "smily",
        "answer": [1,2,1,2,1,2,1,2],
        "lang": {
          "en": {
            "txt": "what do you think about mars?",
            "options": ["AWSOME","coooool","blody iron planet"]
          },
          "no": {
            "txt": "Hva synes du om Mars?",
            "options": ["UTROLIG","kuuuuul","dumme jernplanet"]
          },
        },
      }],
      "endMessage": {
        "no": "Takk for at du gjennomførte denne undersøkelsen!"
      }
    }

*/
