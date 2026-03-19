import { useTheme } from '../contexts/ThemeContext'

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
      style={{
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '0.5em',
        fontSize: '1.5em',
        minWidth: '44px',
        minHeight: '44px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'var(--color-button-bg)',
        color: 'var(--color-button-text)',
        border: '1px solid var(--color-button-border)',
        borderRadius: '50%',
      }}
    >
      {theme === 'light' ? '🌙' : '☀️'}
    </button>
  )
}
