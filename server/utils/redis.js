/* eslint-disable consistent-return */

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
      const resp = await asyncDel(key);
      console.log(resp);
    } catch (err) {
      console.log(err);
    }
  }
}

const redisClient = new RedisClient();

module.exports = redisClient;
