import mongoose from 'mongoose';

import { BookingStatus } from '../../enum/booking-status.enum';
import { Subject } from '../../enum/subject.enum';
import { CoreEvent } from '../../interface/core-event.interface';

export interface BookingMadeEvent extends CoreEvent {
  subject: Subject.BookingMade;
  data: {
    id: mongoose.Types.ObjectId;
    expiration: number;
    status: BookingStatus;
    tour: {
      id: mongoose.Types.ObjectId;
      price: number;
    };
    userId: mongoose.Types.ObjectId;
    sequence: number;
  };
}
