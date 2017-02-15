import { Alternaltive } from '../_models/alternaltive';

export class Question {
  type: string;
  text: string;
  text_e: string;
  subtext: string;
  subtext_e: string;
  alternaltives: Alternaltive[];
}
