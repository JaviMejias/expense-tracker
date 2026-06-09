import { getDaysInMonth } from 'date-fns'
import { generateId, getInitialData } from '../storeUtils'

export const createSavingsGoalsSlice = (set, get) => ({
    savingsGoals: getInitialData('savingsGoals', []),

    setSavingsGoals: (updater) => set((state) => ({ savingsGoals: typeof updater === 'function' ? updater(state.savingsGoals) : updater })),

    addSavingsGoal: (newGoal) => set((state) => {
        const goalToAdd = {
            id: generateId('goal'),
            title: newGoal.title.trim(),
            targetAmount: newGoal.targetAmount,
            currentSaved: 0,
            deadline: newGoal.deadline,
            color: newGoal.color || 'indigo',
            contributions: []
        }
        return { savingsGoals: [...state.savingsGoals, goalToAdd] }
    }),

    getSavingsGoalForDeletion: (goalId) => {
        const goal = get().savingsGoals.find(g => g.id === goalId)
        return goal || null
    },

    confirmDeleteSavingsGoal: (goalId) => {
        set((state) => ({ savingsGoals: state.savingsGoals.filter(g => g.id !== goalId) }))
    },

    deleteSavingsGoal: () => {}, // Kept for backward compatibility

    contributeToGoal: (goalId, amountToContribute, currentMonthDate) => {
        let isCompleted = false
        const state = get()
        const targetGoal = state.savingsGoals.find(g => g.id === goalId)
        
        if (targetGoal) {
            set((s) => {
                const contribution = {
                    id: generateId('contrib'),
                    amount: amountToContribute,
                    date: new Date().toISOString()
                }

                const newGoals = s.savingsGoals.map(g => {
                    if (g.id === goalId) {
                        const updatedSaved = g.currentSaved + amountToContribute
                        if (updatedSaved >= g.targetAmount) isCompleted = true
                        return {
                            ...g,
                            currentSaved: Math.min(updatedSaved, g.targetAmount),
                            contributions: [...(g.contributions || []), contribution]
                        }
                    }
                    return g
                })
                
                const expenseDateObj = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), Math.min(new Date().getDate(), getDaysInMonth(currentMonthDate)))
                const newExpense = {
                    id: generateId('exp'),
                    date: expenseDateObj.toISOString(),
                    description: `Ahorro: ${targetGoal.title}`,
                    amount: amountToContribute,
                    category: 'otros'
                }
                
                return { savingsGoals: newGoals, expenses: [...s.expenses, newExpense] }
            })
        }
        return isCompleted
    }
})
