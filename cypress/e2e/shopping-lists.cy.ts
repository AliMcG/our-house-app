/**
 * Shopping list page test suite
 * 
 * Test LIST steps:
 * 1. Make sure we can visit shopping list page (without it we can't test the rest)
 * 2. Create new list: FUNCTIONAL TEST LIST
 * 3. Edit list name: FUNCTIONAL TEST LIST -> FUNCTIONAL TEST LIST EDITED
 * 3. Delete list
 * 
 * Test ITEM steps:
 * 1. Create new list: FUNCTIONAL TEST LIST
 * 2. Create new item: FUNCTIONAL TEST LIST ITEM
 * 3. Edit item name: FUNCTIONAL TEST LIST ITEM -> FUNCTIONAL TEST LIST ITEM EDITED
 * 4. Delete item
 */

describe('Test suite for shoppinglists-route', () => {
  before(() => {
    // login to the app
    cy.login();
    cy.visit('http://localhost:3000/shoppingLists');
  });

  after(() => {
    // make sure you logout from the app
    cy.logout();
  });

  it('creates new list', () => {
    const listName = 'FUNCTIONAL TEST LIST';
    cy.get('[data-cy="shoppinglist-create-input"]').type(`${listName} {enter}`);
    cy.get('[data-cy="ShoppingListCard"]').contains(listName);
    cy.wait(500)
  });
});

/*
describe('Test suite for shoppinglists-route', () => {
  before(() => {
    cy.visit('http://localhost:3000/')
    cy.loginByGoogleApi()
    cy.wait(2000)
  })
  
  after(() => {
    cy.logout()
  })
  
  it('visit Shopping list page, creates new list and deletes it', () => {
    cy.visit('http://localhost:3000/shoppingLists')
    cy.url().should('include', '/shoppingLists')
    cy.get('[data-cy="shoppinglist-create-input"]').type("FUNCTIONAL TEST LIST")
    cy.get('[data-cy="shoppinglist-create-submit"]').click()
    cy.get('[data-cy="ShoppingListCard"]').contains("FUNCTIONAL TEST LIST").get('[data-cy="ShoppingListCard-delete-FUNCTIONAL TEST LIST"]').click()
    cy.get('[data-cy="confirmModal-Delete"]').click()
  })
})
*/