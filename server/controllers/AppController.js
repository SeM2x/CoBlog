import dbClient from '../utils/db';
import redisClient from '../utils/redis';

const dbConnection = () => new Promise((resolve, reject) => {
  let i = 0;
  const repeatFct = () => {
    setTimeout(() => {
      i += 1;
      if (i >= 10) {
        reject();
      } else if (!dbClient.isAlive()) {
        repeatFct();
      } else {
        resolve();
      }
    }, 1000);
  };

  repeatFct();
});

export async function getStatus(req, res) {
  // verify mongodb connection
  await dbConnection();
  const isMongoConnected = dbClient.isAlive();

  // verify redis connection
  const isRedisConnected = redisClient.isAlive();

  return res.json({ redis: isRedisConnected, db: isMongoConnected });
}

export async function getStats(req, res) {
  const userCount = await dbClient.countCollection('users');

  return res.json({ status: 'success', data: userCount });
}
