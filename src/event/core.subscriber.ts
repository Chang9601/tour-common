import { Message, Stan, SubscriptionOptions } from 'node-nats-streaming';

import { CoreEvent } from '../interface/core-event.interface';

export abstract class CoreSubscriber<TEvent extends CoreEvent> {
  /* 구독자가 구독하려는 채널의 이름. */
  public abstract subject: TEvent['subject'];
  /*
   * 구독자가 참여할 큐 그룹.
   * 큐 그룹은 동일 서비스의 서로 다른 인스턴스들이 동일한 이벤트의 사본을 동시에 처리하지 않도록 한다.
   * 다시 말해, 한 이벤트가 동일 서비스의 인스턴스 A 혹은 B중 하나에게만 전송되도록 보장한다.
   * 큐 그룹은 채널 내에서 구독을 생성하는 모든 서비스의 인스턴스에 고유해야 한다.
   * 또한, 일관성을 유지해야 하기 때문에 이름을 무작위로 생성해서는 안된다.
   */
  public abstract queueGroup: string;
  /* 메시지를 수신할 때 실행할 메서드. */
  public abstract onMessage(data: TEvent['data'], message: Message): void;
  /* 초기화된 NATS 클라이언트. */
  protected client: Stan;
  /* 구독자가 메시지를 확인해야 하는 시간 */
  protected ackWait = 5 * 1000;

  constructor(client: Stan) {
    this.client = client;
  }

  public setSubscriptionOptions(): SubscriptionOptions {
    return this.client
      .subscriptionOptions()
      .setDeliverAllAvailable()
      .setManualAckMode(true)
      .setAckWait(this.ackWait)
      .setDurableName(this.queueGroup);
  }

  public subscribe(): void {
    const subscription = this.client.subscribe(
      this.subject,
      this.queueGroup,
      this.setSubscriptionOptions()
    );

    subscription.on('message', (message: Message) => {
      console.log(`메시지: ${this.subject} / ${this.queueGroup}`);

      const data = this.parse(message);
      this.onMessage(data, message);
    });
  }

  public parse(message: Message): any {
    const data = message.getData();

    return typeof data === 'string'
      ? JSON.parse(data)
      : JSON.parse(data.toString('utf8'));
  }
}
