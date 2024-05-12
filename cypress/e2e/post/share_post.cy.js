context('share test', () => {
    beforeEach(() => {
      cy.logout()
      cy.visit('/')
      cy.fillLogin("user.username@grenoble-inp.org", "Password!")
      cy.get("form").submit()
    })
  
    it('click to the share button and go to the publication', () => {
        // get the first post content and then click on the share button with classname post-share-btn and go to the link and see if the content of the post is here
        cy.get('.post-body').first().invoke('text').then((text1) => {
        cy.get('.post-share-btn').first().click();
        cy.task('getClipboard').then((href) => {
            cy.visit(href);
            cy.get('.post-body').first().should('have.text', text1);
        });
        //then like the post and add a comment
        cy.likePost();
        cy.get('[data-cy="comment"]').click();
        cy.get('.comment-input-field').type('This is a comment');
        cy.get('.comment-btn').click();
        cy.openComments();
        cy.contains('This is a comment');
      });
    });
  })