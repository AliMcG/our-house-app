import { defineConfig } from "cypress";
import { MongoClient, ObjectId } from 'mongodb';
import * as dotenv from "dotenv";
dotenv.config()

// Maybe we could move this somewhere else or improve it
interface NextAuthSession {
  _id: ObjectId;
  sessionToken: string;
  userId: string | ObjectId;
  expires?: Date;
}

// Helper to get DB connection
const getDB = async () => {
  const uri = process.env.DATABASE_URL;
  if (!uri) {
    throw new Error('DATABASE_URL environment variable is not set.');
  }
  const client = new MongoClient(uri, { serverSelectionTimeoutMS: 5000 });
  await client.connect();
  return {
    client, 
    db: client.db(process.env.DATABASE_NAME)
  }
}

// Why Promises for the tasks:
// - Cypress waits for DB before continuing
// - avoids "flaky" tests where sometimes you are logged in and not others
// - Promise rejects if there is an issue with the DB
export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
      on('task', {
        // CLEANUP TASK: call this in beforeEach to wipe old test sessions
        // prevents accidentally querying any session instead of specific one
        // ensures DB doesn't accidentally log into an old session left behind
        // database can fill up with orphaned sessions
        async 'db:clearSessions'(): Promise<null> {
          const userIdString = process.env.DATABASE_USER_ID;
          if (!userIdString) {
            console.error('ERROR: DATABASE_USER_ID is missing from .env');
            throw new Error("DATABASE_USER_ID not found in .env");
          }

          const { client, db } = await getDB();
          try {
            const collection = db.collection(process.env.DATABASE_COLLECTION!);

            // convert userId to binary type for MongoDB
            const userObjectId = ObjectId.createFromHexString(userIdString);
            // delete any and all existing sessions for this specific test user
            await collection.deleteMany({ userId: userObjectId });

            // tells cypress there is not data to return
            return null;
          } finally {
            await client.close();
          }
        },
        async 'db:insert'(doc: NextAuthSession): Promise<null> {
          // Ensure userId is stored as a MongoDB ObjectId, not a string
          // .env stores a string and we need to convert it to binary type 'ObjectId'
          if (!doc.userId || typeof doc.userId !== 'string') {
            throw new Error("db:insert required userID string");
          }

          // transform the document for MongoDB BSON types
          const sessionToInsert = {
            ...doc,
            expires: new Date(Date.now() + 60 * 60 * 1000),
            userId: ObjectId.createFromHexString(doc.userId)
          };

          const { client, db } = await getDB();
          try {
            const collection = db.collection(process.env.DATABASE_COLLECTION!);
            await collection.insertOne(sessionToInsert);
            // tells cypress there is no data to return
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
