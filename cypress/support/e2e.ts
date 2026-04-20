// ***********************************************************
// This example support/e2e.ts is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

Cypress.on('uncaught:exception', (err) => {
  // We ignore "Error in input stream" because it's a known artifact
  // of Next.js hydration/stream being interrupted by Cypress.
  if (err.message.includes('Error in input stream')) {
    return false;
  }
  // Let other actual errors still fail the tests
  return true;
});