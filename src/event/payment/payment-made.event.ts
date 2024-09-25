import mongoose from 'mongoose';

import { Subject } from '../../enum/subject.enum';
import { CoreEvent } from '../../interface/core-event.interface';

export interface PaymentMadeEvent extends CoreEvent {
  subject: Subject.PaymentMade;
  data: {
    id: mongoose.Types.ObjectId;
    bookingId: mongoose.Types.ObjectId;
    chargeId: string;
    sequence: number;
  };
}
