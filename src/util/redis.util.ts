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

  public static async isCached(
    id: mongoose.Types.ObjectId,
    redisType: RedisType,
    redis: Redis
  ): Promise<number> {
    return await redis.exists(this.generateKey(id, redisType));
  }

  public static async cacheUser(
    user: Record<any, any>,
    expiration: number,
    redis: Redis
  ): Promise<void> {
    const key = this.generateKey(user.id, RedisType.User);

    this.cacheValue(key, user, expiration, redis);
  }

  public static async findUser(
    id: mongoose.Types.ObjectId,
    redis: Redis
  ): Promise<Record<any, any>> {
    const key = this.generateKey(id, RedisType.User);

    return this.findValue(key, redis);
  }

  public static async setHash(
    id: mongoose.Types.ObjectId,
    value: Object,
    redisType: RedisType,
    redis: Redis
  ) {
    const key = this.generateKey(id, redisType);

    await redis.hset(key, value);
  }

  private static async cacheValue<T extends Record<any, any>>(
    key: string,
    value: T,
    expiration: number,
    redis: Redis
  ): Promise<void> {
    await redis.hmset(key, value);
    await redis.expire(key, expiration);
  }

  private static async findValue(key: string, redis: Redis) {
    return await redis.hgetall(key);
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
