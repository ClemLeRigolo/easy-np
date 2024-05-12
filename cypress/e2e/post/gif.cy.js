context('Gif test', () => {
  beforeEach(() => {
    cy.logout()
    cy.visit('/')
    cy.fillLogin("user.username@grenoble-inp.org", "Password!")
    cy.get("form").submit()
  })

  it('Create a post with a gif', () => {
    cy.get('[data-cy="gifInputButton"]').click()
    //click on the input in the class gif-search
    cy.get('.gif-search input').type('hello')
    //click on the first gif
    cy.get('.gif-search img').first().click({ force: true })
    //check if the gif is present in the post
    cy.get('.selected-gif-container img').should('exist')
    //add content to the post
    cy.addPost('New post with gif')
    //check if the post is present
    cy.contains('New post with gif')
  })
})