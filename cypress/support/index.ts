// Import all custom Commands (from commands.ts) for all tests
import './commands';

// Import Cypress Axe tools for all tests
// https://github.com/component-driven/cypress-axe
import 'cypress-axe';

// Runs once before the first test in each "block"
beforeEach(() => {
  // Pre-agree to all Klaro cookies by setting the klaro-anonymous cookie
  // This just ensures it doesn't get in the way of matching other objects in the page.
  cy.setCookie('klaro-anonymous', '{%22authentication%22:true%2C%22preferences%22:true%2C%22acknowledgement%22:true%2C%22google-analytics%22:true%2C%22google-recaptcha%22:true}');
});

// For better stability between tests, we visit "about:blank" (i.e. blank page) after each test.
// This ensures any remaining/outstanding XHR requests are killed, so they don't affect the next test.
// Borrowed from: https://glebbahmutov.com/blog/visit-blank-page-between-tests/
afterEach(() => {
  cy.window().then((win) => {
    win.location.href = 'about:blank';
  });
});


// Global constants used in tests
// May be overridden in our cypress.json config file using specified environment variables.
// Default values listed here are all valid for the Demo Entities Data set available at
// https://github.com/DSpace-Labs/AIP-Files/releases/tag/demo-entities-data
// (This is the data set used in our CI environment)

// NOTE: FALLBACK_TEST_REST_BASE_URL is only used if Cypress cannot read the REST API BaseURL
// from the Angular UI's config.json. See 'getBaseRESTUrl()' in commands.ts
export const FALLBACK_TEST_REST_BASE_URL = 'http://localhost:8080/server';

// Admin account used for administrative tests
export const TEST_ADMIN_USER = Cypress.env('DSPACE_TEST_ADMIN_USER') || 'dspacedemo+admin@gmail.com';
export const TEST_ADMIN_PASSWORD = Cypress.env('DSPACE_TEST_ADMIN_PASSWORD') || 'dspace';
// Community/collection/publication used for view/edit tests
export const TEST_COLLECTION = Cypress.env('DSPACE_TEST_COLLECTION') || '282164f5-d325-4740-8dd1-fa4d6d3e7200';
export const TEST_COMMUNITY = Cypress.env('DSPACE_TEST_COMMUNITY') || '0958c910-2037-42a9-81c7-dca80e3892b4';
export const TEST_ENTITY_PUBLICATION = Cypress.env('DSPACE_TEST_ENTITY_PUBLICATION') || 'e98b0f27-5c19-49a0-960d-eb6ad5287067';
// Search term (should return results) used in search tests
export const TEST_SEARCH_TERM = Cypress.env('DSPACE_TEST_SEARCH_TERM') || 'test';
// Collection used for submission tests
export const TEST_SUBMIT_COLLECTION_NAME = Cypress.env('DSPACE_TEST_SUBMIT_COLLECTION_NAME') || 'Sample Collection';
export const TEST_SUBMIT_COLLECTION_UUID = Cypress.env('DSPACE_TEST_SUBMIT_COLLECTION_UUID') || '9d8334e9-25d3-4a67-9cea-3dffdef80144';

export const TEST_SUBMIT_CLARIAH_COLLECTION_UUID = Cypress.env('DSPACE_TEST_SUBMIT_CLARIAH_COLLECTION_UUID') || '7eb3562b-27f5-445f-8303-db771969cbff';
export const TEST_SUBMIT_USER = Cypress.env('DSPACE_TEST_SUBMIT_USER') || 'dspacedemo+submit@gmail.com';
export const TEST_SUBMIT_USER_PASSWORD = Cypress.env('DSPACE_TEST_SUBMIT_USER_PASSWORD') || 'dspace';

export const TEST_WITHDRAWN_ITEM = Cypress.env('CLARIN_TEST_WITHDRAWN_ITEM') || '921d256f-c64f-438e-b17e-13fb75a64e19';
export const TEST_WITHDRAWN_ITEM_WITH_REASON = Cypress.env('CLARIN_TEST_WITHDRAWN_ITEM_WITH_REASON') || 'ce6ceeb4-8f47-4d5a-ad22-e87b3110cc04';
export const TEST_WITHDRAWN_ITEM_WITH_REASON_AND_AUTHORS = Cypress.env('CLARIN_TEST_WITHDRAWN_ITEM_WITH_REASON_AND_AUTHORS') || 'ad27520a-98c0-40a4-bfc3-2edd857b3418';
export const TEST_WITHDRAWN_REPLACED_ITEM = Cypress.env('CLARIN_TEST_WITHDRAWN_REPLACED_ITEM') || '94c48fc7-0425-48dc-9be6-7e7087534a3d';
export const TEST_WITHDRAWN_REPLACED_ITEM_WITH_AUTHORS = Cypress.env('CLARIN_TEST_WITHDRAWN_REPLACED_ITEM_WITH_AUTHORS') || '0e9ef1cb-5b9f-4acc-a7ca-5a9a66a6ddbd';

export const TEST_WITHDRAWN_REASON = Cypress.env('CLARIN_TEST_WITHDRAWN_REASON') || 'reason';
export const TEST_WITHDRAWN_REPLACEMENT = Cypress.env('CLARIN_TEST_WITHDRAWN_REPLACEMENT') || 'new URL';
export const TEST_WITHDRAWN_AUTHORS = Cypress.env('CLARIN_TEST_WITHDRAWN_AUTHORS') || 'author1, author2';
