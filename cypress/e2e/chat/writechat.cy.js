context('Write Chat', () => {
  before(() => {
    cy.logout()
    cy.visit('/')
    cy.fillLogin('user.username@grenoble-inp.org', 'Password!')
    cy.get('form').submit()
  });

  beforeEach(() => {
    cy.visit('/chat')
  });

  it('Write a chat', () => {
    cy.get('[data-cy="chatWith"]').contains('Send').click()
    cy.get('[data-cy="messageInput"]').type('Hello world !')
    cy.get('[data-cy="send"]').click()
  });

  it('Write a chat and press enter', () => {
    cy.get('[data-cy="chatWith"]').contains('Send').click()
    cy.get('[data-cy="messageInput"]').type('Hello world 2!{enter}')
    cy.contains('Hello world 2!')
  })
});
