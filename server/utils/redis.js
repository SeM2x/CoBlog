/* eslint-disable consistent-return */

import { hash } from 'crypto';
import redis from 'redis';
import { promisify } from 'util';

class RedisClient {
  constructor() {
    this.verifyConnection = true;
    this.redisClient = redis.createClient();

    this.redisClient.on('error', (err) => {
      console.log(`Redis client not connected to the server: ${err}`);
      this.verifyConnection = false;
    });

    this.redisClient.on('connect', () => {
      console.log('Redis client connected to the server');
    });
  }

  isAlive() {
    return this.verifyConnection;
  }

  async get(key) {
    const asyncGet = promisify(this.redisClient.get).bind(this.redisClient);
    try {
      const value = await asyncGet(key);
      return value;
    } catch (err) {
      console.log(err);
    }
  }

  async set(key, value, duration) {
    const asyncSetEx = promisify(this.redisClient.setex).bind(this.redisClient);
    try {
      await asyncSetEx(key, duration, value);
    } catch (err) {
      console.log(err);
    }
  }

  async del(key) {
    const asyncDel = promisify(this.redisClient.del).bind(this.redisClient);
    try {
      await asyncDel(key);
    } catch (err) {
      console.log(err);
    }
  }

  async setHash(key, exp, ...value) {
    const asyncSetHash = promisify(this.redisClient.hSet).bind(this.redisClient);
    const asyncSetExp = promisify(this.redisClient.expire).bind(this.redisClient);

    try {
      await asyncSetHash(key, ...value);
      await asyncSetExp(key, exp)
    } catch (err) {
      console.log(`An error occured: ${err}`)
    }
  }

  async getHashField(key) {
    const asyncGetHashField = promisify(this.redisClient.hGet).bind(this.redisClient);
    try {
      const hashFields = asyncGetHashField(key)
      return hashFields
    } catch (err) {
      console.log(`An error occured: ${err}`)
    }
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;
