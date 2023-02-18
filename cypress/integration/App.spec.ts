describe("GitHub User Search App", () => {
    beforeEach(() => {
      cy.visit("/");
    });
  
    it("should display search results when user submits a search query", () => {
      cy.intercept("GET", "**/search/users*").as("searchRequest");
  
      const searchTerm = "john";
      cy.get(".input").type(searchTerm);
      cy.get(".button").click();
  
      cy.wait("@searchRequest").then(({ response }) => {
        const { total_count, items } = response.body;
  
        cy.get(".total-count").should(
          "have.text",
          `${total_count} perfis encontrados`
        );
  
        items.forEach((user) => {
          cy.get(".user-name").should("contain", user.name);
          cy.get(".user-avatar").should("have.attr", "src", user.avatar_url);
        });
      });
    });
  
    it("should display error message when there is an error with the API request", () => {
      cy.intercept("GET", "**/search/users*", {
        statusCode: 500,
        body: "Error: Internal Server Error",
      }).as("searchRequest");
  
      const searchTerm = "john";
      cy.get(".input").type(searchTerm);
      cy.get(".button").click();
  
      cy.wait("@searchRequest");
  
      cy.get(".error").should(
        "have.text",
        "An error occurred. Please try again later."
      );
    });
  
    it("should display modal with user details when user clicks on 'Detalhes' button", () => {
      cy.intercept("GET", "**/search/users*").as("searchRequest");
  
      const searchTerm = "john";
      cy.get(".input").type(searchTerm);
      cy.get(".button").click();
  
      cy.wait("@searchRequest");
  
      cy.get(".user-profile-link").first().click();
  
      cy.get(".modal").should("be.visible");
  
      cy.get(".user-name").should("contain", "John");
      cy.get(".user-avatar").should("have.attr", "src").should("not.be.empty");
      cy.get(".user-profile-link").should(
        "have.attr",
        "href",
        "https://github.com/john"
      );
      cy.get(".user-location").should("contain", "San Francisco, CA");
      cy.get(".user-email").should("contain", "john@example.com");
      cy.get(".user-public_repos").should("contain", "20");
    });
  });
  