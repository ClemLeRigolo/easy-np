context('Testing urls', () => {
  describe("User connected", () => {
    beforeEach(() => {
      cy.visit("/");
      cy.login("user.username@grenoble-inp.org", "Password!");
      cy.get("form").submit();
    });

    afterEach(() => {
      cy.get("nav").find("#signout").click();
    });

    it("going back to login", () => {
      cy.visit("/login");
      cy.url().should("eq", `${Cypress.config().baseUrl}/`);
    });

    it("going back to verify", () => {
      cy.visit("/verify");
      cy.url().should("eq", `${Cypress.config().baseUrl}/`);
    });

    it("going back to signup", () => {
      cy.visit("/signup");
      cy.url().should("eq", `${Cypress.config().baseUrl}/`);
    });


    it("going back to reset", () => {
      cy.visit("/reset");
      cy.url().should("eq", `${Cypress.config().baseUrl}/`);
    });
 
    it("going to profile", () => {
      cy.visit("/profile");
      cy.url().should("eq", `${Cypress.config().baseUrl}/profile`);
    });

    it("going to unknown link", () => {
      cy.visit("/unknown-link");
      cy.url().should("eq", `${Cypress.config().baseUrl}/`);
    });
  });

  describe("User disconnected", () => {
    beforeEach(() => {
      cy.visit("/");
    });

    it("going back to login", () => {
      cy.visit("/login");
      cy.url().should("eq", `${Cypress.config().baseUrl}/login`);
    });

    it("going back to verify", () => {
      cy.visit("/verify");
      cy.url().should("eq", `${Cypress.config().baseUrl}/`);
    });

    it("going back to signup", () => {
      cy.visit("/signup");
      cy.url().should("eq", `${Cypress.config().baseUrl}/signup`);
    });


    it("going back to reset", () => {
      cy.visit("/reset");
      cy.url().should("eq", `${Cypress.config().baseUrl}/`);
    });
 
    it("going to profile", () => {
      cy.visit("/profile");
      cy.url().should("eq", `${Cypress.config().baseUrl}/`);
    });

    it("going to unknown link", () => {
      cy.visit("/unknown-link");
      cy.url().should("eq", `${Cypress.config().baseUrl}/`);
    });
  });
});
