import * as nats from 'node-nats-streaming';

import { Code } from '../code/code';
import { NatsNotConnectedError } from '../error/nats/nats-not-connected.error';

class NatsInstance {
  private _client?: nats.Stan;

  public get client(): nats.Stan {
    if (!this._client) {
      throw new NatsNotConnectedError(
        Code.NATS_NOT_CONNECTED_ERROR,
        'NATS 클라이언트를 연결 전 접근할 수 없습니다.',
        false
      );
    }

    return this._client;
  }

  public connect(
    clusterId: string,
    clientId: string,
    url: string
  ): Promise<void> {
    this._client = nats.connect(clusterId, clientId, {
      url,
      waitOnFirstConnect: true,
    });

    return new Promise<void>((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('NATS에 연결되었습니다.');
        resolve();
      });

      this.client.on('error', (error) => {
        reject(error);
      });
    });
  }
}

export const natsInstance = new NatsInstance();
