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
      cy.get('[data-cy="discussion"]').click()
      cy.contains('Examen bientôt !')
    })

    it('Checking TD', () => {
      cy.get('[data-cy="tds"]').click()
      cy.contains('TD1')
    })

    it('Checking TP', () => {
      cy.get('[data-cy="tps"]').click()
      cy.contains('TP1')
    })

    it('Checking exams', () => {
      cy.get('[data-cy="exams"]').click()
      cy.contains('Examen')
    })

    it('Checking fiches', () => {
      cy.get('[data-cy="fiches"]').click()
      cy.contains('Fiche')
    })
  })

})
