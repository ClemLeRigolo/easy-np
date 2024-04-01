context('Signup page', () => {
  beforeEach(() => {
    cy.logout();
    cy.visit("/signup");
  });

  it("Create an account", () => {
    const password = "Password!";
    cy.signup("Firstname", "FamillyName", "Firstname.FamillyName@grenoble-inp.org", password, password);
    cy.intercept("POST", "*signupNewUser?*", req => {
      req.destroy();
    }).as("New User");
    cy.get("form").submit();
  });

  it("Create an existed account 1", () => {
    const password = "Password!";
    cy.signup("User", "UserName", "user.username@grenoble-inp.org", password, password);
    cy.get("form").submit();
    cy.get("form").contains("Erreur");
  });

  it("Create an existed account 2", () => {
    const password = "Password!";
    cy.signup("Firstname", "FamillyName", "user.username@grenoble-inp.org", password, password);
    cy.get("form").submit();
    cy.get("form").contains("Erreur");
  });
  
  it("Create an existed account 3", () => {
    const password = "DifferentPassword!";
    cy.signup("Verified", "User", "user.username@grenoble-inp.org", password, password);
    
    cy.intercept("POST", "**").as("New User");
    cy.get("form").submit();
    cy.get("form").contains("Erreur");
  });
});

