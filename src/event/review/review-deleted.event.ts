import { Subject } from '../../enum/subject.enum';
import { CoreEvent } from '../../interface/core-event.interface';

export interface ReviewDeletedEvent extends CoreEvent {
  subject: Subject.ReviewDeleted;
  data: {
    id: string;
    tourId: string;
    sequence: number;
  };
}
