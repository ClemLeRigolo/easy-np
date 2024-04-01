context('Post from differents schools', () => {
  before(() => {
    cy.visit("/login");
    cy.login("ensimag@grenoble-inp.fr", "Password!");
    cy.get("form").submit();
  });

  beforeEach(() => {
    cy.visit("/");
  });

  it("View the default posts", () => {
    cy.getPostByText("Ensimag est l'une des meilleurs écoles d'ingénieur de France !").contains("Ensimag Ensimag");
    cy.getPostByText("Mon emblem est le Phénix").contains("Phelma Phelma");
  })

  it("clicking on likes", () => {
    const post = cy.getPostByText("Ensimag est l'une des meilleurs écoles d'ingénieur de France !");
    post.within(() => {
      const buttonLike = post.get("[data-cy='like']");
      buttonLike.should("have.attr", "likes", "3");
      cy.get("button[data-cy='like']").click();
      buttonLike.should("have.attr", "likes", "4");
      cy.get("button[data-cy='like']").click();
    });
  })

  it("clicking on comments", () => {
    const post = cy.getPostByText("Ensimag est l'une des meilleurs écoles d'ingénieur de France !");
    post.within(() => {
      post.contains("Phelma n'est pas loin derrière !").should("not.exist");
      post.get("[data-cy='toggleComments']").click();
      post.get("[data-cy='comments']");
    });
  })

  // it("Creating a post", () => {
  //   const postArea = cy.get(".postInput");
  //   postArea.find(".post-input").type("A new post !");
  //   cy.get("button[class='.post-submit-btn']");
  // })

  after(() => {
    visit("/");
    cy.get("#signout").click();
  });
});
