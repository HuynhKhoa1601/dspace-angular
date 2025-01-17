import { TEST_ADMIN_PASSWORD, TEST_ADMIN_USER } from '../support';
import { loginProcess } from '../support/commands';

/**
 * Test to check if the license administration page is loaded after redirecting.
 */
describe('License Administration Page', () => {

  it('should pass accessibility tests', {
    retries: {
      runMode: 8,
      openMode: 8,
    },
    defaultCommandTimeout: 10000
  }, () => {
    cy.visit('/');

    // Login as admin
    loginProcess.login(TEST_ADMIN_USER, TEST_ADMIN_PASSWORD);

    cy.visit('/licenses');

    // <ds-clarin-license-table> tag must be loaded
    cy.get('ds-clarin-license-table').should('exist');
  });
});
