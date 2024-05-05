context('Creating posts', () => {
  describe('Posting group as user', () => {
    before(() => {
      cy.logout()
      cy.visit('/')
      cy.fillLogin('user.username@grenoble-inp.org', 'Password!')
      cy.get('form').submit()
    })

    beforeEach(() => {
      cy.visit('/groups')
    })

    it('Posting a message on a group', () => {
      cy.get('[data-cy="navGroup"]').within(() => {
        cy.contains('Général').click()
      })
      cy.goToSalon('Général').click()
      cy.wait(500)
      const newPost = 'New post'
      cy.contains(newPost).should('not.exist')
      cy.addPost(newPost)
      cy.contains(newPost)
    })

    it('Posting a message on a public saloon', () => {
      cy.get('[data-cy="navGroup"]').within(() => {
        cy.contains('Général').click()
      })
      cy.goToSalon('Public').click()
      cy.wait(100)
      cy.get("div[data-cy='postInput']").should('not.exist')
    })

    it('Posting a message on an admin saloon as user', () => {
      cy.get('[data-cy="navGroup"]').within(() => {
        cy.contains('Général').click()
      })
      cy.goToSalon('Admin').click()
      cy.wait(100)
      cy.contains('New post').should('not.exist')
      cy.get('div[data-cy="postInput"]').should('not.exist')
    })
  })

  describe('Posting group as admin', () => {
    before(() => {
      cy.logout()
      cy.visit('/')
      cy.fillLogin('ensimag@grenoble-inp.org', 'Password!')
      cy.get('form').submit()
    })

    it('Posting a message on an admin saloon as admin', () => {
      cy.get('[data-cy="navGroup"]').within(() => {
        cy.contains('Général').click()
      })
      cy.goToSalon('Admin').click()
      cy.wait(100)
      cy.contains('New post').should('not.exist')
      cy.addPost('New post')
      cy.contains('New post').should('exist')
    })
  })
})
