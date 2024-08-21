import { Subject } from '../../enum/subject.enum';
import { CoreEvent } from '../../interface/core-event.interface';

export interface BookingCancelledEvent extends CoreEvent {
  subject: Subject.BookingCancelled;
  data: {
    id: string;
    tourId: string;
    userId: string;
    sequence: number;
  };
}
