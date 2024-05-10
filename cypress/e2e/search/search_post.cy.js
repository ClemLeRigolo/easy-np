context('Search post test', () => {
    beforeEach(() => {
      cy.logout()
      cy.visit('/')
      cy.fillLogin('user.username@grenoble-inp.org', 'Password!')
      cy.get('form').submit()
    })
  
    it('Search for a post', () => {
        // type "post" in #n-search
        cy.get('#n-search').type('post')
        // type on enter
        cy.get('#n-search').type('{enter}')
        // check if the url is correct
        cy.url().should('eq', `${Cypress.config().baseUrl}/search?s=post`)
        // check if a post contains "post" in the text
        cy.get('[data-cy="post"]').should('contain', 'post')
    }
    )
  })
  