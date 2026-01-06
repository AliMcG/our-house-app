/**
 * Shopping list page test suite
 * 
 * Test LIST steps:
 * - Make sure we can visit shopping list page (without it we can't test the rest)
 * - Create new list: FUNCTIONAL TEST LIST
 *   - make sure list is created
 * - Edit: try to edit but cancel
 *   - make sure it's not edited
 * - Edit: edit list name FUNCTIONAL TEST LIST -> FUNCTIONAL TEST LIST EDITED
 *  - make sure list is edited
 * - Delete: try to delete but cancel
 *  - make sure the list is not deleted
 * - Delete: delete list
 * - make sure the list is deleted
 */

describe('Test suite for shoppinglists-route', () => {
  beforeEach(() => {
    // login to the app
    cy.login();
    cy.visit('shopping-lists');
  });
  
  after(() => {
    // make sure you logout from the app
    cy.logout();
  });

  it('visit Shopping list page', () => {
    cy.get('h1').should('contain', 'Shopping Lists');
  });
  
  it('creates new list', () => {

    // CREATE: create new list
    cy.get('[data-cy="shoppinglist-create-input"]').type('FUNCTIONAL TEST LIST')
    cy.get('[data-cy="shoppinglist-create-submit"]').click()

    // make sure the list is created
    cy.get('[data-cy="ShoppingListCard"]')
      .contains('FUNCTIONAL TEST LIST')
      .should('exist');
  });

  it('try to edit list name but cancels', () => {
    cy.get('[data-cy="ShoppingListCard"]')
      .contains('FUNCTIONAL TEST LIST')
      .parents('[data-cy="ShoppingListCard"]')
      .find('[data-cy="ShoppingListCard-edit"]')
      .click();

    // cancel list edit
    cy.get('[data-cy="confirmModal-btn-cancel"]').click()

    // make sure it's not edited
    cy.get('[data-cy="ShoppingListCard"]')
      .contains('FUNCTIONAL TEST LIST')
      .should('exist');
  });

  it('edist list name', () => {
    // EDIT: list name
    cy.get('[data-cy="ShoppingListCard"]')
      .contains('FUNCTIONAL TEST LIST')
      .parents('[data-cy="ShoppingListCard"]')
      .find('[data-cy="ShoppingListCard-edit"]')
      .click();
    
    // clear old text
    cy.get('[data-cy="confirmModal-edit-input"]').clear().type('FUNCTIONAL TEST LIST EDITED')

    // the button function text may or may not be capitalized
    cy.get('[data-cy="confirmModal-btn-Edit"]').click()

    // make sure the list is edited
    cy.get('[data-cy="ShoppingListCard"]')
      .contains('FUNCTIONAL TEST LIST EDITED')
      .should('exist');
  });

  it('tries to delete a list but cancels', () => {
    // DELETE: try to delete but cancel
    cy.get('[data-cy="ShoppingListCard"]')
      .contains('FUNCTIONAL TEST LIST EDITED')
      .parents('[data-cy="ShoppingListCard"]')
      .find('[data-cy="ShoppingListCard-delete-FUNCTIONAL TEST LIST EDITED"]')
      .click();
    
    // cancel list delete
    cy.get('[data-cy="confirmModal-btn-cancel"]').click()

    // make sure the list is not deleted
    cy.get('[data-cy="ShoppingListCard"]')
      .contains('FUNCTIONAL TEST LIST EDITED')
      .should('exist');
  });

  it('deletes a list', () => {
    // DELETE: delete list
    cy.get('[data-cy="ShoppingListCard"]')
      .contains('FUNCTIONAL TEST LIST EDITED')
      .parents('[data-cy="ShoppingListCard"]')
      .find('[data-cy="ShoppingListCard-delete-FUNCTIONAL TEST LIST EDITED"]')
      .click();
    
    // confirm list delete
    cy.get('[data-cy="confirmModal-btn-Delete"]').click()

    // make sure the list is deleted
    cy.get('[data-cy="ShoppingListCard"]')
      .contains('FUNCTIONAL TEST LIST EDITED')
      .should('not.exist');
  });
});
