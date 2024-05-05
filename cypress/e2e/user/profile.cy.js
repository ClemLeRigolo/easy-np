context("Profile", () => {

  describe('Goto userpage', () => {
    before(() => {
      cy.logout();
      cy.visit("/login");
      cy.fillLogin("user.username@grenoble-inp.org", "Password!");
      cy.get("form").submit();
    });

    beforeEach(() => {
      cy.visit("/");
    });

    it('Goto userpage', () => {
      cy.visit("/profile");
      cy.contains('@User_Username');
    });

    it('Goto userpage', () => {
      cy.wait(100);
      cy.addPost("New post");
      cy.getPostByText("New post").within(() => {
        cy.get('[data-cy="postHeader"]').click()
      });
      cy.contains('@User_Username');
    });

    it('Goto other page', () => {
      cy.getPostByText("Home : post 1").within(() => {
        cy.openComments();
        cy.get('[data-cy="gotoProfile"]').first().click();
      });
      cy.contains('@GI_GI');
    });

    it('Using the profile menu in nav', () => {
      cy.get('[data-cy="profileButton"]').click();
      cy.get('[data-cy="gotoProfile"]').click();
      cy.contains('@User_Username');
    })

    it('Bannier to profile', () => {
      cy.get('[data-cy="notification"]' ).within(() => {
        cy.get('[data-cy="gotoUrl"]').click();
      })
      cy.contains('@User_Username');
    });
  });

  describe('Edit profile', () => {
    beforeEach(() => {
      cy.logout();
      cy.visit('/');
      cy.fillLogin('modify.profile@grenoble-inp.org', 'Password!');
      cy.get('form').submit();
      // FIXME : change by visit('/profile')
      cy.visit("/");
      cy.addPost("New Post edit profile");
      cy.getPostByText("New Post edit profile").within(() => {
        cy.get('[data-cy="postHeader"]').click()
      });
    });

    it('Open and close edit profile', () => {
      cy.wait(100);
      cy.get('[data-cy="editProfile"]').click();
      cy.get('form[data-cy="profil"]').within(() => {
        cy.get('button[data-cy="cancel"]').click();
      })
    })

    it('Edit profile', () => {
      cy.get('[data-cy="editProfile"]').click();
      cy.get('form[data-cy="profil"]').within(() => {
        cy.get('input[name="name"]').clear().type('Name');
        cy.get('input[name="surname"]').clear().type('Surname');
        cy.get('input[name="username"]').clear().type('Username');
        cy.get('textarea[name="bio"]').clear().type('Une biographie');
        cy.get('div[data-cy="schoolChoose"] input[value="phelma"]').parent().click()
        cy.get('select[name="year"]').select('2A');
        cy.get('input[name="major"]').clear().type('Informatique');
        cy.get('button[data-cy="apply"]').click();
      });
      cy.contains('Une biographie');
      cy.contains('Username');
    });
  })
})
