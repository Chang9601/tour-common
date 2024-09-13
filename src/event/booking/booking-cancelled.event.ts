import mongoose from 'mongoose';

import { Subject } from '../../enum/subject.enum';
import { CoreEvent } from '../../interface/core-event.interface';

export interface BookingCancelledEvent extends CoreEvent {
  subject: Subject.BookingCancelled;
  data: {
    id: mongoose.Types.ObjectId;
    tour: {
      id: mongoose.Types.ObjectId;
    };
    sequence: number;
  };
}
