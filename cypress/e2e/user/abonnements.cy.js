context("Following and followers", () => {
  before(() => {
    cy.logout();
    cy.visit("/");
    cy.fillLogin("user.username@grenoble-inp.org", "Password!");
    cy.get("form").submit();
  })

  beforeEach(() =>
    cy.visit('/')
  )

  it("Following a user", () => {
    cy.get('[data-cy=suggestedUsers]').within(() => {
      const button = cy.get('button[data-cy="follow"]').first();
      button.click();
      button.contains('Se désabonner');
      button.click();
      button.contains('S\'abonner');
    });
  });

  it("Following a user from his profile", () => {
    cy.getPostByText('Ici c\'est l\'imag : post 1').within(() => { 
      cy.get('[data-cy="postHeader"]').click();
    });
    cy.get('button[data-cy="follow"]').click();
    const unfollowButton = cy.get('button[data-cy="unfollow"]');
    unfollowButton.contains('Abonné');
    unfollowButton.click();
    cy.get('button[data-cy="follow"]').contains('S\'abonner');
  });

  it("Following other persons from profile", () => {
    cy.getPostByText('Ici c\'est l\'imag : post 1').within(() => { 
      cy.get('[data-cy="postHeader"]').click();
    });
    // from followers
    cy.get('[data-cy="followers"]').click();
    cy.get('[data-cy="followersList"]').within(() => {
      // follow
      cy.get('[data-cy="follow"]').first().click();
      // unfollow
      cy.get('[data-cy="unfollow"]').first().click();
    })
    cy.get('[data-cy="closeFollowers"]').click();

    // from subscribers
    cy.get('[data-cy="subscriptions"]').click();
    cy.get('[data-cy="followersList"]').within(() => {
      cy.get('[data-cy="follow"]').first().click();
      cy.get('[data-cy="unfollow"]').first().click();
    })
    cy.get('[data-cy="closeSubscriptions"]').click();
  })
})
