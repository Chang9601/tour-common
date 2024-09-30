import mongoose from 'mongoose';

import { Subject } from '../../enum/subject.enum';
import { CoreEvent } from '../../interface/core-event.interface';

export interface UserUnbannedEvent extends CoreEvent {
  subject: Subject.UserUnbanned;
  data: {
    id: mongoose.Types.ObjectId;
    sequence: number;
  };
}
