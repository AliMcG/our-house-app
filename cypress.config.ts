/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-call */
import { defineConfig } from "cypress";
import * as dotenv from "dotenv";
dotenv.config()

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
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
