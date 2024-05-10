context('Testing urls', () => {
  describe("User connected", () => {
    before(() => {
      cy.logout();
      cy.visit("/login");
      cy.fillLogin("user.username@grenoble-inp.org", "Password!");
      cy.get("form").submit();
      cy.contains("Easy");
    });

    it("going back to login", () => {
      cy.visit("/login");
      cy.wait(100);
      cy.url().should("eq", `${Cypress.config().baseUrl}/`);
    });


    it("going back to signup", () => {
      cy.visit("/signup");
      cy.wait(100);
      cy.url().should("eq", `${Cypress.config().baseUrl}/`);
    });


    it("going back to reset", () => {
      cy.visit("/reset");
      cy.wait(100);
      cy.url().should("eq", `${Cypress.config().baseUrl}/`);
    });
 
    it("going to profile", () => {
      cy.visit("/profile");
      cy.wait(100);
      cy.url().should("eq", `${Cypress.config().baseUrl}/profile`);
    });

    it("going to unknown link", () => {
      cy.visit("/unknown-link");
      cy.wait(100);
      cy.url().should("eq", `${Cypress.config().baseUrl}/`);
    });

    it("going back to verify", () => {
      cy.visit("/verify");
      cy.wait(500);
      cy.url().should("eq", `${Cypress.config().baseUrl}/home`);
    });
  });

  describe("User disconnected", () => {
    before("user disconnected", () => {
      cy.logout();
      cy.visit("/");
    });

    it("main url", () => {
      cy.visit("/");
      cy.wait(100);
      cy.url().should("eq", `${Cypress.config().baseUrl}/login`);
    });

    it("going back to login", () => {
      cy.visit("/login");
      cy.wait(100);
      cy.url().should("eq", `${Cypress.config().baseUrl}/login`);
    });


    it("going back to signup", () => {
      cy.visit("/signup");
      cy.wait(100);
      cy.url().should("eq", `${Cypress.config().baseUrl}/signup`);
    });

    it("going back to reset", () => {
      cy.visit("/reset");
      cy.wait(100);
      cy.url().should("eq", `${Cypress.config().baseUrl}/reset`);
    });
 
    it("going to profile", () => {
      cy.visit("/profile");
      cy.wait(100);
      cy.url().should("eq", `${Cypress.config().baseUrl}/login`);
    });

    it("going back to verify", () => {
      cy.visit("/verify");
      cy.wait(100);
      cy.url().should("eq", `${Cypress.config().baseUrl}/login`);
    });

    it("going to unknown link", () => {
      cy.visit("/unknown-link");
      cy.wait(100);
      cy.url().should("eq", `${Cypress.config().baseUrl}/login`);
    });

  });
});
