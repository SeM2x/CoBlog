/* eslint-disable consistent-return */
/* eslint-disable no-param-reassign */

import { MongoClient } from 'mongodb';

require('dotenv').config();

class DBClient {
  constructor() {
    this.dbHost = process.env.DATABASE_HOST;
    this.dbPort = process.env.DATABASE_PORT;
    this.dbName = process.env.DATABASE_NAME;
    this.url = `mongodb://${this.dbHost}:${this.dbPort}`;
    this.dbClient = null;
    this.db = null;
    this.verifyConnection = false;
    this.DBCollections = ['users', 'followers', 'messages', 'followings',
      'blogs', 'conversations', 'notifications', 'topics', 'subtopics',
      'comments', 'reactions', 'viewshistory', 'coauthored',];
    this.excludeUpdatedAt = ['followers', 'followings', 'reactions'];
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
      console.log(`Mongo encountered an error: ${err.message}`);
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
        details.createdAt = new Date;
        details.updatedAt = new Date;
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

  async updateData(collectionType, filter, update, includeUpdatedAt = true) {
    if (this.db) {
      if (!this.DBCollections.includes(collectionType)) {
        throw new Error('Collection type does not exist');
      }
      const collection = this.db.collection(collectionType);

      if (!this.excludeUpdatedAt.includes(collectionType) && includeUpdatedAt === true) {
        const nUpdate = { ...update.$set, updatedAt: new Date() };
        update.$set = nUpdate;
      }
      const result = await collection.updateOne(filter, update);
      return result;
    }
  }

  async findManyData(collectionType, details, aggregate = false) {
    if (this.db) {
      if (!this.DBCollections.includes(collectionType)) {
        throw new Error('Collection type does not exist');
      }

      const collection = this.db.collection(collectionType);
      let result;
      if (aggregate) {
        result = await collection.aggregate(details).toArray();
      } else {
        result = await collection.find(details).toArray();
      }
      return result;
    }
  }

  async deleteData(collectionType, details) {
    if (this.db) {
      if (!this.DBCollections.includes(collectionType)) {
        throw new Error('Collection type does not exist');
      }
      const collection = this.db.collection(collectionType);
      const result = await collection.deleteOne(details);
      return result;
    }
  }
}

const dbClient = new DBClient();

(async () => {
  await dbClient.init();
})();

module.exports = dbClient;
