context("Groups", () => {
  before(() => {
    cy.visit("/login");
    cy.get("#signout").should(signout => {
      signout.click();
    })
  });

  it("Creating a group", () => {
    cy.visit("/groups");
  });
})
