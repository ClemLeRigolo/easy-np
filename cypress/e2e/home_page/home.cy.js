context('Home', () => {
  beforeEach(() => {
    cy.logout();
    cy.visit("/");
  });

  it("Connection to an account", () => {
    cy.fillLogin("user.username@grenoble-inp.org", "Password!");
    cy.get("form").submit();
    cy.wait(100);
    cy.get('[data-cy="profileButton"]').click();
    cy.get('[data-cy="logout"]').click();
  });

  it("Wrong password", () => {
    cy.fillLogin("user.username@grenoble-inp.org", "WrongPassword");
    cy.get("form").submit();
    cy.contains("Incorrect email/password");
  });

  it("Wrong email", () => {
    cy.fillLogin("unknown.user@grenoble-inp.org", "Password!");
    cy.get("form").submit();
    cy.contains("Incorrect email/password");
  });

  it("Password forgetten", () => {
    cy.get("div[class='login']").contains("Mot de passe oublié ?").click();
    cy.url().should("eq", `${Cypress.config().baseUrl}/reset`);
    cy.contains("Réinitialiser");
  });

  it("Create an account", () => {
    cy.get("div[class='login']").contains("Créer un compte").click();
    cy.url().should("eq", `${Cypress.config().baseUrl}/signup`);
    cy.contains("Inscription");
  });
});
