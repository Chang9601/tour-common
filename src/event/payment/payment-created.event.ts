import mongoose from 'mongoose';

import { Subject } from '../../enum/subject.enum';
import { CoreEvent } from '../../interface/core-event.interface';

export interface PaymentCreatedEvent extends CoreEvent {
  subject: Subject.PaymentCreated;
  data: {
    id: mongoose.Types.ObjectId;
    bookingId: mongoose.Types.ObjectId;
    cardId: mongoose.Types.ObjectId;
    sequence: number;
  };
}
