import { Subject } from '../../enum/subject.enum';
import { CoreEvent } from '../../interface/core-event.interface';

export interface TourCancelledEvent extends CoreEvent {
  subject: Subject.TourCancelled;
  data: {
    id: string;
    sequence: number;
  };
}
