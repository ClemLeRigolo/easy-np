// ***********************************************
// This example commands.js shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })

Cypress.Commands.add('login', (email, password) => {
  cy.get("input[name='email']").type(email);
  cy.get("input[name='password']").type(password);
});

Cypress.Commands.add("signup", (firstName, name, email, password1, password2) => {
  cy.get("form").find("input[name='name']").type(firstName);
  cy.get("form").find("input[name='surname']").type(name);
  cy.get("form").find("input[name='email']").type(email);
  cy.get("form").find("input[name='password']").type(password1);
  cy.get("form").find("input[name='retype']").type(password2);
});

Cypress.Commands.add("getPostByAuthor", (author) => {
  return cy.contains(author).parent("div[data-cy='post']");
});


Cypress.Commands.add("getPostByText", (text) => {
  return cy.contains(text).parents("div[data-cy='post']");
});
