import mongoose from 'mongoose';

import { Subject } from '../../enum/subject.enum';
import { CoreEvent } from '../../interface/core-event.interface';

export interface ReviewDeletedEvent extends CoreEvent {
  subject: Subject.ReviewDeleted;
  data: {
    id: mongoose.Types.ObjectId;
    tour: { id: mongoose.Types.ObjectId };
    sequence: number;
  };
}
