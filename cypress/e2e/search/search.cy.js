context('Testing search', () => {
  describe("search for a post", () => {
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

  describe("search for a course", () => {
    beforeEach(() => {
      cy.logout()
      cy.visit('/')
      cy.fillLogin('user.username@grenoble-inp.org', 'Password!')
      cy.get('form').submit()
    })

    it('Search for a course', () => {
        // type "course" in #n-search
        cy.get('#n-search').type('java')
        // type on enter
        cy.get('#n-search').type('{enter}')
        // check if the url is correct
        cy.url().should('eq', `${Cypress.config().baseUrl}/search?s=java`)
        // click on the button into .course-navigation who contains "Cours"
        cy.get('.course-navigation').contains('Cours').click()
        // Check if all the element contains "java", the are in .course divs who contains a h3 and a p and only one of the two contains "java"
        cy.get('.course').each(($el) => {
          cy.wrap($el).then(($course) => {
            const heading = $course.find('h3').text();
            const paragraph = $course.find('p').text();
        
            expect(heading.toLowerCase().includes('java') || paragraph.toLowerCase().includes('java')).to.be.true;
          });
        });
    }
    )
  })
}
)