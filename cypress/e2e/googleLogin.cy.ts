describe('Logging In', () => {
  it('should login with google', () => {
    // Start from the index page
    cy.visit('http://localhost:3000/')
    cy.loginByGoogleApi()
    cy.visit('http://localhost:3000/home')
 
    // Find a link with an href attribute containing "blog" and click it
    // cy.get('[data-cy="/add"]').click()
  })
})