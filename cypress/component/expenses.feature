Feature: Expense Management

  Scenario: Add a new expense
    Given the ExpenseTracker component is mounted
    When I enter an expense name "Groceries"
    And I enter an amount "150.50"
    And I click the "Add Expense" button
    Then the expense should be added to the list
    And the expense name should be "Groceries"
    And the expense amount should be "$150.50"

  Scenario: Add multiple expenses
    Given the ExpenseTracker component is mounted
    When I add an expense named "Groceries" with amount "150.50"
    And I add an expense named "Rent" with amount "1200.00"
    And I add an expense named "Utilities" with amount "85.75"
    Then all three expenses should appear in the list

  Scenario: Remove an expense
    Given the ExpenseTracker component is mounted
    When I have added an expense named "Groceries" with amount "150.50"
    And the expense appears in the list
    And I click the remove button for "Groceries"
    Then the expense should be removed from the list

  Scenario: Remove one of multiple expenses
    Given the ExpenseTracker component is mounted
    When I have added multiple expenses:
      | Name      | Amount |
      | Groceries | 150.50 |
      | Rent      | 1200.00|
      | Utilities | 85.75  |
    And I remove the "Rent" expense
    Then the "Rent" expense should not appear in the list
    And "Groceries" and "Utilities" should still appear

  Scenario: Cannot add expense with empty name
    Given the ExpenseTracker component is mounted
    When I enter an amount "100.00"
    And I leave the expense name empty
    And I click the "Add Expense" button
    Then no expense should be added
    And an error message should be displayed

  Scenario: Cannot add expense with zero or negative amount
    Given the ExpenseTracker component is mounted
    When I enter an expense name "Test Expense"
    And I enter an amount "-50.00"
    And I click the "Add Expense" button
    Then no expense should be added
    And an error message should be displayed

  Scenario: Cannot add expense with zero amount
    Given the ExpenseTracker component is mounted
    When I enter an expense name "Test Expense"
    And I enter an amount "0.00"
    And I click the "Add Expense" button
    Then no expense should be added
    And an error message should be displayed

  Scenario: Cannot add expense with empty amount
    Given the ExpenseTracker component is mounted
    When I enter an expense name "Test Expense"
    And I leave the amount empty
    And I click the "Add Expense" button
    Then no expense should be added
    And an error message should be displayed

  Scenario: Cannot add expense with whitespace-only name
    Given the ExpenseTracker component is mounted
    When I enter an expense name "   "
    And I enter an amount "100.00"
    And I click the "Add Expense" button
    Then no expense should be added
    And an error message should be displayed

  Scenario: Cannot add expense with non-numeric amount
    Given the ExpenseTracker component is mounted
    When I enter an expense name "Test Expense"
    And I enter an amount "abc"
    And I click the "Add Expense" button
    Then no expense should be added
    And an error message should be displayed

  Scenario: Form clears after adding expense
    Given the ExpenseTracker component is mounted
    When I enter an expense name "Groceries"
    And I enter an amount "150.50"
    And I click the "Add Expense" button
    And the expense is added to the list
    Then the expense name field should be empty
    And the amount field should be empty

  Scenario: Total is calculated correctly
    Given the ExpenseTracker component is mounted
    When I add an expense named "Groceries" with amount "150.50"
    And I add an expense named "Rent" with amount "1200.00"
    And I add an expense named "Utilities" with amount "85.75"
    Then the total should be "$1,436.25"

  Scenario: Total updates when removing expense
    Given the ExpenseTracker component is mounted
    When I add an expense named "Groceries" with amount "150.50"
    And I add an expense named "Rent" with amount "1200.00"
    And I add an expense named "Utilities" with amount "85.75"
    And the total is "$1,436.25"
    When I remove the "Rent" expense
    Then the total should be "$236.25"

  Scenario: Cannot remove from empty list
    Given the ExpenseTracker component is mounted
    When I attempt to remove any expense
    Then no change should occur
