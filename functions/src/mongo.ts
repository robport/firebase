import {MongoClient} from "mongodb";
import {Post} from "./post.model";
import {SecretManagerServiceClient} from "@google-cloud/secret-manager";

const DB_SECRET_ID = 'projects/894522724198/secrets/MONGO_DB_URL/versions/1'

export class Mongo {
  client: MongoClient | undefined;

  async connect() {
    if (this.client) {
      console.log('Connected', this.client.isConnected())
    } else {
      console.log('Creating new Client')
    }

    if (!this.client || !this.client.isConnected()) {
      const secretClient = new SecretManagerServiceClient();
      const [dbUrlVersion] = await secretClient.accessSecretVersion({
        name: DB_SECRET_ID
      })
      const dbUrl = dbUrlVersion.payload?.data?.toString() || '';
      // const dbUrl = 'mongodb://localhost:27017/'
      // kjrvndkn
      this.client = new MongoClient(dbUrl, {useUnifiedTopology: true});
      await this.client.connect()
      console.log('Connected', this.client.isConnected())
    } else {
      console.log('Reusing existing connection')
    }
  }

  async close() {
    await this.client?.close();
  }

  async getPosts(): Promise<Post[]> {
    const db = this.client?.db('experiment');
    if (db) {
      return await db.collection('posts').find().toArray();
    } else {
      throw new Error('No db');
    }
  }
}
