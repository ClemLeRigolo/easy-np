context('Post from differents schools', () => {
  describe("1. Connection avec l'ensimag", () => {
    beforeEach(() => {
      cy.visit("/login");
      cy.login("ensimag@grenoble-inp.fr", "Password!");
      cy.get("form").submit();
    });

    it("View the default posts", () => {
      cy.getPostByText("Ensimag est l'une des meilleurs écoles d'ingénieur de France !").contains("Ensimag Ensimag");
      cy.getPostByText("Mon emblem est le Phénix").contains("Phelma Phelma");
      cy.get(".post").should("have.length", 2);
    })

    it("clicking on likes", () => {
      const post = cy.getPostByText("Ensimag est l'une des meilleurs écoles d'ingénieur de France !");
      cy.intercept("*", "patch").as("click");
      post.find(".post-like-btn").click();
      post.contains(" 4 Likes");
    })

    // it("Creating a post", () => {
    //   const postArea = cy.get(".postInput");
    //   postArea.find(".post-input").type("A new post !");
    //   cy.get("button[class='.post-submit-btn']");
    // })

    afterEach(() => {
      cy.get("#signout").click();
    })
  });
});
