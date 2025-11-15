describe('Site navigation', () => {
  beforeEach(() => {
    cy.visit('/')
    cy.loginByGoogleApi()
    cy.wait(2000)
  })

  afterEach(() => {
    cy.logout()
  })

  it('visit home page', () => {
    cy.visit('/home')
    cy.url().should('include', '/home')
  })
  it('visit Shopping list page', () => {
    cy.visit('/shopping-lists')
    cy.url().should('include', '/shopping-lists')
  })
  it('visit Chores page', () => {
    cy.visit('/chores')
    cy.url().should('include', '/chores')
  })
}) 