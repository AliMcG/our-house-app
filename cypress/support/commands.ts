/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-namespace */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
/* eslint-disable @typescript-eslint/no-unsafe-assignment */

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

Cypress.Commands.add("loginByGoogleApi", () => {
  cy.log("Logging in to Google");
  /** Programmatically logs into Google
   * https://docs.cypress.io/guides/end-to-end-testing/google-authentication#Custom-Command-for-Google-Authentication
   */
  /** Requests an access_token from the google.api */
  cy.request({
    method: "POST",
    url: "https://www.googleapis.com/oauth2/v4/token",
    body: {
      grant_type: "refresh_token",
      client_id: Cypress.env("googleClientId"),
      client_secret: Cypress.env("googleClientSecret"),
      refresh_token: Cypress.env("googleRefreshToken"),
    },
  }).then(({ body }) => {
    const { access_token } = body;

    /** Use the access_token to request the user details */
    cy.request({
      method: "GET",
      url: "https://www.googleapis.com/oauth2/v3/userinfo",
      headers: { Authorization: `Bearer ${access_token}` },
    }).then(({ body }) => {
      const user = body;

      /** Intercepts the auth api call to return the session user.
       * https://www.youtube.com/watch?v=SzhulGxprCw
       */
      cy.intercept("api/auth/session", (req) => {
        req.reply({
          status: 200,
          body: {
            user,
          },
        });
      }).as("next-auth");
      /** Generates random values for session */
      const sessionCookie = genRanHex(24)
      const sessionId = genRanHex(24)
      /** Post a new session to the database to be authenticated by nextAuth in the browser this. */
      cy.task('db:insert', {
        _id: sessionId,
        sessionToken: sessionCookie,
        userId: Cypress.env("databaseUserId"),
      }).then(() => {
        /** OnSuccessfully updating the database with new session, sets the cookie with the new session. */
        cy.setCookie("next-auth.session-token", sessionCookie);
      })
    });
  });
})

// Custom command to logout of the site
Cypress.Commands.add("logout", () => {
  cy.log("Logging out of site");
  // we need to be more specific with selection here
  cy.get('[data-cy="auth-button"]').contains("Sign out").click();
})


// Custom command to login to the site
Cypress.Commands.add('login', () => {
  cy.session([], () => {
    cy.visit('http://localhost:3000/')
    cy.loginByGoogleApi()
    cy.wait(3000)
  })
})
