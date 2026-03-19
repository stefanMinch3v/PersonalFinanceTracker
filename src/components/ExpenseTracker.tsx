import { useState, useEffect } from 'react'

interface Expense {
  id: string
  name: string
  amount: number
}

interface Income {
  id: string
  name: string
  amount: number
}

interface BulkExpenseRow {
  name: string
  amount: string
}

interface ExpenseTrackerProps {
  skipInitialFetch?: boolean
}

export default function ExpenseTracker({ skipInitialFetch = false }: ExpenseTrackerProps = {}) {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [incomes, setIncomes] = useState<Income[]>([])
  const [name, setName] = useState('')
  const [amount, setAmount] = useState('')
  const [incomeName, setIncomeName] = useState('')
  const [incomeAmount, setIncomeAmount] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(true)
  const [bulkMode, setBulkMode] = useState(false)
  const [bulkRows, setBulkRows] = useState<BulkExpenseRow[]>([
    { name: '', amount: '' },
    { name: '', amount: '' },
    { name: '', amount: '' },
  ])

  useEffect(() => {
    Promise.all([fetchExpenses(), fetchIncomes()])
  }, [])

  const fetchExpenses = async () => {
    try {
      const response = await fetch('/api/expenses')
      const data = await response.json()
      setExpenses(data)
    } catch (e) {
      console.error('Failed to fetch expenses:', e)
    }
  }

  const fetchIncomes = async () => {
    try {
      const response = await fetch('/api/incomes')
      const data = await response.json()
      setIncomes(data)
    } catch (e) {
      console.error('Failed to fetch incomes:', e)
    }
  }

  useEffect(() => {
    if (skipInitialFetch) {
      setLoading(false)
      return
    }

    const loadAllData = async () => {
      try {
        await Promise.all([fetchExpenses(), fetchIncomes()])
      } catch (e) {
        console.error('Failed to load data:', e)
      } finally {
        setLoading(false)
      }
    }

    loadAllData()
  }, [skipInitialFetch])

  const formatCurrency = (value: number): string => {
    return `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  }

  const calculateTotalExpenses = (): string => {
    const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    return formatCurrency(total)
  }

  const calculateTotalIncome = (): string => {
    const total = incomes.reduce((sum, income) => sum + income.amount, 0)
    return formatCurrency(total)
  }

  const calculateNetBalance = (): string => {
    const totalIncome = incomes.reduce((sum, income) => sum + income.amount, 0)
    const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
    const netBalance = totalIncome - totalExpenses
    return formatCurrency(netBalance)
  }

  const validateExpense = (expenseName: string, expenseAmount: string): boolean => {
    if (!expenseName.trim()) {
      return false
    }

    if (!expenseAmount) {
      return false
    }

    const amountValue = parseFloat(expenseAmount)
    if (isNaN(amountValue) || amountValue <= 0) {
      return false
    }

    return true
  }

  const validateForm = (): boolean => {
    if (!validateExpense(name, amount)) {
      if (!name.trim()) {
        setError('Expense name is required')
      } else if (!amount) {
        setError('Amount is required')
      } else {
        const amountValue = parseFloat(amount)
        if (isNaN(amountValue)) {
          setError('Amount must be a valid number')
        } else if (amountValue <= 0) {
          setError('Amount must be greater than zero')
        }
      }
      return false
    }

    return true
  }

  const addExpense = async () => {
    setError('')

    if (!validateForm()) {
      return
    }

    const amountValue = parseFloat(amount)

    try {
      const response = await fetch('/api/expenses', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: name.trim(),
          amount: amountValue,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add expense')
      }

      await fetchExpenses()
      setName('')
      setAmount('')
    } catch (e) {
      setError('Failed to add expense. Please try again.')
      console.error('Failed to add expense:', e)
    }
  }

  const removeExpense = async (id: string) => {
    try {
      const response = await fetch(`/api/expenses/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to remove expense')
      }

      await fetchExpenses()
    } catch (e) {
      console.error('Failed to remove expense:', e)
    }
  }

  const validateIncome = (incomeName: string, incomeAmount: string): boolean => {
    if (!incomeName.trim()) {
      return false
    }

    if (!incomeAmount) {
      return false
    }

    const amountValue = parseFloat(incomeAmount)
    if (isNaN(amountValue) || amountValue <= 0) {
      return false
    }

    return true
  }

  const validateIncomeForm = (): boolean => {
    if (!validateIncome(incomeName, incomeAmount)) {
      if (!incomeName.trim()) {
        setError('Income name is required')
      } else if (!incomeAmount) {
        setError('Amount is required')
      } else {
        const amountValue = parseFloat(incomeAmount)
        if (isNaN(amountValue)) {
          setError('Amount must be a valid number')
        } else if (amountValue <= 0) {
          setError('Amount must be greater than zero')
        }
      }
      return false
    }

    return true
  }

  const addIncome = async () => {
    setError('')

    if (!validateIncomeForm()) {
      return
    }

    const amountValue = parseFloat(incomeAmount)

    try {
      const response = await fetch('/api/incomes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: incomeName.trim(),
          amount: amountValue,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to add income')
      }

      await fetchIncomes()
      setIncomeName('')
      setIncomeAmount('')
    } catch (e) {
      setError('Failed to add income. Please try again.')
      console.error('Failed to add income:', e)
    }
  }

  const removeIncome = async (id: string) => {
    try {
      const response = await fetch(`/api/incomes/${id}`, {
        method: 'DELETE',
      })

      if (!response.ok) {
        throw new Error('Failed to remove income')
      }

      await fetchIncomes()
    } catch (e) {
      console.error('Failed to remove income:', e)
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addExpense()
  }

  const handleIncomeSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    addIncome()
  }

  const validateBulkRow = (row: BulkExpenseRow): boolean => {
    return validateExpense(row.name, row.amount)
  }

  const addBulkExpenses = async () => {
    setError('')

    const validRows = bulkRows.filter(validateBulkRow)
    if (validRows.length === 0) {
      setError('Please add at least one valid expense')
      return
    }

    try {
      // Send individual POST requests for each expense
      const promises = validRows.map((row) =>
        fetch('/api/expenses', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            name: row.name.trim(),
            amount: parseFloat(row.amount),
          }),
        })
      )

      const responses = await Promise.all(promises)

      // Check if any request failed
      const failedResponse = responses.find((res) => !res.ok)
      if (failedResponse) {
        throw new Error('Failed to add expenses')
      }

      await fetchExpenses()
      setBulkRows([
        { name: '', amount: '' },
        { name: '', amount: '' },
        { name: '', amount: '' },
      ])
      setBulkMode(false)
    } catch (e) {
      setError('Failed to add expenses. Please try again.')
      console.error('Failed to add bulk expenses:', e)
    }
  }

  return (
    <div className="expense-tracker">
      <h1>Expense Tracker</h1>

      {loading && <p>Loading...</p>}

      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <h2>Add Expense</h2>
        <div className="form-group">
          <label htmlFor="expenseName">Expense Name</label>
          <input
            id="expenseName"
            type="text"
            aria-label="Expense name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="amount">Amount</label>
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

      <form onSubmit={handleIncomeSubmit}>
        <h2>Add Income</h2>
        <div className="form-group">
          <label htmlFor="incomeName">Income Name</label>
          <input
            id="incomeName"
            type="text"
            aria-label="Income name"
            value={incomeName}
            onChange={(e) => setIncomeName(e.target.value)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="incomeAmount">Amount</label>
          <input
            id="incomeAmount"
            type="text"
            aria-label="Income amount"
            value={incomeAmount}
            onChange={(e) => setIncomeAmount(e.target.value)}
          />
        </div>

        <button type="submit">Add Income</button>
      </form>

      {!bulkMode && (
        <button type="button" onClick={() => setBulkMode(true)}>
          Bulk Entry
        </button>
      )}

      {bulkMode && (
        <div className="bulk-mode-container">
          <h3>Bulk Expense Entry</h3>
          {bulkRows.map((row, index) => (
            <div key={index} className="bulk-row">
              <input
                type="text"
                aria-label={`Bulk expense ${index + 1} name`}
                placeholder="Expense name"
                value={row.name}
                onChange={(e) => {
                  const newRows = [...bulkRows]
                  newRows[index].name = e.target.value
                  setBulkRows(newRows)
                }}
              />
              <input
                type="text"
                aria-label={`Bulk expense ${index + 1} amount`}
                placeholder="Amount"
                value={row.amount}
                onChange={(e) => {
                  const newRows = [...bulkRows]
                  newRows[index].amount = e.target.value
                  setBulkRows(newRows)
                }}
              />
            </div>
          ))}
          <button type="button" onClick={addBulkExpenses}>
            Bulk Add
          </button>
          <button
            type="button"
            onClick={() => setBulkMode(false)}
            className="remove-button"
          >
            Cancel
          </button>
        </div>
      )}

      <div className="summary">
        <h2>Financial Summary</h2>
        <p aria-label="Total amount">{calculateTotalExpenses()}</p>
        <p aria-label="Total income">Total Income: {calculateTotalIncome()}</p>
        <p aria-label="Total expenses"></p>
        <p aria-label="Net balance">Net Balance: {calculateNetBalance()}</p>
      </div>

      {incomes.length > 0 && (
        <div className="list-container">
          <h2>Incomes</h2>
          <ul role="list">
            {incomes.map((income) => (
              <li key={income.id} className="list-item">
                <span>{income.name}</span>
                {' - '}
                <span>{formatCurrency(income.amount)}</span>
                <button
                  type="button"
                  aria-label="Remove income"
                  onClick={() => removeIncome(income.id)}
                  className="remove-button"
                >
                  Remove
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {expenses.length > 0 && (
        <div className="list-container">
          <h2>Expenses</h2>
          <ul role="list">
            {expenses.map((expense) => (
              <li key={expense.id} className="list-item">
                <span>{expense.name}</span>
                {' - '}
                <span>{formatCurrency(expense.amount)}</span>
                <button
                  type="button"
                  aria-label="Remove expense"
                  onClick={() => removeExpense(expense.id)}
                  className="remove-button"
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
