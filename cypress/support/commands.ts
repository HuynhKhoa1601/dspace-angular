// ***********************************************
// This File is for Custom Cypress commands.
// See docs at https://docs.cypress.io/api/cypress-api/custom-commands
// ***********************************************

import { AuthTokenInfo, TOKENITEM } from 'src/app/core/auth/models/auth-token-info.model';
import { FALLBACK_TEST_REST_BASE_URL } from '.';

// Declare Cypress namespace to help with Intellisense & code completion in IDEs
// ALL custom commands MUST be listed here for code completion to work
// tslint:disable-next-line:no-namespace
declare global {
  namespace Cypress {
    interface Chainable<Subject = any> {
      /**
       * Login to backend before accessing the next page. Ensures that the next
       * call to "cy.visit()" will be authenticated as this user.
       * @param email email to login as
       * @param password password to login as
       */
      login(email: string, password: string): typeof login;
    }
  }
}

/**
 * Login user via REST API directly, and pass authentication token to UI via
 * the UI's dsAuthInfo cookie.
 * @param email email to login as
 * @param password password to login as
 */
function login(email: string, password: string): void {
  // Cypress doesn't have access to the running application in Node.js.
  // So, it's not possible to inject or load the AppConfig or environment of the Angular UI.
  // Instead, we'll read our running application's config.json, which contains the configs &
  // is regenerated at runtime each time the Angular UI application starts up.
  cy.task('readUIConfig').then((str: string) => {
    // Parse config into a JSON object
    const config = JSON.parse(str);

    // Find the URL of our REST API. Have a fallback ready, just in case 'rest.baseUrl' cannot be found.
    let baseRestUrl = FALLBACK_TEST_REST_BASE_URL;
    if (!config.rest.baseUrl) {
      console.warn("Could not load 'rest.baseUrl' from config.json. Falling back to " + FALLBACK_TEST_REST_BASE_URL);
    } else {
      console.log("Found 'rest.baseUrl' in config.json. Using this REST API for login: " + config.rest.baseUrl);
      baseRestUrl = config.rest.baseUrl;
    }

    // To login via REST, first we have to do a GET to obtain a valid CSRF token
    cy.request( baseRestUrl + '/api/authn/status' )
      .then((response) => {
        cy.log(JSON.stringify(response.body));
        // console.log('login response: ' + response);
        // We should receive a CSRF token returned in a response header
        expect(response.headers).to.have.property('dspace-xsrf-token');
        const csrfToken = response.headers['dspace-xsrf-token'];

        // Now, send login POST request including that CSRF token
        cy.request({
          method: 'POST',
          url: baseRestUrl + '/api/authn/login',
          headers: { 'X-XSRF-TOKEN' : csrfToken},
          form: true, // indicates the body should be form urlencoded
          body: { user: email, password: password }
        }).then((resp) => {
          // We expect a successful login
          expect(resp.status).to.eq(200);
          // We expect to have a valid authorization header returned (with our auth token)
          expect(resp.headers).to.have.property('authorization');

          // Initialize our AuthTokenInfo object from the authorization header.
          const authheader = resp.headers.authorization as string;
          const authinfo: AuthTokenInfo = new AuthTokenInfo(authheader);

          // Save our AuthTokenInfo object to our dsAuthInfo UI cookie
          // This ensures the UI will recognize we are logged in on next "visit()"
          cy.setCookie(TOKENITEM, JSON.stringify(authinfo));
        });
      });

  });
}
// Add as a Cypress command (i.e. assign to 'cy.login')
Cypress.Commands.add('login', login);

export const loginProcess = {
  clickOnLoginDropdown() {
    cy.get('.navbar-container .dropdownLogin ').click();
  },
  typeEmail(email: string) {
    cy.get('ds-log-in-container form input[type = "email"] ').type(email);
  },
  typePassword(password: string) {
    cy.get('ds-log-in-container form input[type = "password"] ').type(password);
  },
  submit() {
    cy.get('ds-log-in-container form button[type = "submit"] ').click();
  },
  login(email: string, password: string) {
    cy.visit('/login');
    // loginProcess.clickOnLoginDropdown();
    loginProcess.typeEmail(email);
    loginProcess.typePassword(password);
    loginProcess.submit();
    // wait for redirecting after login - end of login process
    cy.url().should('contain', '/home');
  }
};
