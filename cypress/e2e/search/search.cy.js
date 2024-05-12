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
        cy.get('#n-search').type('phelma')
        // type on enter
        cy.get('#n-search').type('{enter}')
        // check if the url is correct
        cy.url().should('eq', `${Cypress.config().baseUrl}/search?s=phelma`)
        // check if a post contains "post" in the text
        cy.get('[data-cy="post"]').should('contain', 'Phelma')
        // interact with the post
        cy.likePost()
        cy.get(".post").contains("Phelma").parents(".post").find(".post-comment-btn").click()
        cy.get(".post").contains("Phelma").parents(".post").find(".comment-input-field").type("Salut mon post")
        cy.get(".post").contains("Phelma").parents(".post").find(".comment-btn").click()
        cy.openComments()
        cy.get(".post").contains("Salut mon post").parents(".post").find(".post-like-btn").click()
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

  describe("search for everything", () => {
    beforeEach(() => {
      cy.logout()
      cy.visit('/')
      cy.fillLogin('user.username@grenoble-inp.org', 'Password!')
      cy.get('form').submit()
    })
  
    it('Search everything', () => {
        // type "post" in #n-search
        cy.get('#n-search').type('a')
        // type on enter
        cy.get('#n-search').type('{enter}')
        // check if the url is correct
        cy.url().should('eq', `${Cypress.config().baseUrl}/search?s=a`)
        // check if a post contains "post" in the text
        cy.get('.course-navigation').contains('Evenements').click()
        cy.wait(200)
        cy.get('.course-navigation').contains('Groupes').click()
        cy.wait(200)
        cy.get('.course-navigation').contains('Cours').click()
        cy.wait(200)
        cy.get('.course-navigation').contains('Personnes').click()
        cy.wait(200)
    }
    )
  })

  describe("Search for a post to delete it", () => {
    beforeEach(() => {
      cy.logout()
      cy.visit('/')
      cy.fillLogin('user.username@grenoble-inp.org', 'Password!')
      cy.get('form').submit()
    })

    it('Search for a post to delete it', () => {
      cy.visit('/')
      // type "post" in #n-search
      cy.addPost('supprime moi ça')
      cy.get('#n-search').type('supprime')
      // type on enter
      cy.get('#n-search').type('{enter}')
      // check if the url is correct
      cy.url().should('eq', `${Cypress.config().baseUrl}/search?s=supprime`)
      // check if a post contains "post" in the text
      cy.get('[data-cy="post"]').should('contain', 'supprime')
      // delete the post
      cy.getPostByText('supprime moi ça').within(() => {
        cy.get('[data-cy="postOptions"]').click()
        cy.get('div[class*="menu-delete"]').click()
      })
      cy.contains('Delete me').should('not.exist')
    })
  })

  describe("Search for an event and interact with it", () => {
    beforeEach(() => {
      cy.logout()
      cy.visit('/')
      cy.fillLogin('user.username@grenoble-inp.org', 'Password!')
      cy.get('form').submit()
    })

    it('Search for an event and interact with it', () => {
      cy.visit('/')
      // type "post" in #n-search
      cy.get('#n-search').type('évènement')
      // type on enter
      cy.get('#n-search').type('{enter}')
      // check if the url is correct
      cy.url().should('eq', `${Cypress.config().baseUrl}/search?s=%C3%A9v%C3%A8nement`)
      // check if a post contains "post" in the text
      cy.get('.course-navigation').contains('Evenements').click()
      cy.wait(200)//like the event who contains the text "Un évènement à ne pas louper"
      cy.get(".post").contains("Un évènement à ne pas louper").parents(".post").find(".post-like-btn").click()
      //check if the event is liked
      cy.get(".post").contains("Un évènement à ne pas louper").parents(".post").find(".post-like-btn").should("have.class", "liked")
      //add a comment to the event who contains the text "Un évènement à ne pas louper"
      cy.get(".post").contains("Un évènement à ne pas louper").parents(".post").find(".post-comment-btn").click()
      cy.get(".post").contains("Un évènement à ne pas louper").parents(".post").find(".comment-input-field").type("Je le louperai pas")
      cy.get(".post").contains("Un évènement à ne pas louper").parents(".post").find(".comment-btn").click()
      //check if the comment is here
      cy.wait(200)
      cy.get(".post").contains("Un évènement à ne pas louper").parents(".post").find(".comments").click()
      cy.get(".post").contains("Un évènement à ne pas louper").parents(".post").find(".comment").should("contain", "Je le louperai pas")
    })
  })

  describe("Search for an user and subscribe to him", () => {
    beforeEach(() => {
      cy.logout()
      cy.visit('/')
      cy.fillLogin('user.username@grenoble-inp.org', 'Password!')
      cy.get('form').submit()
    })

    it('Search for an user and subscribe to him', () => {
      cy.visit('/')
      // type "post" in #n-search
      cy.get('#n-search').type('ensimag')
      // type on enter
      cy.get('#n-search').type('{enter}')
      // check if the url is correct
      cy.url().should('eq', `${Cypress.config().baseUrl}/search?s=ensimag`)
      // click on the button into .course-navigation who contains "Cours"
      cy.get('.course-navigation').contains('Personnes').click()
      // Click on .follow-button in the first user-searched
      cy.get('.user-searched').first().find('.follow-btn').click();
      // check if the button is now .unfollow-button
      cy.get('.user-searched').first().find('.unfollow-btn').should('exist');
      // now click on .unfollow-button
      cy.get('.user-searched').first().find('.unfollow-btn').click();
      // check if the button is now .follow-button
      cy.get('.user-searched').first().find('.follow-btn').should('exist');
    })
  })

  describe("Search for something and then search for something else", () => {
    beforeEach(() => {
      cy.logout()
      cy.visit('/')
      cy.fillLogin('user.username@grenoble-inp.org', 'Password!')
      cy.get('form').submit()
    })

    it('Search for something and then search for something else', () => {
      cy.visit('/')
      // type "post" in #n-search
      cy.get('#n-search').type('ensimag')
      // type on enter
      cy.get('#n-search').type('{enter}')
      // check if the url is correct
      cy.url().should('eq', `${Cypress.config().baseUrl}/search?s=ensimag`)
      // click on the button into .course-navigation who contains "Cours"
      cy.get('.course-navigation').contains('Personnes').click()
      // Click on .follow-button in the first user-searched
      cy.get('.user-searched').first().find('.follow-btn').click();
      // check if the button is now .unfollow-button
      cy.get('.user-searched').first().find('.unfollow-btn').should('exist');
      // now type "post" in #n-search
      cy.get('#n-search').type('post')
      // type on enter
      cy.get('#n-search').type('{enter}')
      // check if the url is correct
      cy.url().should('eq', `${Cypress.config().baseUrl}/search?s=post`)
      // check if a post contains "post" in the text
      cy.get('[data-cy="post"]').should('contain', 'post')
    })
  })
})