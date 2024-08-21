import mongoose from 'mongoose';

import { BookingStatus } from '../../enum/booking-status.enum';
import { Subject } from '../../enum/subject.enum';
import { CoreEvent } from '../../interface/core-event.interface';

export interface BookingConfirmedEvent extends CoreEvent {
  subject: Subject.BookingConfirmed;
  data: {
    id: mongoose.Types.ObjectId;
    status: BookingStatus;
    tourId: mongoose.Types.ObjectId;
    userId: mongoose.Types.ObjectId;
    sequence: number;
  };
}
