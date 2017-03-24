

// optional flag: '?', usage: optionalField?: valueTypeOfOptionalField

export interface Response {
  _id?: string;
  nickname: string;
  timestamp?: string;
  surveyId: string;
  questionlist: any[];
}
