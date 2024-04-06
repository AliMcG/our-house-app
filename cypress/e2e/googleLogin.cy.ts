describe('Logging In', () => {
  it('should login with google', () => {
    // Start from the index page
    cy.visit('http://localhost:3000/')
    cy.loginByGoogleApi()

    cy.wait(5000)
    cy.visit('http://localhost:3000/home')

  })
})