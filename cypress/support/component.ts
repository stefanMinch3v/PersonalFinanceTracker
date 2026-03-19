import { mount } from 'cypress/react'

// Store original fetch
let originalFetch: typeof window.fetch | null = null

// Store expenses and incomes for mock API
let mockExpenses: Array<{ id: string; name: string; amount: number }> = []
let mockIncomes: Array<{ id: string; name: string; amount: number }> = []

// Setup fetch mock before each test
beforeEach(() => {
  // Reset mock expenses and incomes for each test
  mockExpenses = []
  mockIncomes = []

  // Store original fetch on first run
  if (!originalFetch) {
    originalFetch = window.fetch
  }

  // Mock fetch for component tests
  const mockFetch = cy.stub().callsFake((url: string, options?: RequestInit) => {
    // GET /api/expenses - return stored expenses
    if (url === '/api/expenses' && (!options || options.method === 'GET')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockExpenses),
        text: () => Promise.resolve('')
      })
    }

    // POST /api/expenses - handle single expense
    if (url === '/api/expenses' && options?.method === 'POST') {
      const body = JSON.parse(options.body as string)
      const expense: { name: string; amount: number } = body

      mockExpenses.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: expense.name,
        amount: expense.amount
      })

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Expense added' }),
        text: () => Promise.resolve('')
      })
    }

    // DELETE /api/expenses/:id
    if (url.startsWith('/api/expenses/') && options?.method === 'DELETE') {
      const id = url.split('/').pop()
      mockExpenses = mockExpenses.filter((exp) => exp.id !== id)
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Expense deleted' }),
        text: () => Promise.resolve('')
      })
    }

    // GET /api/incomes - return stored incomes
    if (url === '/api/incomes' && (!options || options.method === 'GET')) {
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve(mockIncomes),
        text: () => Promise.resolve('')
      })
    }

    // POST /api/incomes - handle single income
    if (url === '/api/incomes' && options?.method === 'POST') {
      const body = JSON.parse(options.body as string)
      const income: { name: string; amount: number } = body

      mockIncomes.push({
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: income.name,
        amount: income.amount
      })

      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Income added' }),
        text: () => Promise.resolve('')
      })
    }

    // DELETE /api/incomes/:id
    if (url.startsWith('/api/incomes/') && options?.method === 'DELETE') {
      const id = url.split('/').pop()
      mockIncomes = mockIncomes.filter((inc) => inc.id !== id)
      return Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ message: 'Income deleted' }),
        text: () => Promise.resolve('')
      })
    }

    return Promise.resolve({
      ok: true,
      json: () => Promise.resolve([]),
      text: () => Promise.resolve('')
    })
  })

  cy.window().then((win) => {
    win.fetch = mockFetch
  })
})

// Restore fetch after each test
afterEach(() => {
  if (originalFetch) {
    cy.window().then((win) => {
      win.fetch = originalFetch
    })
  }
})

// Custom commands for Testing Library queries
Cypress.Commands.add('getByLabelText', (label, options) => {
  return cy.get(`[aria-label="${label}"]`, options)
})

Cypress.Commands.add('getByRole', (role, options) => {
  return cy.get(`[role="${role}"]`, options)
})

Cypress.Commands.add('getByText', (text, options) => {
  return cy.contains(text, options)
})

// Augment the Cypress namespace to include type definitions for
// custom commands.
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
      getByLabelText: (label: string, options?: unknown) => Chainable<JQuery<HTMLElement>>
      getByRole: (role: string, options?: unknown) => Chainable<JQuery<HTMLElement>>
      getByText: (text: string, options?: unknown) => Chainable<JQuery<HTMLElement>>
    }
  }
}

Cypress.Commands.add('mount', mount)

// Domain-specific commands for ExpenseTracker
Cypress.Commands.add('fillExpenseForm', (name: string, amount: string) => {
  cy.getByLabelText('Expense name').clear().type(name)
  cy.getByLabelText('Amount').clear().type(amount)
})

