import mongoose from 'mongoose';

import { Subject } from '../../enum/subject.enum';
import { CoreEvent } from '../../interface/core-event.interface';

export interface ExpirationCompletedEvent extends CoreEvent {
  subject: Subject.ExpirationCompleted;
  data: {
    bookingId: mongoose.Types.ObjectId;
  };
}
