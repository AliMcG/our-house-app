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

  after(() => {
    cy.logout();
  });

  it('Visits the chores page without issue', () => {
    cy.visit('/');
  });
});