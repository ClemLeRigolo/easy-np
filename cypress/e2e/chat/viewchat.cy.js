context('View Chats', () => {
  before(() => {
    cy.logout()
    cy.visit('/')
    cy.fillLogin('user.username@grenoble-inp.org', 'Password!')
    cy.get('form').submit()
  });

  beforeEach(() => {
    cy.visit('/chat')
  });

  it('Notifications from someone', () => {
    cy.get('nav [data-cy="navChat"]').contains('1').should('exist')
    cy.get('nav [data-cy="navChat"]').click()
    cy.url().should('eq', `${Cypress.config().baseUrl}/chat`)
    cy.get('[data-cy="chatWith"]').contains('Read')
  });

  it('Search from chats', () => {
    cy.get('[data-cy="search"]').type('Se')
    cy.get('[data-cy="resultSearch"]').contains('Send').should('exist')
    cy.get('[data-cy="search"]').type('d')
    cy.get('[data-cy="resultSearch"]').should('not.exist')
  })

  it('Read chats', () => {
    cy.get('[data-cy="chatWith"]').contains('Send').click()
    cy.contains('Je vais bien et toi ?').should('exist')
  })

  it('Click on chats', () => {
    cy.get('[data-cy="chatWith"]').contains('Send').click()
    cy.contains('Bonjour ! Comment vas tu ?').click()
  });
});

