import mongoose from 'mongoose';

import { Subject } from '../../enum/subject.enum';
import { CoreEvent } from '../../interface/core-event.interface';

export interface ReviewUpdatedEvent extends CoreEvent {
  subject: Subject.ReviewUpdated;
  data: {
    id: mongoose.Types.ObjectId;
    rating: number;
    ratingsAverage: number;
    ratingsCount: number;
    tour: { id: mongoose.Types.ObjectId };
    sequence: number;
  };
}
