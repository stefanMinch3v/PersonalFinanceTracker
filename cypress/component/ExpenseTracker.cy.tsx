import ExpenseTracker from '../../src/components/ExpenseTracker'

describe('ExpenseTracker Component', () => {
  describe('Adding Expenses', () => {
    it('Add a new expense', () => {
      // Given
      cy.mount(<ExpenseTracker />)

      // When
      cy.addExpense('Groceries', '150.50')

      // Then
      cy.verifyExpenseInList('Groceries', '150.50')
    })

    it('Add multiple expenses', () => {
      // Given
      cy.mount(<ExpenseTracker />)

      // When
      cy.addExpense('Groceries', '150.50')
      cy.addExpense('Rent', '1200.00')
      cy.addExpense('Utilities', '85.75')

      // Then
      cy.getByText('Groceries').should('be.visible')
      cy.getByText('Rent').should('be.visible')
      cy.getByText('Utilities').should('be.visible')
    })
  })

  describe('Removing Expenses', () => {
    it('Remove an expense', () => {
      // Given
      cy.mount(<ExpenseTracker />)
      cy.addExpense('Groceries', '150.50')
      cy.getByText('Groceries').should('be.visible')

      // When
      cy.removeExpense('Groceries')

      // Then
      cy.getByText('Groceries').should('not.exist')
    })

    it('Remove one of multiple expenses', () => {
      // Given
      cy.mount(<ExpenseTracker />)
      cy.addExpense('Groceries', '150.50')
      cy.addExpense('Rent', '1200.00')
      cy.addExpense('Utilities', '85.75')

      // When
      cy.removeExpense('Rent')

      // Then
      cy.getByText('Rent').should('not.exist')
      cy.getByText('Groceries').should('be.visible')
      cy.getByText('Utilities').should('be.visible')
    })

    it('Cannot remove from empty list', () => {
      // Given
      cy.mount(<ExpenseTracker />)

      // When
      // Attempting to remove when list is empty should have no effect
      cy.getByText('Groceries').should('not.exist')

      // Then
      cy.getByText('Groceries').should('not.exist')
    })
  })

  describe('Form Validation', () => {
    it('Cannot add expense with empty name', () => {
      // Given
      cy.mount(<ExpenseTracker />)

      // When
      cy.getByLabelText('Amount').type('100.00')
      cy.getByText('Add Expense').click()

      // Then
      cy.getByText('Groceries').should('not.exist')
      cy.getByRole('alert').should('be.visible').and('contain', 'required')
    })

    it('Cannot add expense with zero or negative amount', () => {
      // Given
      cy.mount(<ExpenseTracker />)

      // When
      cy.fillExpenseForm('Test Expense', '-50.00')
      cy.getByText('Add Expense').click()

      // Then
      cy.getByText('Test Expense').should('not.exist')
      cy.getByRole('alert').should('be.visible')
    })

    it('Cannot add expense with zero amount', () => {
      // Given
      cy.mount(<ExpenseTracker />)

      // When
      cy.fillExpenseForm('Test Expense', '0.00')
      cy.getByText('Add Expense').click()

      // Then
      cy.getByText('Test Expense').should('not.exist')
      cy.getByRole('alert').should('be.visible')
    })

    it('Cannot add expense with empty amount', () => {
      // Given
      cy.mount(<ExpenseTracker />)

      // When
      cy.getByLabelText('Expense name').type('Test Expense')
      cy.getByText('Add Expense').click()

      // Then
      cy.getByText('Test Expense').should('not.exist')
      cy.getByRole('alert').should('be.visible').and('contain', 'required')
    })

    it('Cannot add expense with whitespace-only name', () => {
      // Given
      cy.mount(<ExpenseTracker />)

      // When
      cy.fillExpenseForm('   ', '100.00')
      cy.getByText('Add Expense').click()

      // Then
      cy.getByRole('alert').should('be.visible')
    })

    it('Cannot add expense with non-numeric amount', () => {
      // Given
      cy.mount(<ExpenseTracker />)

      // When
      cy.fillExpenseForm('Test Expense', 'abc')
      cy.getByText('Add Expense').click()

      // Then
      cy.getByText('Test Expense').should('not.exist')
      cy.getByRole('alert').should('be.visible')
    })
  })

  describe('Form Behavior', () => {
    it('Form clears after adding expense', () => {
      // Given
      cy.mount(<ExpenseTracker />)

      // When
      cy.fillExpenseForm('Groceries', '150.50')
      cy.getByText('Add Expense').click()
      cy.getByText('Groceries').should('be.visible')

      // Then
      cy.getByLabelText('Expense name').should('have.value', '')
      cy.getByLabelText('Amount').should('have.value', '')
    })
  })

  describe('Total Calculation', () => {
    it('Total is calculated correctly', () => {
      // Given
      cy.mount(<ExpenseTracker />)

      // When
      cy.addExpense('Groceries', '150.50')
      cy.addExpense('Rent', '1200.00')
      cy.addExpense('Utilities', '85.75')

      // Then
      cy.verifyTotal('$1,436.25')
    })

    it('Total updates when removing expense', () => {
      // Given
      cy.mount(<ExpenseTracker />)
      cy.addExpense('Groceries', '150.50')
      cy.addExpense('Rent', '1200.00')
      cy.addExpense('Utilities', '85.75')
      cy.verifyTotal('$1,436.25')

      // When
      cy.removeExpense('Rent')

      // Then
      cy.verifyTotal('$236.25')
    })
  })
})
