import './App.css'
import ExpenseTracker from './components/ExpenseTracker'
import ThemeToggle from './components/ThemeToggle'

function App() {
  return <Home />
}

function Home() {
  return (
    <>
      <ThemeToggle />
      <ExpenseTracker />
    </>
  )
}

export default App
