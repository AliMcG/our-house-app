describe('Site navigation', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/')
    cy.loginByGoogleApi()
    cy.wait(2000)
  })

  afterEach(() => {
    cy.logout()
  })

  it('visit home page', () => {
    cy.visit('http://localhost:3000/home')
    cy.url().should('include', '/home')
  })
  it('visit Shopping list page', () => {
    cy.visit('http://localhost:3000/shoppingLists')
    cy.url().should('include', '/shoppingLists')
  })
  it('visit Chores page', () => {
    cy.visit('http://localhost:3000/chores')
    cy.url().should('include', '/chores')
  })
})