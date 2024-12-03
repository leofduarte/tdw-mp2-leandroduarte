describe('Story Creation Page', () => {
    beforeEach(() => {
        cy.visit('/create-story');
    });

    it('should render the story creation form correctly', () => {
        cy.get('input[name="title"]').should('exist');
        cy.get('textarea[name="description"]').should('exist');
        cy.get('[data-testid="genres-select"]').should('exist');
        cy.get('[data-testid="target-age-select"]').should('exist');
        cy.get('textarea[name="initialSetup"]').should('exist');
    });

    it('should prevent submission of incomplete form', () => {
        // Try to submit form without required fields
        cy.get('button[type="submit"]').click();

        // Check for validation errors
        cy.get('input[name="title"]').should('have.attr', 'required');
        cy.get('textarea[name="description"]').should('have.attr', 'required');
    });

    it('should allow selecting multiple genres', () => {
        // Open genre select
        cy.get('[data-testid="genres-select"]').click();

        // Select multiple genres
        cy.contains('.select-item', 'Fantasy').click();
        cy.contains('.select-item', 'Adventure').click();

        // Verify selected genres
        cy.get('.selected-genre').should('have.length', 2);
        cy.get('.selected-genre').first().should('contain', 'Fantasy');
        cy.get('.selected-genre').last().should('contain', 'Adventure');
    });

    it('should create a story successfully', () => {
        // Fill out the form
        cy.get('input[name="title"]').type('Test Story');
        cy.get('textarea[name="description"]').type('A test story description');

        // Select genre
        cy.get('[data-testid="genres-select"]').click();
        cy.contains('.select-item', 'Science Fiction').click();

        // Select target age
        cy.get('[data-testid="target-age-select"]').click();
        cy.contains('.select-item', 'Young Adult').click();

        // Optional: Add initial setup
        cy.get('textarea[name="initialSetup"]').type('Once upon a time...');

        // Submit form
        cy.get('button[type="submit"]').click();

        // Assert redirection to story flow page
        cy.url().should('include', '/stories/flow/');
    });

    it('should handle content warnings selection', () => {
        // Select content warning
        cy.get('[data-testid="content-warnings-select"]').click();
        cy.contains('.select-item', 'Violence').click();

        // Verify selection
        cy.get('[data-testid="content-warnings-select"]')
            .should('contain', 'Violence');
    });

    it('should handle genre search functionality', () => {
        // Open genre select
        cy.get('[data-testid="genres-select"]').click();

        // Search for a specific genre
        cy.get('input[placeholder="Search genres..."]').type('Science');

        // Verify filtered results
        cy.get('.select-item').should('contain', 'Science');
        cy.get('.select-item').should('have.length.lessThan', 5);
    });

    it('should limit title length', () => {
        const longTitle = 'A'.repeat(101);
        cy.get('input[name="title"]').type(longTitle);
        cy.get('input[name="title"]').should('have.value', longTitle.slice(0, 100));
    });

    it('should show error for failed story creation', () => {
        // Mock a server error
        cy.intercept('POST', '/api/stories', {
            statusCode: 500,
            body: { message: 'Server error' }
        });

        // Fill out form
        cy.get('input[name="title"]').type('Error Test Story');
        cy.get('textarea[name="description"]').type('Intentional error test');

        // Submit form
        cy.get('button[type="submit"]').click();

        // Check for error message
        cy.get('.error-message').should('be.visible');
    });
});

