import nats, { Stan } from 'node-nats-streaming';

class NatsInstance {
  private _client?: Stan;

  public get client() {
    if (!this._client) {
      throw new Error('NATS 클라이언트를 연결 전 접근할 수 없습니다.');
    }

    return this._client;
  }

  public connect(clusterId: string, clientId: string, url: string) {
    this._client = nats.connect(clusterId, clientId, { url });

    return new Promise<void>((resolve, reject) => {
      this.client.on('connect', () => {
        console.log('NATS 연결');
        resolve();
      });

      this.client.on('error', (error) => {
        reject(error);
      });
    });
  }
}

export const natsInstance = new NatsInstance();
