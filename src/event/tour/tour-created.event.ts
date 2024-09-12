import mongoose from 'mongoose';

import { Subject } from '../../enum/subject.enum';
import { CoreEvent } from '../../interface/core-event.interface';

export interface TourCreatedEvent extends CoreEvent {
  subject: Subject.TourCreated;
  data: {
    id: mongoose.Types.ObjectId;
    difficulty: string;
    duration: number;
    groupSize: number;
    name: string;
    price: number;
    sequence: number;
  };
}
