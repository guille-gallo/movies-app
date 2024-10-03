it('should filter movies by genre', () => {
  // Visit the app
  cy.visit('http://localhost:3001');

  // Wait for the genre filter dropdown to appear and open it
  cy.get('[data-cy=genre-filter]', { timeout: 10000 }).should('be.visible').click();

  // Select an option from the dropdown (e.g., "Adventures" genre)
  cy.get('ul.MuiList-root').find('li').contains('Adventures').click();

  // Since filtering happens automatically, we wait for the results
  cy.get('[data-cy=movie-item]', { timeout: 10000 }).should('have.length.at.least', 1);
});

// Test for transferring movie rights
it('should transfer movie rights', () => {
  // Visit the app
  cy.visit('http://localhost:3001');

  // Listen for the alert and verify the content
  cy.on('window:alert', (text) => {
    expect(text).to.equal('Movie rights transferred successfully');
  });

  // Select a movie from the first Select dropdown
  cy.get('[data-cy=movie-select]').click(); // Open the movie dropdown
  cy.get('ul.MuiList-root').find('li').contains('The avengers').click();

  // Select a studio from the second Select dropdown
  cy.get('[data-cy=studio-select]').click(); // Open the studio dropdown
  cy.get('ul.MuiList-root').find('li').contains('Sony Pictures').click();

  // Wait for the transfer button to become enabled
  cy.get('[data-cy=transfer-button]', { timeout: 10000 }).should('not.be.disabled');

  // Click the Transfer Rights button
  cy.get('[data-cy=transfer-button]').click();

  // Cypress will now wait for the alert on line 21 and assert its content.
});
