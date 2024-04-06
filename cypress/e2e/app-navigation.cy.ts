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
  })
  it('visit Shopping list page', () => {
    cy.visit('http://localhost:3000/shoppingLists')
  })
  it('visit Chores page', () => {
    cy.visit('http://localhost:3000/chores')
  })
})