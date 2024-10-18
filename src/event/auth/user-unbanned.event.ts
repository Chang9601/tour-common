import mongoose from 'mongoose';

import { Subject } from '../../enum/subject.enum';
import { UserRole } from '../../enum/user-role.enum';
import { CoreEvent } from '../../interface/core-event.interface';

export interface UserUnbannedEvent extends CoreEvent {
  subject: Subject.UserUnbanned;
  data: {
    id: mongoose.Types.ObjectId;
    banned: boolean;
    userRole: UserRole;
    sequence: number;
  };
}
