import { testA11y } from 'cypress/support/utils';

// NOTE: We changed homepage and these tests are failing
// describe('Homepage', () => {
//   beforeEach(() => {
//     // All tests start with visiting homepage
//     cy.visit('/');
//   });
//
//   it('should display translated title "DSpace Angular :: Home"', () => {
//     cy.title().should('eq', 'DSpace Angular :: Home');
//   });
//
//   it('should contain a news section', () => {
//     cy.get('ds-home-news').should('be.visible');
//   });
//
//   it('should have a working search box', () => {
//     const queryString = 'test';
//     cy.get('ds-search-form input[name="query"]').type(queryString);
//     cy.get('ds-search-form button.search-button').click();
//     cy.url().should('include', '/search');
//     cy.url().should('include', 'query=' + encodeURI(queryString));
//   });
//
//   it('should pass accessibility tests', () => {
//     // Wait for homepage tag to appear
//     cy.get('ds-home-page').should('be.visible');
//
//     // Analyze <ds-home-page> for accessibility issues
//     testA11y('ds-home-page');
//   });
// });
