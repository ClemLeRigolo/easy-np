context('User interactions', () => {
  before(() => {
    cy.logout()
    cy.visit('/login')
    cy.fillLogin("user.username@grenoble-inp.org", "Password!")
    cy.get("form").submit()
  })

  beforeEach(() => {
    cy.visit('/courses')
    cy.get('[data-cy="secondYear"]').click()
    cy.get('[data-cy="secondYearISI"]').click()
    cy.get('[data-cy="course"]').contains('BPI').click()
  })

  it('Create, like and delete a post', () => {
    cy.contains('Hello World !').should('not.exist')
    cy.addPost('Hello World !')
    cy.contains('Hello World !')
    cy.getPostByText('Hello World !').within(() => {
      cy.get('[data-cy="like"]').click()
      cy.get('[data-cy="like"]').should('have.class', 'liked')
    })
  })

  it('Share a post', () => {
    cy.contains('Hello World !').should('exist')
    cy.getPostByText('Hello World !').within(() => {
      cy.get('[data-cy="share"]').click()
    })
    cy.contains('URL') 
  })

})
