import mongoose from 'mongoose';

import { Subject } from '../../enum/subject.enum';
import { CoreEvent } from '../../interface/core-event.interface';

export interface ReviewCreatedEvent extends CoreEvent {
  subject: Subject.ReviewCreated;
  data: {
    /*
     * 서비스는 Spring을 비롯한 다른 언어, 프레임워크 혹은 데이터베이스로 구성될 수 있다.
     * 따라서, 아이디를 문자열로 하는 것이 논리적으로 맞다.
     * 하지만 모든 서비스를 MongoDB를 기반으로 하기 때문에 일단 사용하기로 한다.
     */
    id: mongoose.Types.ObjectId;
    ratingsAverage: number;
    ratingsCount: number;
    rating: number;
    tour: {
      id: mongoose.Types.ObjectId;
      name: string;
    };
    sequence: number;
  };
}
