context('Publication', () => {
  before(() => {
    cy.logout()
    cy.visit("/")
    cy.fillLogin("user.username@grenoble-inp.org", "Password!")
    cy.get("form").submit()
  });

  it('Check a publication', () => {
    cy.visit('http://localhost:3000/post/1711961773325')
    cy.contains('Groupe Général : post 1')
  })
});
