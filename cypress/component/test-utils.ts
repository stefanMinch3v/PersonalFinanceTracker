// Factory function for creating expense test data
export const createExpense = (name: string, amount: string) => ({
  name,
  amount,
  formattedAmount: `$${parseFloat(amount).toFixed(2)}`
})

// Selector constants (centralized for maintenance)
export const selectors = {
  expenseNameInput: '[aria-label="Expense name"]',
  amountInput: '[aria-label="Amount"]',
  addExpenseButton: 'Add Expense',
  removeExpenseButton: '[aria-label="Remove expense"]',
  expenseList: '[role="list"]',
  totalDisplay: '[aria-label="Total amount"]',
  errorMessage: '[role="alert"]'
}

// Helper for verifying multiple expenses in list
export const verifyExpensesInList = (expenses: Array<{ name: string; amount: string }>) => {
  expenses.forEach((expense) => {
    cy.getByText(expense.name).should('be.visible')
    cy.getByText(createExpense(expense.name, expense.amount).formattedAmount).should('be.visible')
  })
}

// Total calculation helper (matches USD formatting with commas)
export const calculateTotal = (amounts: string[]): string => {
  const total = amounts.reduce((sum, amount) => sum + parseFloat(amount), 0)
  return `$${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
}
