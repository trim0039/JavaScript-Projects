describe("My First Test", () => {
  it("Visits HTML", () => {
    cy.visit("./index.html");

    cy.get(".guess").type("10").should("have.value", "10");
    cy.contains("Check!").click();
  });
});
