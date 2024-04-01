context("Groups", () => {
  before(() => {
    cy.logout();
    cy.visit("/");
    cy.fillLogin("user.username@grenoble-inp.org", "Password!");
    cy.get("form").submit();
    cy.visit("/groups");
  });

  it("Posting a message on a group", () => {
    cy.contains("Général").click();
    const posts = cy.getPostByText("Groupe Général : post 1");
    posts.within(() => {
      cy.get("[data-cy='like']").click();
    });
    const newPost = "New post";
    cy.addPost(newPost);
  });

  it("Going to public saloon in Général", () => {
    cy.visit("/");
  });
});
