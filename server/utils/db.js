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
    this.DBCollections = ['users', 'followers', 'followings', 'blogs', 'conversations', 'notifications'];
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
        throw new Error('Collection type does not exist');
      }
      const collection = this.db.collection(collectionType);
      try {
        details.createdAt = `${new Date().toISOString().split('.')[0]}Z`;
        details.updatedAt = `${new Date().toISOString().split('.')[0]}Z`;
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
        throw new Error('Collection type not specified');
      }

      if (!this.DBCollections.includes(collectionType)) {
        throw new Error('Collection type does not exist');
      }
      const collection = this.db.collection(collectionType);
      const collectionCount = await collection.countDocuments();
      return collectionCount;
    }
  }

  async findData(collectionType, details) {
    if (this.db) {
      if (!this.DBCollections.includes(collectionType)) {
        throw new Error('Collection type does not exist');
      }
      const collection = this.db.collection(collectionType);
      const result = collection.findOne(details);
      return result;
    }
  }

  async updateData(collectionType, filter, update) {
    if (this.db) {
      if (!this.DBCollections.includes(collectionType)) {
        throw new Error('Collection type does not exist');
      }
      const collection = this.db.collection(collectionType);
      let nUpdate = { ...update.$set, updatedAt: `${new Date().toISOString().split('.')[0]}Z` }
      update.$set = nUpdate;
      const result = await collection.updateOne(filter, update);
      return result;
    }
  }

  async findManyData(collectionType, details) {
    if (this.db) {
      if (!this.DBCollections.includes(collectionType)) {
        throw new Error('Collection type does not exist');
      }
      const collection = this.db.collection(collectionType);
      const result = collection.find(details).toArray();
      return result;
    }
  }
}

const dbClient = new DBClient();

(async () => {
  await dbClient.init();
})();

module.exports = dbClient;
