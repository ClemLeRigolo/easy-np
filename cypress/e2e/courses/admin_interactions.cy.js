context('Admin interactions', () => {
  before(() => {
    cy.logout()
    cy.visit('/login')
    cy.fillLogin("ensimag@grenoble-inp.org", "Password!")
    cy.get("form").submit()
  })

  beforeEach(() => {
    cy.visit('/courses')
  })

  describe('Create new courses', () => {
    beforeEach(() => {
      cy.get('[data-cy="createCourse"]').click()
      cy.get('input[name="courseTitle"]').type('New course')
      cy.get('textarea[name="courseDescription"]').type('Description')
    })

    it('Create a new course for 1st year ', () => {
      cy.get('select[name="courseYear"]').select('1')
      cy.get('button[type="submit"]').click()
    })

    describe('Create a new course for 2nd year', () => {
      beforeEach(() => {
        cy.get('select[name="courseYear"]').select('2')
      })

      it('Create a new course for ISI', () => {
        cy.get('select[name="program"]').select('ISI')
        cy.get('button[type="submit"]').click()
      })

      it('Create a new course for MMIS', () => {
        cy.get('select[name="program"]').select('MMIS')
        cy.get('button[type="submit"]').click()
      })

      it('Create a new course for IF', () => {
        cy.get('select[name="program"]').select('IF')
        cy.get('button[type="submit"]').click()
      })
    })

    describe('Create a new course for 3nd year', () => {
      beforeEach(() => {
        cy.get('select[name="courseYear"]').select('3')
      })

      it('Create a new course for ISI', () => {
        cy.get('select[name="program"]').select('ISI')
        cy.get('button[type="submit"]').click()
      })

      it('Create a new course for MMIS', () => {
        cy.get('select[name="program"]').select('MMIS')
        cy.get('button[type="submit"]').click()
      })

      it('Create a new course for IF', () => {
        cy.get('select[name="program"]').select('IF')
        cy.get('button[type="submit"]').click()
      })
    })
  })

  describe('Managing a course ressources', () => {
    beforeEach(() => {
      cy.get('[data-cy="secondYear"]').click()
      cy.get('[data-cy="secondYearISI"]').click()
      cy.get('[data-cy="course"]').contains('BPI').click()
    })
  

    // it('Delete a ressource', () => {
    //   cy.get('[data-cy="tds"]').click()
    //   cy.contains('Delete Me').parents('div[data-cy="ressource"]').within(() => {
    //     cy.get('[data-cy="menu"]').click()
    //     cy.get('[data-cy="delete"]').click()
    //   })
    // })

    it('Add a ressource', () => {
      cy.get('[data-cy="tds"]').click()
      cy.get('[data-cy="addRessource"]').click()
      cy.get('input[name="ressourceName"]').type('New ressource')
      cy.get('textarea[name="ressourceDescription"]').type('Description')
      cy.fixture('java.png').as('image')
      cy.get('input[name="files"]').selectFile("@image")
      cy.get('button[type="submit"]').click()
    })

    it('Edit the profile', () => {
      cy.get('[data-cy="edit"]').click()
      cy.get('input[name="name"]').clear().type('BPI')
      cy.get('textarea[name="bio"]').clear().type('Erreur dans le titre : pas BPI mais java !')
      cy.get('button[data-cy="apply"]').click()
    })

    // it('Change the profile picture', () => {
    //   cy.fixture('java.png').as('image')
    //   cy.get('div[data-cy="coverImg"] svg').click()
    //   cy.get('input[type="file"]').eq(1).selectFile('@image', {force: true})
    //   cy.get('div[data-cy="coverImg"] svg').click()
    // })
  })
})
