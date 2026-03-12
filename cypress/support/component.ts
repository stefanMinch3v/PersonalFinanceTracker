import { mount } from 'cypress/react'

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

Cypress.Commands.add('verifyExpenseInList', (name: string, amount: string) => {
  const formattedAmount = `$${parseFloat(amount).toFixed(2)}`
  cy.getByText(name).should('be.visible')
  cy.getByText(formattedAmount).should('be.visible')
})

Cypress.Commands.add('verifyTotal', (expectedTotal: string) => {
  cy.getByLabelText('Total amount').should('have.text', expectedTotal)
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
      verifyExpenseInList: (name: string, amount: string) => Chainable<void>
      verifyTotal: (expectedTotal: string) => Chainable<void>
    }
  }
}