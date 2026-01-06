import { defineConfig } from "cypress";
import { MongoClient, ObjectId } from 'mongodb';
import * as dotenv from "dotenv";
dotenv.config()

// Helper to get DB connection
const getDB = async () => {
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    throw new Error('DATABASE_URL environment variable is not set.');
  }
  const client = new MongoClient(uri);
  await client.connect();
  return {
    client, 
    db: client.db(process.env.DATABASE_NAME)
  }
}

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        // CLEANUP TASK: call this in beforeEach to wipe old test sessions
        async 'db:clearSessions'(email) {
          const { client, db } = await getDB();
          try {
            const dbCollection = process.env.DATABASE_COLLECTION;
            if (!dbCollection) {
              throw new Error('DATABASE_COLLECTION environment variable is not set');
            }
            const collection = db.collection(dbCollection);
            // Delete any existing sessions for this specific test user
            await collection.deleteMany({ userId: new ObjectId(process.env.DATABASE_USER_ID) });
            return null;
          } finally {
            await client.close();
          }
        },
        async 'db:insert'(doc) {
          // Fix 1: Ensure date is handled correctly
          doc.expires = new Date(Date.now() + 60 * 60 * 1000);

          // Fix 2: Ensure userId is stored as a MongoDB ObjectId, not a string
          if (doc.userId) {
            doc.userId = new ObjectId(doc.userId);
          }

          const { client, db } = await getDB();
          try {
            const dbCollection = process.env.DATABASE_COLLECTION;
            if (!dbCollection) {
              throw new Error('DATABASE_COLLECTION environment variable is not set');
            }
            const collection = db.collection(dbCollection);
            await collection.insertOne(doc);
            return null;
          } finally {
            await client.close();
          }
        }
      });
    },
    baseUrl: 'http://localhost:3000',
    chromeWebSecurity: true, // allow cypress to access cross-domain URLS such as NextAuth.js login provider pages
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
