

export class Question {
  txt: string;
  options: string[];
}

export class Lang {
  en: Question;
  no: Question;
}

export class QuestionObject {
  mode: string;
  answer: number[];
  lang: Lang;

}

export class Survey {
  _id: string;
  name: string;
  date: string;
  active: boolean;
  questionlist: QuestionObject[];
}
