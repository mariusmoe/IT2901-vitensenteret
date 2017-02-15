import { Alternaltive } from '../_models/alternaltive';

export class Question {
  type: string;
  text: string;
  subtext: string;
  alternaltives: Alternaltive[];
}
