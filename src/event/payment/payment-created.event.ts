import { Subject } from '../../enum/subject.enum';
import { CoreEvent } from '../../interface/core-event.interface';

export interface PaymentCreatedEvent extends CoreEvent {
  subject: Subject.PaymentCreated;
  data: {
    id: string;
    bookingId: string;
    cardId: string;
    sequence: number;
  };
}
