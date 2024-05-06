context('Groups', () => {
  before(() => {
    cy.logout()
    cy.visit('/')
    cy.fillLogin('user.username@grenoble-inp.org', 'Password!')
    cy.get('form').submit()
    cy.visit('/groups')
    cy.viewport(1200, 600)
  })

  it('Going to public saloon in Général', () => {
    cy.visit('/');
    cy.get('[data-cy="navGroup"]').within(() => {
      cy.contains('Général').click()
    })
    cy.goToSalon('Public')
    cy.contains('Salon Public : post 1');
    cy.contains('Salon Public : post 2');
  })

  it('Going to an admin saloon in Général', () => {
    cy.visit('/');
    cy.get('[data-cy="navGroup"]').within(() => {
      cy.contains('Général').click()
    })
    cy.goToSalon('Admin')
    cy.contains('Salon Admin : post 1')
  })

  it('Going to event saloon in Général', () => {
    cy.visit('/');
    cy.get('[data-cy="navGroup"]').within(() => {
      cy.contains('Général').click()
    })
    cy.goToSalon('Événements')
    cy.url().should('contain', 'events')
  })

  it('Going to a private group ici c imag', () => {
    cy.visit('/');
    cy.get('[data-cy="navGroup"]').within(() => {
      cy.contains('Ici c\'est l\'Imag').click()
      cy.contains('Général').click()
    })
    cy.contains('Ici c\'est l\'imag : post 1')
  })

})
