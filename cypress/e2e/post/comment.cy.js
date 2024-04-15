context("Testing comments", () => {
  describe("User connected", () => {
    before(() => {
      cy.logout();
      cy.visit("/login");
      cy.fillLogin("user.username@grenoble-inp.org", "Password!");
      cy.get("form").submit();
    });

    beforeEach(() => {
      cy.visit("/");
    });
    
    it("Commenting", () => {
      const post = cy.getPostByText("Groupe Général : commentaires");
      post.within(() => {
        // commenting
        cy.get('button[data-cy="comment"]').click();
        cy.get('.comment-input').find('input').type("Comment1");
        cy.get('.comment-input').find('button').click();
        cy.openComments();
        // commenting the first comment
        cy.get('button[data-cy="commentReply"]').first().click();
        cy.get('button[data-cy="commentReplyResponse"]').click();
        cy.contains("Response").should("not.exist");
        cy.get('input[data-cy="commentReply"]').first().type("Response");
        cy.get('button[data-cy="commentReplyPost"]').click();
        cy.get('button[data-cy="commentReplyResponse"]').click();
        cy.contains("Response");
      });
    });
  });
});
