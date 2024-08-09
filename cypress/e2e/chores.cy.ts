/**
 * Chores test suite
 * 
 * Test steps:
 * - Make sure we can visit the chores page
 * - Create: a new chores list
 *  - select the text input and type in "Test chores"
 *  - check that the list is created
 * - Edit: checks that we can cancel an edit action
 *  - click on the edit button
 *  - click on the "Cancel" button
 *  - make sure the chores name is not edited, should say "Test chores"
 * - Edit: lets change the chores name
 *  - click on the edit butotn
 *  - select the text input and type in "Updated test chores"
 *  - click on the "Edit" button
 *  - check that the list name has been changed to "Updated test chores"
 * - Delete: checks that we can cancel a delete action
 *  - click on the delete button
 *  - on the modal click on the "Cancel" button
 *  - check that the chores still exist
 * - Delete: deletes the list
 *  - click on the delete button
 *  - click on the "Delete" button inside the modal
 */

describe('Test suite for the Chores route', () => {
  beforeEach(() => {
    cy.login();
  });

  afterEach(() => {
    cy.logout();
  });

  it  ('Visits the chores page without issue', () => {
    cy.visit('/chores');
    cy.get('h1').should('contain', 'Chores');
  });

  it('Creates a new chores list named "Test chores"', () => {
    cy.visit('/chores');
    cy.get('[data-cy="chores-create-input').type('Test chores');
    cy.get('[data-cy="chores-create-submit').click();
    cy.get('[data-cy="ChoresCard"]').contains('Test chores').should('exist');
  });

  it('Checks that we can cancel an edit action', () => {
    cy.visit('/chores');
    // can we click the edit button
    cy.get('[data-cy="ChoresCard"]')
      .contains('Test chores')
      .parents('[data-cy="ChoresCard"]')
      .find('[data-cy="ChoresCard-editButton"]')
      .click()
    // in the edit modal coming up, lets click cancel
    cy.get('[data-cy="ConfirmModal"]')
      .find('[data-cy="confirmModal-btn-cancel"]')
      .click()
    
    // assert the modal is no longer visible
    cy.get('[data-cy="ConfirmModal"]')
      .should('not.exist')
    
    // the chores card name should still be the same
    cy.get('[data-cy="ChoresCard"]')
      .contains('Test chores')
  });

  it('Changes the chores name to "Updated test chores"', () => {
    cy.visit('/chores');
    // click on edit butotn
    cy.get('[data-cy="ChoresCard"]')
      .contains('Test chores')
      .parents('[data-cy="ChoresCard"]')
      .find('[data-cy="ChoresCard-editButton"]')
      .click()

    // find the modal input and enter new name "Updated test chores"
    cy.get('[data-cy="ConfirmModal"]')
      .find('[data-cy="confirmModal-edit-input"]')
      .clear()
      .type("Updated test chores");
    
    // confirm name change
    cy.get('[data-cy="ConfirmModal"]')
      .find('[data-cy="confirmModal-btn-Edit"]')
      .click()

    // check the card has updated name
    cy.get('[data-cy="ChoresCard"]')
      .contains('Updated test chores')
      .should('exist')
  });

  it('Checks that we cancel a delete action', () => {
    cy.visit('/chores');
    // can we click the edit button
    cy.get('[data-cy="ChoresCard"]')
      .contains('Updated test chores')
      .parents('[data-cy="ChoresCard"]')
      .find('[data-cy="ChoresCard-deleteButton"]')
      .click()

    // shows the delete modal, lets click cancel
    cy.get('[data-cy="ConfirmModal"]')
      .find('[data-cy="confirmModal-btn-cancel"]')
      .click()
    
    // assert the modal is no longer visible
    cy.get('[data-cy="ConfirmModal"]')
      .should('not.exist')
    
    // the chores card name should still be the same
    cy.get('[data-cy="ChoresCard"]')
      .contains('Updated test chores')
  });

  it('Able to delete a chores named "Updated test chores', () => {
    cy.visit('/chores');
    // can we click the edit button
    cy.get('[data-cy="ChoresCard"]')
      .contains('Updated test chores')
      .parents('[data-cy="ChoresCard"]')
      .find('[data-cy="ChoresCard-deleteButton"]')
      .click()

    // shows the delete modal, lets click cancel
    cy.get('[data-cy="ConfirmModal"]')
      .find('[data-cy="confirmModal-btn-Delete"]')
      .click()
    
    // assert the modal is no longer visible
    cy.get('[data-cy="ConfirmModal"]')
      .should('not.exist')

    // assert chores card does not exist
    cy.get('[data-cy="ChoresCard"]')
      .should('not.exist')
  });  
});