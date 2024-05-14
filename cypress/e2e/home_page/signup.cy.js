context('Signup page', () => {
  beforeEach(() => {
    cy.logout()
    cy.visit("/signup")
  })

  it("Create an account", () => {
    const password = "Password!"
    cy.signup("Another", "User", "another.user@grenoble-inp.org", password, password)
    cy.intercept("POST", "*signupNewUser?*", req => {
      req.destroy()
    }).as("New User")
    cy.get("form").submit()
  })

  it("Create an account for phelma", () => {
    const password = "Password!"
    cy.signup("Firstname", "FamillyName", "Firstname.FamillyNamePhelma@grenoble-inp.org", password, password)
    cy.get('form div[data-cy="schoolChoose"] input[value="phelma"]').parent().click()
    cy.intercept("POST", "*signupNewUser?*", req => {
      req.destroy()
    }).as("New User")
    cy.get("form").submit()
  })

  it("Create an account for ense3", () => {
    const password = "Password!"
    cy.signup("Firstname1", "FamillyName", "Firstname.FamillyNameEnse3@grenoble-inp.org", password, password)
    cy.get('form div[data-cy="schoolChoose"] input[value="ense3"]').parent().click()
    cy.intercept("POST", "*signupNewUser?*", req => {
      req.destroy()
    }).as("New User")
    cy.get("form").submit()
  })

  it("Create an account for esisar", () => {
    const password = "Password!"
    cy.signup("Firstname3", "FamillyName", "Firstname.FamillyNameEsisar@grenoble-inp.org", password, password)
    cy.get('form div[data-cy="schoolChoose"] input[value="esisar"]').parent().click()
    cy.intercept("POST", "*signupNewUser?*", req => {
      req.destroy()
    }).as("New User")
    cy.get("form").submit()
  })

  it("Create an account for gi", () => {
    const password = "Password!"
    cy.signup("Firstname4", "FamillyName", "Firstname.FamillyNameGI@grenoble-inp.org", password, password)
    cy.get('form div[data-cy="schoolChoose"] input[value="gi"]').parent().click()
    cy.intercept("POST", "*signupNewUser?*", req => {
      req.destroy()
    }).as("New User")
    cy.get("form").submit()
  })

  it("Create an account for pagora", () => {
    const password = "Password!"
    cy.signup("Firstname5", "FamillyName", "Firstname.FamillyNamePagora@grenoble-inp.org", password, password)
    cy.get('form div[data-cy="schoolChoose"] input[value="pagora"]').parent().click()
    cy.intercept("POST", "*signupNewUser?*", req => {
      req.destroy()
    }).as("New User")
    cy.get("form").submit()
  })

  it("Create an account for polytech", () => {
    const password = "Password!"
    cy.signup("Firstname6", "FamillyName", "Firstname.FamillyNamePolytech@grenoble-inp.org", password, password)
    cy.get('form div[data-cy="schoolChoose"] input[value="polytech"]').parent().click()
    cy.intercept("POST", "*signupNewUser?*", req => {
      req.destroy()
    }).as("New User")
    cy.get("form").submit()
  })

  it("Create an account for iae", () => {
    const password = "Password!"
    cy.signup("Firstname7", "FamillyName", "Firstname.FamillyNameIAE@grenoble-inp.org", password, password)
    cy.get('form div[data-cy="schoolChoose"] input[value="iae"]').parent().click()
    cy.intercept("POST", "*signupNewUser?*", req => {
      req.destroy()
    }).as("New User")
    cy.get("form").submit()
  })

  it("Create an existed account 1", () => {
    const password = "Password!"
    cy.signup("User", "UserName", "user.username@grenoble-inp.org", password, password)
    cy.get("form").submit()
    cy.get("form").contains("Erreur")
  })

  it("Create an existed account 2", () => {
    const password = "Password!"
    cy.signup("Firstname", "FamillyName", "user.username@grenoble-inp.org", password, password)
    cy.get("form").submit()
    cy.get("form").contains("Erreur")
  })

  it("Create an existed account 3", () => {
    const password = "DifferentPassword!"
    cy.signup("Verified", "User", "user.username@grenoble-inp.org", password, password)
    
    cy.intercept("POST", "**").as("New User")
    cy.get("form").submit()
    cy.get("form").contains("Erreur")
  })

  it("Missing fields", () => {
    cy.get("p.error").should("not.exist")
    cy.get("form").submit()
    cy.get("p.error")
    // only name
    cy.get('input[name="name"]').type("Firstname")
    cy.get("p.error").should("not.exist")
    cy.get("form").submit()
    cy.get("p.error")
    // adding lastname
    cy.get('input[name="surname"]').type("Lastname")
    cy.get("p.error").should("not.exist")
    cy.get("form").submit()
    cy.get("p.error")
    // adding email
    cy.get('input[name="email"]').type("email@grenoble-inp.org")
    cy.get("p.error").should("not.exist")
    cy.get("form").submit()
    cy.get("p.error")
    // removing a name
    cy.get('input[name="name"]').clear()
    cy.get("p.error").should("not.exist")
    cy.get("form").submit()
    cy.get("p.error")
  })

  it("Create an account with a weak password", () => {
    cy.signup("Weak", "Password", "email@grenoble-inp.org", "weak", "weak")
    cy.get("form").submit()
    cy.get("p.error").contains("Erreur: Le mot de passe doit contenir au moins 8 caractères")
  })

  // TODO : add me when the email validation will be implemented
  // it("Create an account with a different email", () => {
  //   cy.signup("Different", "Email", "email@domaine.com", "Password!", "Password!")
  //   cy.get("form").submit()
  //   cy.get("p.error").contains("Erreur: Email invalide")
  // })
})

