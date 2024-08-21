import { Subject } from '../../enum/subject.enum';
import { CoreEvent } from '../../interface/core-event.interface';

export interface ReviewUpdatedEvent extends CoreEvent {
  subject: Subject.ReviewUpdated;
  data: {
    id: string;
    rating: number;
    tourId: string;
    sequence: number;
  };
}
