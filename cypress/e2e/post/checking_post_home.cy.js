context('Post from user from ensimag in the main thread', () => {
  before(() => {
    cy.logout();
    cy.visit("/login");
    cy.fillLogin("user.username@grenoble-inp.org", "Password!");
    cy.get("form").submit();
  });

  beforeEach(() => {
    cy.visit("/");
  });

  it("View the default posts", () => {
    cy.getPostByText("Home : post 1").contains("Ensimag Ensimag");
    cy.getPostByText("Home : post 2").contains("Phelma Phelma");
  })

  it("clicking on likes", () => {
    const post = cy.getPostByText("Home : post 1");
    post.within(() => {
      const buttonLike = post.get("[data-cy='like']");
      buttonLike.should("have.attr", "likes", "2");
      cy.likePost();
      buttonLike.should("have.attr", "likes", "3");
      cy.likePost();
    });
  })

  it("checking comments on post 1", () => {
    const post1 = cy.getPostByText("Home : post 1");
    post1.within(() => {
      cy.get("div[data-cy='commentContent']").should("not.exist");
      cy.openComments();
      cy.get("div[data-cy='commentContent']").should((comments) => {
        expect(comments.text()).length.to.be.greaterThan(0);
      })
      cy.closeComments();
      cy.get("div[data-cy='commentContent']").should("not.exist");
    });
  })

  it ("checking comments on post 2", () => {
    const post2 = cy.getPostByText("Home : post 2");
    post2.within(() => {
      cy.get("div[data-cy='toggleComments']").should("not.exist");
      post2.contains("Comment 1").should("not.exist");
    })
  })

  it("Creating a post", () => {
    cy.contains("A new post").should("not.exist");
    cy.addPost("A new post");
    cy.contains("A new post").should("exist");
  })
});
