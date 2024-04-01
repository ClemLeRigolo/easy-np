context("Groups", () => {
  before(() => {
    cy.logout();
    cy.visit("/");
    cy.fillLogin("user.username@grenoble-inp.org", "Password!");
    cy.get("form").submit();
  });

  it("Creating a public group", () => {
    cy.visit("/groups");
    cy.wait(1000);
    cy.contains("Public group Ensimag").should("not.exist");
    cy.get("[data-cy='createGroupButton']").click();
    cy.fillGroupForm("Public group Ensimag", "New group description", "Public", "ensimag");
    cy.get("[data-cy='createGroupForm']").submit();
    // checking group creation
    cy.visit("/groups");
    cy.contains("Public group Ensimag");
  });

  it("Creation a private group", () => {
    cy.visit("/groups");
    cy.wait(1000);
    cy.contains("Private group Ensimag").should("not.exist");
    cy.get("[data-cy='createGroupButton']").click();
    cy.fillGroupForm("Private group Ensimag", "New group description", "Privé", "ensimag");
    cy.get("[data-cy='createGroupForm']").submit();
    cy.visit("/groups");
    cy.contains("Private group Ensimag");
  });

  it("Create two groups with the same name", () => {
    // first group
    cy.visit("/groups");
    cy.wait(1000);
    cy.contains("Private group Ensimag (duplicate)").should("not.exist");
    cy.get("[data-cy='createGroupButton']").click();
    cy.fillGroupForm("Private group Ensimag (duplicate)", "New group description", "Public", "ensimag");
    cy.get("[data-cy='createGroupForm']").submit();
    // second group
    cy.visit("/groups");
    cy.wait(1000);
    cy.get("[data-cy='createGroupButton']").click();
    cy.fillGroupForm("Private group Ensimag (duplicate)", "New group description", "Public", "ensimag");
    cy.get("[data-cy='createGroupForm']").submit();
    cy.wait(1000);
    // FIXME : I need to be fixed
    cy.contains("Private group Ensimag (duplicate)").should("have.length", 1);
    });
})
