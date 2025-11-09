/**
 * The two create caller methods here can be used in either integration tests to
 * call the queries and mutations on a router with a live db connection or 
 * used within other areas of the server code if required.
 * link: https://trpc.io/docs/v10/server/server-side-calls
 * Not clear if we will need this yet but it was too much pain to create these to not keep!
 */

import { createCaller } from "@/server/api/root";
import { createContextInner } from "@/server/api/trpc";
import { faker } from "@faker-js/faker";
import { mockSession } from "jest.setup";
import { Session } from "next-auth";


export const mockSessionUnknownID: Session = {
    expires: new Date().toISOString(),
    user: { id: faker.database.mongodbObjectId() },
};

export type AppRouterCaller = ReturnType<typeof createCaller>;

/**
 * Creates a tRPC caller with a valid, authenticated session.
 * @returns A promise resolving to the tRPC caller instance.
 * @example
 * ```ts
 * let caller: ReturnType<typeof createCaller>;
 * beforeAll(async () => {
 *      caller = createAuthenticatedCaller();
 * })
 * ```
 */
export const createAuthenticatedCaller = async (): Promise<AppRouterCaller> => {
    const context = await createContextInner({ session: mockSession });
    return createCaller(context);
};

/**
 * Creates a tRPC caller with an invalid session (missing user ID).
 * @returns A promise resolving to the tRPC caller instance.
 */
export const createUnknownUserCaller = async (): Promise<AppRouterCaller> => {
    const context = await createContextInner({ session: mockSessionUnknownID });
    return createCaller(context);
};