import mongoose from 'mongoose';

import { Subject } from '../../enum/subject.enum';
import { CoreEvent } from '../../interface/core-event.interface';

export interface ReviewCreatedEvent extends CoreEvent {
  subject: Subject.ReviewCreated;
  data: {
    id: mongoose.Types.ObjectId;
    ratingAverage: number;
    ratingCount: number;
    seq: number;
  };
}
