import type { Session } from "next-auth";
import { faker } from "@faker-js/faker";
import dotenv from "dotenv";
dotenv.config();

/**
 * Reusable mockSessions for the use cases:
 * - valid user
 * - unknown user
 * - No id
 */
export const mockSession: Session = {
  expires: new Date().toISOString(),
  user: { id: process.env.UNIT_TESTER_ID as string },
};
export const mockErrorSessionUnknownID: Session = {
  expires: new Date().toISOString(),
  user: { id: faker.database.mongodbObjectId() },
};
export const mockErrorSessionNoID: Session = {
  expires: new Date().toISOString(),
  user: { id: "No Id" },
};
