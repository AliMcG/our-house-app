/**
 * Chores Items Test
 * 
 * Test steps:
 * - Create: a new chores list names: "Test kitchen chores"
 *  - make sure a user can go into the chores list and back out again
 * - Create: add two new chores items
 *  - a chores item named: "Test mop the floor"
 *  - a chores item named: "Test wash the dishes"
 * - Active: marks a chores item as completed
 *  - mark "Test mop the floor" as completed
 *  - check that the text is striked through
 *  - unmark "Test mop the floor" as completed
 *  - check that the text is not striked through
 * - Delete: checks that we can cancel a delete action
 *  - try to delete the "Test wash the dishes" item but cancel
 *  - make sure the item is not deleted
 * - Delete: deletes the item
 *  - delete the "Test wash the dishes" item
 *  - make sure the item is deleted
 * - Clean up:
 *  - delete the "Test kitchen chores" list
 */

describe('Test suite for the Chores Items route', () => {
  before(() => {
    cy.login();
    cy.visit('/chores');
  });

  after(() => {
    cy.log("================================= logging out")
    // clean up
    cy.visit('/chores');
    cy.get('[data-cy="ChoresCard"]')
      .contains('Test kitchen chores')
      .parents('[data-cy="ChoresCard"]')
      .find('[data-cy="ChoresCard-deleteButton"]')
      .click();
    cy.get('[data-cy="confirmModal-btn-Delete"]').click();
    cy.logout();
  });

  it('Creates a new chores list named "Test kitchen chores"', () => {
    cy.get('[data-cy="chores-create-input').type('Test kitchen chores');
    cy.get('[data-cy="chores-create-submit').click();
    cy.get('[data-cy="ChoresCard"]').contains('Test kitchen chores').should('exist');
    cy.get('[data-cy="ChoresCard"]').contains('Test kitchen chores').click();
    // make sure we are at the place we want to be
    cy.url().should('match', /chores\/[a-f0-9]{24}/);
    cy.get('h1').should('contain', 'Test kitchen chores');
    // now navigate back
    cy.get('[data-cy="choresLink-back-button"]').click();
    cy.url().should('include', 'chores');
    cy.get('h1').should('contain', 'Chores');
  });

  describe('Chores Items', () => {
    beforeEach(() => {
      cy.login();
      cy.visit('/chores');
      cy.get('[data-cy="ChoresCard"]').contains('Test kitchen chores').click();
    });

    it('Adds two new chores items: "Test mop the floor" and "Test wash the dishes"', () => {
      cy.get('[data-cy="choresItem-create-input').type('Test mop the floor');
      cy.get('[data-cy="choresItem-create-submit').click();
      cy.get('[data-cy="ChoresItemCard"]').contains('Test mop the floor').should('exist');
      cy.get('[data-cy="choresItem-create-input').type('Test wash the dishes');
      cy.get('[data-cy="choresItem-create-submit').click();
      cy.get('[data-cy="ChoresItemCard"]').contains('Test wash the dishes').should('exist');
    });
    
    it('Marks "Test mop the floor" as completed and then unmarks it', () => {
      // mark as completed
      cy.get('[data-cy="ChoresItemCard"]')
        .contains('Test mop the floor')
        .parents('[data-cy="ChoresItemCard"]')
        .find('[data-cy="ChoresItemCard-btn-active"]')
        .click();
      // check the completed button is greyed out
      cy.get('[data-cy="ChoresItemCard"]')
        .contains('Test mop the floor')
        .parents('[data-cy="ChoresItemCard"]')
        .find('[data-cy="ChoresItemCard-btn-active"]')
        .should('have.css', 'background-color', 'rgb(156, 163, 175)');
      // check the text is striked through
      cy.get('[data-cy="ChoresItemCard"]')
        .contains('Test mop the floor')
        .should('have.css', 'text-decoration-line', 'line-through');
      // unmark as completed
      cy.get('[data-cy="ChoresItemCard"]')
      .contains('Test mop the floor')
      .parents('[data-cy="ChoresItemCard"]')
      .find('[data-cy="ChoresItemCard-btn-active"]')
      .click();
      // check the completed button is not greyed out
      cy.get('[data-cy="ChoresItemCard"]')
        .contains('Test mop the floor')
        .parents('[data-cy="ChoresItemCard"]')
        .find('[data-cy="ChoresItemCard-btn-active"]')
        .should('not.have.css', 'text-decoration-line', 'line-through');
      // check the text is not striked through
      cy.get('[data-cy="ChoresItemCard"]')
        .contains('Test mop the floor')
        .should('not.have.css', 'text-decoration-line', 'line-through');
    });

    it('Tries to delete "Test wash the dishes" but cancels the action', () => {
      cy.get('[data-cy="ChoresItemCard"]')
        .contains('Test wash the dishes')
        .parents('[data-cy="ChoresItemCard"]')
        .find('[data-cy="ChoresItemCard-btn-delete"]')
        .click();
      cy.get('[data-cy="confirmModal-btn-cancel"]').click();
      cy.get('[data-cy="ChoresItemCard"]').contains('Test wash the dishes').should('exist');
    });

    it('Deletes the "Test wash the dishes" item', () => {
      cy.get('[data-cy="ChoresItemCard"]')
        .contains('Test wash the dishes')
        .parents('[data-cy="ChoresItemCard"]')
        .find('[data-cy="ChoresItemCard-btn-delete"]')
        .click();
      cy.get('[data-cy="confirmModal-btn-Delete"]').click();
      cy.get('[data-cy="ChoresItemCard"]').contains('Test wash the dishes').should('not.exist');
    });
  });

});