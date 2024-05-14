context("Events", () => {
  describe("Create an event", () => {
    before(() => {
      cy.logout()
      cy.visit("/")
      cy.fillLogin("user.username@grenoble-inp.org", "Password!")
      cy.get("form").submit()
    })

    it("Create a group and then an event", () => {
        cy.visit("/groups")
        cy.wait(200)
        //click on data-cy="createGroupButton"
        cy.get("[data-cy='createGroupButton']").click()
        //check the url
        cy.url().should("eq", `${Cypress.config().baseUrl}/createGroup`)
        //fill the form
        cy.fillGroupForm("Group event", "Group description", "Public", "ensimag")
        //submit the form
        cy.get("[data-cy='createGroupForm']").submit()
        //check the url
        cy.url().should("eq", `${Cypress.config().baseUrl}/groups`)
        //check if the group is created
        cy.contains("Group event")
        cy.visit("/")
        cy.wait(200)
        //click on the group from the nav bar with the name "Group event" with data-cy="groupLink"
        cy.get("[data-cy='groupLink']").contains("Group event").click()
        //then click on the data-cy="saloonLink" who contains Événements
        cy.get("[data-cy='salonLink']").contains("Événements").click()
        cy.wait(200)
        //click on the data-cy="createEventButton"
        cy.get("[data-cy='createEventButton']").click()
        cy.wait(200)
        //check the url
        cy.url().should('match', /\/group\/\d{13}\/createEvent$/)
        //fill the form with the name "Event name", the description "Event description", the start date "2021-12-01" and the start time "12:00" and the end date "2021-12-01" and the end time "13:00" and the type "MINP"
        cy.fillEventForm("Event name", "Event description", "2024-05-10", "12:00", "2024-05-11", "13:00", "MINP")
        //submit the form
        cy.get("[data-cy='createEventForm']").submit()
        //check the url
        cy.url().should('match', /\/group\/\d{13}\/events$/)
        //check if the event is created
        cy.contains("Event name")
        //go now to the calendar to see if the event is created
        cy.visit("/eventCalendar")
        //check if an element with class rbc-event-content contains the text "Event name"
        cy.get(".rbc-event-content").should("contain", "Event name")
        //click on the event who contains the text "Event name"
        cy.get(".rbc-event-content").contains("Event name").click()
        //check if a div with the class event-details contains the text "Event description"
        cy.get(".event-details").should("contain", "Event description")
        //click on the a in the div with the class event-details who contains the text "Group event"
        cy.get(".event-details").contains("Voir plus").click()
        //check the url
        cy.url().should('match', /\/group\/\d{13}\/event\/\d{13}$/)
        //check if "Event name" is in the page
        cy.contains("Event name")
    })
  })

  describe("Go to the event on the homepage and interact with it", () => {
    before(() => {
      cy.logout()
      cy.visit("/")
      cy.fillLogin("user.username@grenoble-inp.org", "Password!")
      cy.get("form").submit()
    })

    it("Go to the event and interact with it", () => {
        cy.visit("/")
        // click on the button in post-list-header who contains the text "Événements"
        cy.get(".post-list-header").contains("Événements").click()

        cy.wait(200)

        //like the event who contains the text "Un évènement à ne pas louper"
        cy.get(".post").contains("Un évènement à ne pas louper").parents(".post").find(".post-like-btn").click()
        //check if the event is liked
        cy.get(".post").contains("Un évènement à ne pas louper").parents(".post").find(".post-like-btn").should("have.class", "liked")
        //add a comment to the event who contains the text "Un évènement à ne pas louper"
        cy.get(".post").contains("Un évènement à ne pas louper").parents(".post").find(".post-comment-btn").click()
        cy.get(".post").contains("Un évènement à ne pas louper").parents(".post").find(".comment-input-field").type("Je le louperai pas")
        cy.get(".post").contains("Un évènement à ne pas louper").parents(".post").find(".comment-btn").click()
        //check if the comment is here
        cy.wait(200)
        cy.get(".post").contains("Un évènement à ne pas louper").parents(".post").find(".comments").click()
        cy.get(".post").contains("Un évènement à ne pas louper").parents(".post").find(".comment").should("contain", "Je le louperai pas")
    })
  })

  describe("Go to an event, add a post, like it and comment it", () => {
    before(() => {
      cy.logout()
      cy.visit("/")
      cy.fillLogin("user.username@grenoble-inp.org", "Password!")
      cy.get("form").submit()
    })

    it("Go to the event and interact with it", () => {
        cy.visit("/")
        // click on the button in post-list-header who contains the text "Événements"
        cy.get(".post-list-header").contains("Événements").click()

        cy.wait(200)

        //click on the event who contains the text "Un évènement à ne pas louper"
        cy.get(".post").contains("Un évènement à ne pas louper").parents(".post").find(".post-title").click()
        //add a post with the text "New post"
        cy.addPost("New post")
        //check if the post is here
        cy.contains("New post")
        cy.get(".post").contains("New post").parents(".post").find(".post-like-btn").click()
        //check if the event is liked
        cy.get(".post").contains("New post").parents(".post").find(".post-like-btn").should("have.class", "liked")
        //add a comment to the event who contains the text "Un évènement à ne pas louper"
        cy.get(".post").contains("New post").parents(".post").find(".post-comment-btn").click()
        cy.get(".post").contains("New post").parents(".post").find(".comment-input-field").type("Pas mal")
        cy.get(".post").contains("New post").parents(".post").find(".comment-btn").click()
        //check if the comment is here
        cy.wait(200)
        cy.get(".post").contains("New post").parents(".post").find(".comments-toggle").first().click()
        cy.get(".post").contains("New post").parents(".post").find(".comment").should("contain", "Pas mal")
        //delete the post
        cy.get(".post-options").click()
        cy.get(".post").contains("New post").parents(".post").find(".menu-delete").click()
        //check if the post is deleted
        cy.contains("New post").should("not.exist")
    })
  })
})