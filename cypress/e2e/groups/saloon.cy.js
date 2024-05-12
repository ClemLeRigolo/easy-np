context('Saloon', () => {
  before(() => {
    cy.logout()
    cy.visit("/")
    cy.fillLogin("ensimag@grenoble-inp.org", "Password!")
    cy.get("form").submit()
  });

  beforeEach(() => {
    cy.visit("/")
  });

  it('Create a saloon', () => {
    cy.get('[data-cy="navGroup"]').contains('Ici c\'est l\'Imag').click()
    cy.goToSalon('Général')
    cy.get('[data-cy="createSaloon"]').click()
    cy.get('input[name="saloonName"]').type('Saloon test')
    cy.get('textarea[name="description"]').type('Description test')
    cy.get('select[name="writePermission"]').select('everyone')
    cy.get('button[type="submit"]').click()
  });
});
