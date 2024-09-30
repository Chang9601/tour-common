import mongoose from 'mongoose';

import { Subject } from '../../enum/subject.enum';
import { CoreEvent } from '../../interface/core-event.interface';

export interface UserBannedEvent extends CoreEvent {
  subject: Subject.UserBanned;
  data: {
    id: mongoose.Types.ObjectId;
    sequence: number;
  };
}
