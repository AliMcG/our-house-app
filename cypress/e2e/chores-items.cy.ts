/**
 * Chores Items Test
 * 
 * Test steps:
 * - Create: a new chores list names: "Test kitchen chores"
 *  - make sure a user can go into the chores list and back out again
 * - Create: add two new chores items
 *  - a chores item named: "Mop the floor"
 *  - a chores item named: "Wash the dishes"
 * - Active: marks a chores item as completed
 *  - mark "Mop the floor" as completed
 *  - check that the text is striked through
 *  - unmark "Mop the floor" as completed
 *  - check that the text is not striked through
 * - Delete: checks that we can cancel a delete action
 *  - try to delete the "Wash the dishes" item but cancel
 *  - make sure the item is not deleted
 * - Delete: deletes the item
 *  - delete the "Wash the dishes" item
 *  - make sure the item is deleted
 * - Clean up:
 *  - delete the "Test kitchen chores" list
 */

describe('Test suite for the Chores Items route', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/chores');
  });

  afterEach(() => {
    // cy.logout();
  });

  it('Creates a new chores list named "Test kitchen chores"', () => {
    cy.get('[data-cy="chores-create-input').type('Test kitchen chores');
    cy.get('[data-cy="chores-create-submit').click();
    cy.get('[data-cy="ChoresCard"]').contains('Test kitchen chores').should('exist');
    cy.get('[data-cy="ChoresCard"]').contains('Test kitchen chores').click();
    // make sure we are at the place we want to be
    cy.url().should('include', 'chores/Test-kitchen-chores');
    cy.get('h1').should('contain', 'Test kitchen chores');
    // now navigate back
    cy.get('[data-cy="choresLink-back-button"]').click();
    cy.url().should('include', 'chores');
    cy.get('h1').should('contain', 'Chores');
  });

  // it('Adds two new chores items: "Mop the floor" and "Wash the dishes"', () => {});
  // it('Marks "Mop the floor" as completed and then unmarks it', () => {});
  // it('Tries to delete "Wash the dishes" but cancels the action', () => {});
  // it('Deletes the "Wash the dishes" item', () => {});
});