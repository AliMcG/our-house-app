/// <reference types="cypress" />
// ***********************************************
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************

/** Custom command functions must be declared in the following code block: */
declare global {
  namespace Cypress {
    interface Chainable {
      loginByGoogleApi(): Chainable<void>;
      login(): Chainable<void>;
      logout(): Chainable<void>;
    }
  }
}
/** Helper function to generate random hexadecimal number */
const genRanHex = (length: number) =>
  [...Array(length)]
    .map(() => Math.floor(Math.random() * 16).toString(16))
    .join("");

// https://developers.google.com/identity/protocols/oauth2
// https://next-auth.js.org/providers/google
Cypress.Commands.add("loginByGoogleApi", () => {
  cy.log("Logging in to Google");
  // clear old sessions.
  // return the task so Cypress waits for the DB to be clean first
  cy.task('db:clearSessions').then(() => {
    // request an access_token using the modern Google OAuth2 endpoint
    cy.request({
      method: "POST",
      url: "https://oauth2.googleapis.com/token",
      body: {
        grant_type: "refresh_token",
        client_id: Cypress.env("googleClientId"),
        client_secret: Cypress.env("googleClientSecret"),
        refresh_token: Cypress.env("googleRefreshToken"),
      },
    }).then(({ body }) => {
      const { access_token } = body;

      // use the access_token to request the user details
      cy.request({
        method: "GET",
        url: "https://www.googleapis.com/oauth2/v3/userinfo",
        headers: { Authorization: `Bearer ${access_token}` },
      }).then(({ body: user }) => {
        // intercepting the session call helps the UI update immediately
        // without waiting for a database round-trip in some cases
        cy.intercept("GET", "/api/auth/session", {
          statusCode: 200,
          body: { user },
        }).as("next-auth");

        /** Generate Session Data */
        const sessionToken = genRanHex(24);
        const sessionId = genRanHex(24);

        /** Construct the Type-Safe document
         * this matches the 'NextAuthSession' interface in cypress.config.ts
         */
        const sessionDoc = {
          _id: sessionId,
          sessionToken: sessionToken,
          userId: Cypress.env("databaseUserId") // this string will be converted to ObjectId by the task
        }

        /* Insert into DB and set Cookie */
        cy.task('db:insert', sessionDoc).then(() => {
          cy.setCookie("next-auth.session-token", sessionToken, {
            path: '/', // ensures the session token is available across all routes
            secure: false,
            httpOnly: true,
          });

          cy.log(`Successfully injected session for ${user.email}`);
        });
      });
    });
  });
});

// Custom command to logout of the site
Cypress.Commands.add("logout", () => {
  cy.get('[data-cy="auth-button"]').contains("Sign out").click();

  // verify we are at the login page
  cy.url().should('eq', 'http://localhost:3000/');

  // clear Cypress Session cache.
  Cypress.session.clearAllSavedSessions();
});

// Custom command to login to the site
Cypress.Commands.add('login', () => {
  // use a unique key so the cache is reliable
  const sessionKey = Cypress.env("databaseUserId");
  
  // session will cache the state so it doesn't have to run the login command again
  cy.session(sessionKey, () => {
    // perform login
    cy.loginByGoogleApi();
    
    // verify the login worked before finishing the session to avoid caching failed login state
    cy.visit('/');
    cy.get('[data-cy="auth-button"]', { timeout: 2000 }).contains("Sign out");
  }, {
    // validate every time the session is restored
    validate() {
      cy.request('/api/auth/session').its('status').should('eq', 200);
    }
  });
});
