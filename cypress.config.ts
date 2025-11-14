/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { defineConfig } from "cypress";
import { MongoClient } from 'mongodb';
import * as dotenv from "dotenv";
dotenv.config()

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        async 'db:insert'(doc) {
          // The new Date needs to applied here to stop being turned into a JSON string.
          doc.expires = new Date(Date.now() + 1 * (60 * 60 * 1000))
          const uri = process.env.DATABASE_URL!;
          const client = new MongoClient(uri);
          try {
            await client.connect();
            const db = client.db(process.env.DATABASE_NAME);
            const collection = db.collection(process.env.DATABASE_COLLECTION!);
            const test = await collection.insertOne(doc);
            return null;
          } finally {
            await client.close();
          }

        }
      })
    },
    baseUrl: 'http://localhost:3000',
    chromeWebSecurity: false, // allow cypress to access cross-domain URLS such as NextAuth.js login provider pages
  },
  env: {
    googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,
    googleClientId: process.env.GOOGLE_CLIENT_ID,
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    databaseApiUrl: process.env.DATABASE_API_URL,
    databaseApiKey: process.env.DATABASE_API_KEY,
    databaseSource: process.env.DATABASE_SOURCE,
    databaseName: process.env.DATABASE_NAME,
    databaseCollection: process.env.DATABASE_COLLECTION,
    databaseUserId: process.env.DATABASE_USER_ID
  },
});
