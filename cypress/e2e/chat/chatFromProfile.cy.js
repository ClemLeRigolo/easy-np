context('Chat from profile', () => {
    before(() => {
      cy.logout()
      cy.visit('/')
      cy.fillLogin('user.username@grenoble-inp.org', 'Password!')
      cy.get('form').submit()
    });
  
    it('search for a user and chat with him', () => {
        cy.visit('/')
        // type "course" in #n-search
        cy.get('#n-search').type('ensimag')
        // type on enter
        cy.get('#n-search').type('{enter}')
        // check if the url is correct
        cy.url().should('eq', `${Cypress.config().baseUrl}/search?s=ensimag`)
        // click on the button into .course-navigation who contains "Cours"
        cy.get('.course-navigation').contains('Personnes').click()
        // Click on post-avatar in the first user-searched
        cy.get('.post-avatar').first().click()
        // Check if the url is correct
        cy.url().should('match', /\/profile\/[a-zA-Z0-9]{28}$/)
        // On clique sur le bouton pour envoyer un message .profileSvg
        cy.get('.profileSvg').click()
        // Check if the url is correct
        cy.url().should('match', /\/chat\/[a-zA-Z0-9]{28}$/)
        // Send a message
        cy.get('#message-input').type('Hello')
        // Submit the form
        cy.get('#send-message-button').click()
        // Check if the message is present
        cy.contains('Hello')
    }
    )
  });
  
  