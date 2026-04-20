/**
 * Shopping list ITEMS page test suite

 * Test ITEM steps:
 * - PREPARATION:
 *  - Navigate to the shopping lists page
 *  - Create a new shopping list(we will create the item inside of it): TESTLIST
 *  - Make sure the shopping list is created
 *  - Navigate to the shopping list items page
 * - ITEMS PAGE:
 *  - Make sure we are on the items page
 *  - Create new items (2): TESTLIST
 *    - BANANAS (x1)
 *    - EGGS (x12)
 *    - make sure item is created
 *  - ACTIVE: marks an item as completed
 *   - mark EGGS as completed
 *   - check that the text is striked through
 *   - unmark EGGS as completed
 *   - check that the text is not striked through
 *  - DELETE:
 *   - try to delete but cancel
 *   - make sure the item is not deleted
 *   - delete the item
 *   - make sure the item is deleted
 * - CLEAN UP
 *  - Delete the BANANAS item
 *  - Use the back button to return to the lists page
 *  - Navigate to the shopping lists page
 *  - Delete the shopping list: TESTLIST
 */

describe('Test suite for shoppinglists-items-route', () => {
  before(() => {
    cy.login();
    cy.visit('/shopping-lists');
  });

  after(() => {
    // clean up
    cy.visit('/shopping-lists');
    // delete the shopping list: TESTLIST
    cy.get('[data-cy="ShoppingListCard"]')
      .contains('TESTLIST')
      .parents('[data-cy="ShoppingListCard"]')
      .find('[data-cy="ShoppingListCard-delete-TESTLIST"]')
      .click()
    cy.get('[data-cy="confirmModal-btn-Delete"]').click();
    cy.logout();
  });

  it('create the shopping list card to start testing', () => {
    // create the shopping list to store the items
    cy.get('[data-cy="shoppinglist-create-input"]').type('TESTLIST')
    cy.get('[data-cy="shoppinglist-create-submit"]').click()
    cy.get('[data-cy="ShoppingListCard"]')
      .contains('TESTLIST')
      .should('exist');
  });

  
  describe('List items', () => {
    beforeEach(() => {
      cy.login();
      cy.visit('/shopping-lists');
      // lets navigate to the items page
      cy.get('[data-cy="ShoppingListCard"]')
        .contains('TESTLIST')
        .click()
    });

    it('visit Shopping list items page', () => {
      // ITEMS PAGE
      // make sure we are on the items page
      cy.url().should('match', /shopping-lists\/[a-f0-9]{24}/);
    });

    it('creates new item, edits the name and deletes it', () => {
      // CREATE: create new items
      // bananas
      cy.get('[data-cy="shoppingitem-create-input"]').type('BANANAS')
      cy.get('[data-cy="shoppingitem-create-submit"]').click()
      cy.get('[data-cy="ItemsListCard"]').contains('BANANAS x1').should('exist')
      // eggs
      cy.get('[data-cy="shoppingitem-create-input"]').type('EGGS')
      cy.get('[data-cy="shoppingitem-create-quantity"]').type('12')
      cy.get('[data-cy="shoppingitem-create-submit"]').click()
      cy.get('[data-cy="ItemsListCard"]').contains('EGGS x12').should('exist');
    });

    it('marks items as complete', () => {
      // ACTIVE: marks an item as completed
      // mark BANANAS as completed
      cy.get('[data-cy="ItemsListCard"]')
        .contains('EGGS x12')
        .parents('[data-cy="ItemsListCard"]')
        .find('[data-cy="ItemsListCard-btn-active"]')
        .click() 

      // check that the text is striked through
      cy.get('[data-cy="ItemsListCard"]')
        .contains('EGGS x12')
        .should('have.css', 'text-decoration', 'line-through')
    });

    it('unmarks item as complete', () => {
            // unmark BANANAS as completed
      cy.get('[data-cy="ItemsListCard"]')
        .contains('EGGS x12')
        .parents('[data-cy="ItemsListCard"]')
        .find('[data-cy="ItemsListCard-btn-active"]')
        .click()
      
      // check that the text is not striked through
      cy.get('[data-cy="ItemsListCard"]')
        .contains('EGGS x12')
        .should('not.have.css', 'text-decoration', 'line-through rgb(30, 41, 59)')
    });

    it('tries to deletes an item but cancels', () => {
      // DELETE: try to delete but cancel
      cy.get('[data-cy="ItemsListCard"]')
        .contains('EGGS x12')
        .parents('[data-cy="ItemsListCard"]')
        .find('[data-cy="ItemsListCard-btn-delete"]')
        .click()
      
      // cancel the delete
      cy.get('[data-cy="confirmModal-btn-cancel"]').click()
    
      // make sure the item is not deleted
      cy.get('[data-cy="ItemsListCard"]').contains('EGGS x12').should('exist')
    });

    it('deletes an item', () => {
      // DELETE: delete the item
      cy.get('[data-cy="ItemsListCard"]')
        .contains('EGGS x12')
        .parents('[data-cy="ItemsListCard"]')
        .find('[data-cy="ItemsListCard-btn-delete"]')
        .click()
      
      // confirm the delete
      cy.get('[data-cy="confirmModal-btn-Delete"]').click()

      // make sure the item is deleted
      cy.get('[data-cy="ItemsListCard"]').contains('EGGS x12').should('not.exist')
    });

    it('back button to return to the shopping lists page', () => {
      // Use the back button to return to the lists page
      cy.get('[data-cy="back-to-shoppings-lists-link"]').click();
      cy.get('[data-cy="ShoppingListCard"]')
      .contains('TESTLIST')
      .should('exist');
    });
  });
});