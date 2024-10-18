import mongoose from 'mongoose';
import { Redis } from 'ioredis';

import { RedisType } from '../enum/redis-tye.enum';

export class RedisUtil {
  public static generateKey(
    id: mongoose.Types.ObjectId,
    redisType: RedisType
  ): string {
    return `${redisType.toLocaleLowerCase()}:${id}`;
  }

  public static isCached<T extends Record<any, any>>(value: T): boolean {
    return value && Object.keys(value).length !== 0;
  }

  public static async cacheUser(
    user: Record<any, any>,
    expiration: number,
    redis: Redis
  ): Promise<void> {
    const key = this.generateKey(user.id, RedisType.User);

    this.cacheValue(key, user, expiration, redis);
  }

  private static async cacheValue<T extends Record<any, any>>(
    key: string,
    value: T,
    expiration: number,
    redis: Redis
  ) {
    await redis.hmset(key, value);
    await redis.expire(key, expiration);
  }
}

// export const generateUsersKey = (id: mongoose.Types.ObjectId): string =>
//   `users:${id}`;

// export const findCachedUser = (user: Record<any, any>): boolean =>
//   user && Object.keys(user).length !== 0;

// export const cacheUser = async (
//   user: Record<any, any>,
//   expiration: number,
//   redis: Redis
// ): Promise<void> => {
//   const key = generateUsersKey(user.id);

//   await redis.hmset(key, user);
//   await redis.expire(key, expiration);
// };
