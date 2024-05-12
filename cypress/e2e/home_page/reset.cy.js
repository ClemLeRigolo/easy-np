context('reset', () => {
  beforeEach(() => {
    cy.logout();
    cy.visit("/");
  });

  it("Reset password", () => {
    cy.get('[data-cy="reset"]').click();
    cy.get('input[name="email"]').type('reset.password@grenoble-inp.org');
    cy.get('form').submit();
    cy.contains('Un e-mail de réinitialisation a été envoyé');
    cy.get('button').click();
  });
});
