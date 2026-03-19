## Why

The Expense Tracker currently only supports a light theme, which can cause eye strain for users working in low-light environments or during nighttime hours. Adding dark mode support improves accessibility and user experience by adapting to user preferences and environmental conditions.

## What Changes

- Add theme toggle button to switch between light and dark modes
- Implement theme persistence across sessions using localStorage
- Migrate from inline styles to CSS variables for consistent theming
- Ensure all UI elements (buttons, inputs, text, backgrounds, lists) adapt to both themes
- Support system preference detection (prefers-color-scheme) for automatic theme selection
- Add smooth transitions between theme changes

## Capabilities

### New Capabilities

- `theme-management`: Capability for managing application theme state including user preferences, system preference detection, and theme persistence across sessions.

### Modified Capabilities

No existing specs are being modified since this is a new feature addition.

## Impact

- **Components**: ExpenseTracker.tsx will be refactored to use CSS variables and theme context
- **New dependencies**: May add a theme context provider component
- **CSS**: Introduction of CSS variables for theming, migration from inline styles
- **User Experience**: New theme toggle UI element
- **Data**: localStorage will be used to persist user's theme preference
- **Tests**: Component tests will need to verify theme switching and UI rendering in both modes
