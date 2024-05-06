context('Check Courses', () => {
  before(() => {
    cy.logout()
    cy.visit('/login')
    cy.fillLogin("user.username@grenoble-inp.org", "Password!")
    cy.get("form").submit()
  })

  beforeEach(() => {
    cy.visit('/courses')
  })

  it('Opening all availables courses', () => {
    cy.get('[data-cy="firstYear"]').click()
    cy.get('[data-cy="secondYear"]').click()
    cy.get('[data-cy="secondYearCommon"]').click()
    cy.get('[data-cy="secondYearISI"]').click()
    cy.get('[data-cy="secondYearMMIS"]').click()
    cy.get('[data-cy="secondYearIF"]').click()
    cy.get('[data-cy="thirdYear"]').click()
    cy.get('[data-cy="thirdYearISI"]').click()
    cy.get('[data-cy="thirdYearMMIS"]').click()
    cy.get('[data-cy="thirdYearIF"]').click()
  })

  describe('Check a second year course', () => {
    beforeEach(() => {
      cy.get('[data-cy="secondYear"]').click()
      cy.get('[data-cy="secondYearISI"]').click()
      cy.get('[data-cy="course"]').contains('BPI').click()
    })
    it('Checkinp Discussion', () => {
    })

    it('Checking TD', () => {
    })

    it('Checking TP', () => {
    })

    it('Checking CM', () => {
    })

    it('Checking Fiche', () => {
    })
  })

})
