import { MongoClient } from 'mongodb';

require('dotenv').config();

class DBClient {
  constructor() {
    this.dbHost = process.env.DB_HOST || 'localhost';
    this.dbPort = process.env.PORT || '27017';
    this.dbName = process.env.DB_NAME || 'coblogdb';
    this.url = `mongodb://${this.dbHost}:${this.dbPort}`;
    this.dbClient = null;
    this.db = null;
    this.verifyConnection = false;
    this.DBCollections = ['users', 'userFollows', 'blogs', 'conversations', 'notifications'];
  }

  async init() {
    this.dbClient = new MongoClient(this.url, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    try {
      await this.dbClient.connect();
      this.verifyConnection = true;
      this.db = this.dbClient.db(this.dbName);
      console.log(`mongo successfully connected to ${this.dbName}`);
    } catch (err) {
      console.log('Mongo encountered an error');
    }
  }

  isAlive() {
    return this.verifyConnection;
  }

  async insertData(collectionType, details) {
    if (this.db) {
      if (!this.DBCollections.includes(collectionType)) {
        return new Error('Unkown collection type');
      }
      const collection = this.db.collection(collectionType);
      try {
        details.createdAt = new Date().toUTCString();
        details.updatedAt = new Date().toUTCString();

        const result = await collection.insertOne(details);
        return result;
      } catch (err) {
        console(`Insert into ${collectionType} Error`);
      }
    }
  }

  async countCollection(collectionType) {
    if (this.db) {
      if (!collectionType) {
        return new Error('Collection type not specified');
      }

      const collection = this.db.collection(collectionType);
      if (!collection) {
        return new Error('Collection type does not exist');
      }

      const collectionCount = await collection.countDocuments();
      return collectionCount;
    }
  }

  async findData(collectionType, details) {
    if (this.db) {
      const collection = this.db.collection(collectionType);
      if (!collection) {
        return new Error('Collection type does not exist');
      }
      const result = collection.findOne(details);
      return result;
    }
  }
}

const dbClient = new DBClient();

(async () => {
  await dbClient.init();
})();

module.exports = dbClient;
