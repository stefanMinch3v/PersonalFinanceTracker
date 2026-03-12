import { useState } from 'react'

interface Expense {
  id: string
  name: string
  amount: number
}

export default function ExpenseTracker() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [error, setError] = useState('')

  const formatCurrency = (value: number): string => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const calculateTotal = (): string => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    return formatCurrency(total)
  }

  const validateForm = (): boolean => {
    if (!name.trim()) {
      setError('Expense name is required')
      return false
    }

    if (!amount) {
      setError('Amount is required')
      return false
    }

    const amountValue = parseFloat(amount)
    if (isNaN(amountValue)) {
      setError('Amount must be a valid number')
      return false
    }

    if (amountValue <= 0) {
      setError('Amount must be greater than zero')
      return false
    }

    return true
  }

  const addExpense = () => {
    setError('')

    if (!validateForm()) {
      return
    }

    const amountValue = parseFloat(amount)
    const newExpense: Expense = {
      id: Date.now().toString(),
      name: name.trim(),
      amount: amountValue
    }

    setExpenses([...expenses, newExpense])
    setName('')
    setAmount('')
  }

  const removeExpense = (id: string) => {
    setExpenses(expenses.filter((expense) => expense.id !== id))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addExpense()
  }

  return (
    <div style={{ maxWidth: '600px', margin: '0 auto', padding: '20px' }}>
      <h1>Expense Tracker</h1>

      {error && (
        <div role="alert" style={{ color: 'red', marginBottom: '10px' }}>
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="expenseName">Expense Name</label>
          <br />
          <input
            id="expenseName"
            type="text"
            aria-label="Expense name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div style={{ marginBottom: '10px' }}>
          <label htmlFor="amount">Amount</label>
          <br />
          <input
            id="amount"
            type="text"
            aria-label="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
        </div>

        <button type="submit">Add Expense</button>
      </form>

      <div style={{ marginBottom: '20px' }}>
        <h2>Total</h2>
        <p aria-label="Total amount">{calculateTotal()}</p>
      </div>

      {expenses.length > 0 && (
        <div>
          <h2>Expenses</h2>
          <ul role="list">
            {expenses.map((expense) => (
              <li key={expense.id} style={{ marginBottom: '10px' }}>
                <span>{expense.name}</span>
                {' - '}
                <span>{formatCurrency(expense.amount)}</span>
                <button
                  type="button"
                  aria-label="Remove expense"
                  onClick={() => removeExpense(expense.id)}
                  style={{ marginLeft: '10px' }}
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
