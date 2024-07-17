import { Subject } from '../enum/subject.enum';

export interface CoreEvent {
  subject: Subject;
  data: any;
}
