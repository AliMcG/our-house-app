describe('Site navigation', () => {
  beforeEach(() => {
    cy.login();
    cy.visit('/');
  });

  afterEach(() => {
    cy.logout()
  })

  it('should navigate to the home/dashboard page', () => {
    cy.get('#main-navigation-menu')
    .contains('Dashboard')
    .should('be.visible')
    .click();

    cy.get('h1', { timeout: 10000 }).should('contain', 'Dashboard');
    cy.url().should('include', '/home');
  });

  it('visit Shopping list page', () => {
    cy.visit('/shopping-lists')
    cy.url().should('include', '/shopping-lists')
  })
  it('visit Chores page', () => {
    cy.visit('/chores')
    cy.url().should('include', '/chores')
  })
}) 