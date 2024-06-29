

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