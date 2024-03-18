context('Post from differents schools', () => {
  describe("Connection avec l'ensimag", () => {
    before(() => {
      cy.visit("/login");
      cy.login("ensimag@grenoble-inp.fr", "Password!");
      cy.get("form").submit();
    });

    beforeEach(() => {
      cy.visit("/");
    })

    it("View the default posts", () => {
      cy.getPostByText("Ensimag est l'une des meilleurs écoles d'ingénieur de France !").contains("Ensimag Ensimag");
      cy.getPostByText("Mon emblem est le Phénix").contains("Phelma Phelma");
      cy.get(".post").should("have.length", 2);
    })

    it("clicking on likes", () => {
      const post = cy.getPostByText("Ensimag est l'une des meilleurs écoles d'ingénieur de France !");
      post.find(".post-like-btn").click();
      post.contains(" 4 Likes");
      post.get(".liked").click();
      post.contains(" 3 Likes");
    })

    after(() => {
      cy.visit("/");
      cy.get("nav").find("#signout").click();
    })
  });
});
