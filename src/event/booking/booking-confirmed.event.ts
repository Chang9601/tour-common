import { BookingStatus } from '../../enum/booking-status.enum';
import { Subject } from '../../enum/subject.enum';
import { CoreEvent } from '../../interface/core-event.interface';

export interface BookingConfirmedEvent extends CoreEvent {
  subject: Subject.BookingConfirmed;
  data: {
    id: string;
    status: BookingStatus;
    tourId: string;
    userId: string;
    sequence: number;
  };
}
