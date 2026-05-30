import { describe, it, expect, beforeEach } from 'vitest'
import { useDataStore } from '../useDataStore'

describe('useDataStore', () => {
  // Setup before each test to reset the store state
  beforeEach(() => {
    useDataStore.setState({
      expenses: [],
      salaries: {},
      installments: [],
      categories: [
        { id: '1', name: 'comida', color: 'bg-emerald-500' },
        { id: '2', name: 'transporte', color: 'bg-blue-500' }
      ]
    })
  })

  it('should add a new expense correctly', () => {
    const store = useDataStore.getState()
    expect(store.expenses.length).toBe(0)

    store.addExpense({
      date: '2023-10-01T12:00:00.000Z',
      description: 'Almuerzo',
      amount: 5000,
      category: 'comida'
    })

    const updatedStore = useDataStore.getState()
    expect(updatedStore.expenses.length).toBe(1)
    expect(updatedStore.expenses[0].description).toBe('Almuerzo')
    expect(updatedStore.expenses[0].amount).toBe(5000)
    expect(updatedStore.expenses[0].category).toBe('comida')
  })

  it('should delete an expense correctly', () => {
    const store = useDataStore.getState()
    
    // Add one expense
    store.addExpense({
      date: '2023-10-01T12:00:00.000Z',
      description: 'Almuerzo',
      amount: 5000,
      category: 'comida'
    })

    const stateWithExpense = useDataStore.getState()
    expect(stateWithExpense.expenses.length).toBe(1)
    const expenseId = stateWithExpense.expenses[0].id

    // Delete it
    stateWithExpense.deleteExpense(expenseId)

    const finalState = useDataStore.getState()
    expect(finalState.expenses.length).toBe(0)
  })

  it('should update an existing expense', () => {
    const store = useDataStore.getState()
    
    // Add one expense
    store.addExpense({
      date: '2023-10-01T12:00:00.000Z',
      description: 'Almuerzo',
      amount: 5000,
      category: 'comida'
    })

    const stateWithExpense = useDataStore.getState()
    const expenseId = stateWithExpense.expenses[0].id

    // Update it
    stateWithExpense.updateExpense(expenseId, {
      description: 'Cena elegante',
      amount: 15000,
      category: 'comida' // changed the amount and description
    })

    const finalState = useDataStore.getState()
    expect(finalState.expenses[0].description).toBe('Cena elegante')
    expect(finalState.expenses[0].amount).toBe(15000)
  })

  it('should add a category correctly', () => {
    const store = useDataStore.getState()
    expect(store.categories.length).toBe(2)

    store.addCategory({ name: 'entretenimiento', color: 'bg-purple-500', emoji: '🎮' })

    const updatedStore = useDataStore.getState()
    expect(updatedStore.categories.length).toBe(3)
    expect(updatedStore.categories[2].name).toBe('entretenimiento')
  })

  it('should return { success: false, reason: "duplicate" } for duplicate category', () => {
    const store = useDataStore.getState()
    store.addCategory({ name: 'comida-duplicada', color: 'rose', emoji: '🍔' })
    const result = store.addCategory({ name: 'comida-duplicada', color: 'rose', emoji: '🍔' })
    expect(result.success).toBe(false)
    expect(result.reason).toBe('duplicate')
  })

  it('should add an installment correctly', () => {
    const store = useDataStore.getState()
    expect(store.installments.length).toBe(0)

    store.addInstallment({
      id: 'inst_1',
      description: 'Laptop',
      totalAmount: 1000000,
      hasInterest: false,
      monthlyAmount: 100000,
      totalInstallments: 10,
      firstPaymentMonth: '05-2023',
      category: 'otros',
      appliedMonths: [],
      skippedMonths: []
    })

    const updatedStore = useDataStore.getState()
    expect(updatedStore.installments.length).toBe(1)
    expect(updatedStore.installments[0].description).toBe('Laptop')
  })

  it('should apply an installment to a month and link the expense', () => {
    useDataStore.getState().addInstallment({
      description: 'Laptop',
      totalAmount: 1000000,
      hasInterest: false,
      monthlyAmount: 100000,
      totalInstallments: 10,
      firstPaymentMonth: '05-2023',
      category: 'otros',
      appliedMonths: [],
      skippedMonths: []
    })

    const store = useDataStore.getState()
    const instId = store.installments[0].id
    store.applyInstallmentToMonth(instId, '06-2023')

    const stateWithExpense = useDataStore.getState()
    expect(stateWithExpense.installments[0].appliedMonths).toContain('06-2023')
    
    // Check linked expense
    expect(stateWithExpense.expenses.length).toBe(1)
    const expense = stateWithExpense.expenses[0]
    expect(expense.linkedInstallmentId).toBe(instId)
    expect(expense.linkedMonth).toBe('06-2023')
  })

  it('should unlink the installment if the linked expense is deleted', () => {
    useDataStore.getState().addInstallment({
      description: 'Phone',
      totalAmount: 500000,
      hasInterest: false,
      monthlyAmount: 50000,
      totalInstallments: 10,
      firstPaymentMonth: '05-2023',
      category: 'otros',
      appliedMonths: [],
      skippedMonths: []
    })

    let store = useDataStore.getState()
    const instId = store.installments[0].id
    store.applyInstallmentToMonth(instId, '06-2023')

    store = useDataStore.getState()
    expect(store.installments[0].appliedMonths).toContain('06-2023')
    const expenseId = store.expenses[0].id

    // Delete the expense
    store.deleteExpense(expenseId)

    const finalState = useDataStore.getState()
    expect(finalState.expenses.length).toBe(0)
    // The installment should be un-applied
    expect(finalState.installments[0].appliedMonths).not.toContain('06-2023')
  })
})
