context('Poll test', () => {
  beforeEach(() => {
    cy.logout()
    cy.visit('/')
    cy.fillLogin('user.username@grenoble-inp.org', 'Password!')
    cy.get('form').submit()
    cy.get('[data-cy="navGroup"]').within(() => {
      cy.contains('Général').click()
    })
    cy.goToSalon('Général').click()
    cy.wait(100)
  })

  it('Toggle the poll button', () => {
    cy.get('[data-cy="pollInputButton"]').click()
    cy.get('[data-cy="pollOptions"]').should('exist')
    cy.get('[data-cy="pollInputButton"]').click()
    cy.wait(100)
    cy.get('[data-cy="pollOptions"]').should('not.exist')
  })

  it('Create a poll and answer it', () => {
   cy.get('[data-cy="pollInputButton"]').click()
   cy.get('[data-cy="pollOption1"]').type('Option 1')
   cy.get('[data-cy="pollOption2"]').type('Option 2')
   cy.addPost('New poll 1')
 })

  it('Create a poll with max answers and vote for the first answer', () => {
    cy.get('[data-cy="pollInputButton"]').click()
    cy.get('[data-cy="pollOption1"]').type('Option 1')
    cy.get('[data-cy="pollOption2"]').type('Option 2')
    cy.get('[data-cy="addOption"]').click()
    cy.get('[data-cy="addOption"]').click()
    cy.wait(100)
    cy.get('[data-cy="addOption"]').should('not.exist')
    cy.get('[data-cy="deleteOption4"]').click()
    cy.get('[data-cy="addOption"]').click()
    cy.get('[data-cy="pollOption3"]').type('Option 3')
    cy.get('[data-cy="pollOption4"]').type('Option 4')
    cy.addPost('New poll 2')

    cy.getPostByText('New poll 2').within(() => {
      cy.get('div[class="post-pool"] li button').first().click()
    })

    cy.getPostByText('New poll 2').within(() => {
      cy.get('div[class="post-pool"] li button').should('not.exist')
    })
  })
})