Cypress.Commands.add('addExpense', (name: string, amount: string) => {
  cy.fillExpenseForm(name, amount)
  cy.getByText('Add Expense').click()
})

Cypress.Commands.add('removeExpense', (name: string) => {
  cy.getByText(name).parent().within(() => {
    cy.contains('Remove').click()
  })
})

Cypress.Commands.add('removeIncome', (name: string) => {
  cy.getByText(name).parent().within(() => {
    cy.contains('Remove').click()
  })
})

Cypress.Commands.add('verifyExpenseInList', (name: string, amount: string) => {
  const formattedAmount = `$${parseFloat(amount).toFixed(2)}`
  cy.getByText(name).should('be.visible')
  cy.getByText(formattedAmount).should('be.visible')
})

Cypress.Commands.add('verifyTotal', (expectedTotal: string) => {
  cy.getByLabelText('Total amount').should('have.text', expectedTotal)
})

// Domain-specific commands for Bulk Expense Entry
Cypress.Commands.add('enterBulkEntryMode', () => {
  cy.getByText('Bulk Entry').click()
})

Cypress.Commands.add('addBulkExpenseRow', (name: string, amount: string, rowIndex: number) => {
  cy.get(`[aria-label="Bulk expense ${rowIndex + 1} name"]`).type(name)
  cy.get(`[aria-label="Bulk expense ${rowIndex + 1} amount"]`).type(amount)
})

Cypress.Commands.add('submitBulkExpenses', () => {
  cy.getByText('Bulk Add').click()
})

Cypress.Commands.add('verifyBulkFormCleared', () => {
  cy.get('[aria-label^="Bulk expense"]').each(($el) => {
    cy.wrap($el).should('have.value', '')
  })
})

// Domain-specific commands for Income Creation
Cypress.Commands.add('fillIncomeForm', (name: string, amount: string) => {
  cy.getByLabelText('Income name').clear().type(name)
  cy.getByLabelText('Income amount').clear().type(amount)
})

Cypress.Commands.add('addIncome', (name: string, amount: string) => {
  cy.fillIncomeForm(name, amount)
  cy.getByText('Add Income').click()
})

Cypress.Commands.add('verifyTotalIncome', (expectedTotal: string) => {
  cy.getByLabelText('Total income').should('contain.text', expectedTotal)
})

Cypress.Commands.add('verifyTotalExpenses', (expectedTotal: string) => {
  cy.getByLabelText('Total expenses').should('contain.text', expectedTotal)
})

Cypress.Commands.add('verifyNetBalance', (expectedBalance: string) => {
  cy.getByLabelText('Net balance').should('contain.text', expectedBalance)
})

// Augment TypeScript interface definitions
declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    interface Chainable {
      mount: typeof mount
      getByLabelText: (label: string, options?: unknown) => Chainable<JQuery<HTMLElement>>
      getByRole: (role: string, options?: unknown) => Chainable<JQuery<HTMLElement>>
      getByText: (text: string, options?: unknown) => Chainable<JQuery<HTMLElement>>
      fillExpenseForm: (name: string, amount: string) => Chainable<void>
      addExpense: (name: string, amount: string) => Chainable<void>
      removeExpense: (name: string) => Chainable<void>
      removeIncome: (name: string) => Chainable<void>
      verifyExpenseInList: (name: string, amount: string) => Chainable<void>
      verifyTotal: (expectedTotal: string) => Chainable<void>
      enterBulkEntryMode: () => Chainable<void>
      addBulkExpenseRow: (name: string, amount: string, rowIndex: number) => Chainable<void>
      submitBulkExpenses: () => Chainable<void>
      verifyBulkFormCleared: () => Chainable<void>
      fillIncomeForm: (name: string, amount: string) => Chainable<void>
      addIncome: (name: string, amount: string) => Chainable<void>
      verifyTotalIncome: (expectedTotal: string) => Chainable<void>
      verifyTotalExpenses: (expectedTotal: string) => Chainable<void>
      verifyNetBalance: (expectedBalance: string) => Chainable<void>
    }
  }
}