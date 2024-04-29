context("Groups", () => {
  describe("Public groups", () => {
    before(() => {
      cy.logout()
      cy.visit("/")
      cy.fillLogin("user.username@grenoble-inp.org", "Password!")
      cy.get("form").submit()
    })

    it("Creating a public group", () => {
      cy.visit("/groups")
      cy.wait(200)
      cy.contains("Public group Ensimag").should("not.exist")
      cy.get("[data-cy='createGroupButton']").click()
      cy.fillGroupForm("Public group Ensimag", "New group description", "Public", "ensimag")
      cy.get("[data-cy='createGroupForm']").submit()
      // checking group creation
      cy.visit("/groups")
      cy.contains("Public group Ensimag")
    })

    it("Creation a private group", () => {
      cy.visit("/groups")
      cy.wait(200)
      cy.contains("Private group Ensimag").should("not.exist")
      cy.get("[data-cy='createGroupButton']").click()
      cy.fillGroupForm("Private group Ensimag", "New group description", "Privé", "ensimag")
      cy.get("[data-cy='createGroupForm']").submit()
      cy.visit("/groups")
      cy.contains("Private group Ensimag")
    })

    it("Create two groups with the same name", () => {
      // first group
      cy.visit("/groups")
      cy.wait(200)
      cy.contains("Private group Ensimag (duplicate)").should("not.exist")
      cy.get("[data-cy='createGroupButton']").click()
      cy.fillGroupForm("Private group Ensimag (duplicate)", "New group description", "Public", "ensimag")
      cy.get("[data-cy='createGroupForm']").submit()
      // second group
      cy.visit("/groups")
      cy.get("[data-cy='createGroupButton']").click()
      cy.fillGroupForm("Private group Ensimag (duplicate)", "New group description", "Public", "ensimag")
      cy.get("[data-cy='createGroupForm']").submit()
      // FIXME : I need to be fixed
      cy.contains("Private group Ensimag (duplicate)").should("have.length", 1)
      })

    it("Create a group and delete it", () => {
      // first group
      cy.visit("/groups")
      cy.get("[data-cy='createGroupButton']").click()
      cy.fillGroupForm("Group to delete", "New group description", "Public", "ensimag")
      cy.get("[data-cy='createGroupForm']").submit()

      cy.visit("/groups")
      cy.contains("Group to delete").click()
    })

    it("Leaving a group and joining it again", () => {
      cy.visit("/groups")
      cy.contains("Ici c'est l'Imag").click()
      // joining ici c'est l'Imag
      cy.get("[data-cy='joiningGroupButton']").click()
      cy.contains("Rejoint")
      cy.contains("Quitter le groupe").click()
      cy.contains("Rejoindre")
    })
  })

  describe("Managing groups", () => {
    before(() => {
      cy.logout()
      cy.visit("/")
      cy.fillLogin("ensimag@grenoble-inp.org", "Password!")
      cy.get("form").submit()
    })

    beforeEach(() => {
      cy.visit("/groups")
      cy.contains("Général").click()
      cy.goToSalon("Général").click()
      cy.get('button[data-cy="manageGroup"]').click()
    })

    it("Changing value of a member", () => {
      cy.get('div[data-cy="manageGroup"]').within(() => {
        cy.get('li').first().within(() => {
          cy.get('select').select('admin')
          // check bd
          cy.get('select').select('member')
          // check bd
        })
      })
    })

    it("Checking a user from the panel", () => {
      cy.get('div[data-cy="manageGroup"]').within(() => {
        cy.get('li').first().within(() => {
          cy.get('a').click()
          cy.url().should('include', '/profile')
        })
      })
    })

    it("Closing the manage window", () => {
      cy.get('div[data-cy="manageGroup"]').within(() => {
        cy.get('button[data-cy="closeManageWindow"]').click()
      })
      cy.get('div[data-cy="manageGroup"]').should('not.exist')
    })

    it("Accepting someone from the waiting list", () => {
      cy.visit("/groups")
      cy.contains("Privee").click()
      cy.goToSalon("Général").click()
      cy.get('button[data-cy="manageGroup"]').click()
      cy.get('div[data-cy="manageGroup"]').within(() => {
        cy.get('button[data-cy="waitingList"]').click()
        cy.get("h3").should('have.text', 'Liste d\'attente')
        cy.get('ul[data-cy="waitingList"]').within(() => {
          cy.get('li > button[data-cy="accept"]').click()
        })
      })
    })

    it("Refusing someone from the waiting list", () => {
      cy.visit("/groups")
      cy.contains("Refuser").click()
      cy.goToSalon("Général").click()
      cy.get('button[data-cy="manageGroup"]').click()
      cy.get('div[data-cy="manageGroup"]').within(() => {
        cy.get('button[data-cy="waitingList"]').click()
        cy.get("h3").should('have.text', 'Liste d\'attente')
        cy.get('ul[data-cy="waitingList"]').within(() => {
          cy.get('li > button[data-cy="refuse"]').click()
        })
      })
    })
  })
})
