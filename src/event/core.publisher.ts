import { Stan } from 'node-nats-streaming';

import { CoreEvent } from '../interface/core-event.interface';

export abstract class CorePublisher<TEvent extends CoreEvent> {
  public abstract subject: TEvent['subject'];
  protected client: Stan;

  constructor(client: Stan) {
    this.client = client;
  }

  public async publish(data: TEvent['data']): Promise<void> {
    return new Promise((resolve, reject) => {
      this.client.publish(this.subject, JSON.stringify(data), (error) => {
        if (error) {
          return reject(error);
        }

        console.log('다음 채널로 이벤트 발행', this.subject);
        resolve();
      });
    });
  }
}
