import { Subject } from '../../enum/subject.enum';
import { CoreEvent } from '../../interface/core-event.interface';

export interface ReviewCreatedEvent extends CoreEvent {
  subject: Subject.ReviewCreated;
  data: {
    /*
     * 서비스는 Spring을 비롯한 다른 언어 혹은 프레임워크로 구성될 수 있다.
     * 따라서, 아이디를 문자열로 하는 것이 논리적으로 맞다.
     */
    id: string;
    rating: number;
    tourId: string;
    sequence: number;
  };
}
