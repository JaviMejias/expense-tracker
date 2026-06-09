import { parseISO, format, getDaysInMonth, getDay } from 'date-fns'
import { generateId, getInitialData } from '../storeUtils'

export const createExpensesSlice = (set, get) => ({
    expenses: getInitialData('expenses', []),
    fixedExpenses: getInitialData('fixedExpenses', []),
    
    setExpenses: (updater) => set((state) => ({ expenses: typeof updater === 'function' ? updater(state.expenses) : updater })),
    setFixedExpenses: (updater) => set((state) => ({ fixedExpenses: typeof updater === 'function' ? updater(state.fixedExpenses) : updater })),

    addExpense: (expense) => set((state) => ({
        expenses: [...state.expenses, { ...expense, id: generateId('exp') }]
    })),

    updateExpense: (id, updatedExpense) => set((state) => ({
        expenses: state.expenses.map(exp => exp.id === id ? { ...exp, ...updatedExpense } : exp)
    })),

    bulkUpdateExpenseCategory: (ids, newCategoryId) => set((state) => ({
        expenses: state.expenses.map(exp =>
            ids.includes(exp.id) ? { ...exp, category: newCategoryId } : exp
        )
    })),

    registerReimbursement: (id, amount) => set((state) => ({
        expenses: state.expenses.map(exp => {
            if (exp.id === id) {
                const currentReimbursed = exp.reimbursedAmount || 0
                return { ...exp, reimbursedAmount: currentReimbursed + amount }
            }
            return exp
        })
    })),

    forgiveReimbursement: (id) => set((state) => ({
        expenses: state.expenses.map(exp => exp.id === id ? { ...exp, isForgiven: true } : exp)
    })),

    deleteExpense: (idOrIds) => set((state) => {
        const idsToDelete = Array.isArray(idOrIds) ? idOrIds : [idOrIds]
        const expensesToDelete = state.expenses.filter(exp => idsToDelete.includes(exp.id))
        
        let newInstallments = state.installments ? [...state.installments] : []
        expensesToDelete.forEach(exp => {
            if (exp.linkedInstallmentId && exp.linkedMonth) {
                newInstallments = newInstallments.map(inst => {
                    if (inst.id === exp.linkedInstallmentId) {
                        return {
                            ...inst,
                            appliedMonths: (inst.appliedMonths || []).filter(m => m !== exp.linkedMonth)
                        }
                    }
                    return inst
                })
            }
        })

        return { 
            expenses: state.expenses.filter(exp => !idsToDelete.includes(exp.id)),
            installments: newInstallments
        }
    }),

    duplicateExpenses: (ids, currentMonthDate) => set((state) => {
        const expensesToDuplicate = state.expenses.filter(exp => ids.includes(exp.id))
        const duplicated = expensesToDuplicate.map(exp => {
            const originalDate = parseISO(exp.date)
            const targetDate = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), originalDate.getDate())
            return {
                ...exp,
                id: generateId('exp'),
                date: targetDate.toISOString()
            }
        })
        return { expenses: [...state.expenses, ...duplicated] }
    }),

    applyFixedExpenseToMonth: (fixedExpense, currentMonthDate) => set((state) => {
        const year = currentMonthDate.getFullYear()
        const month = currentMonthDate.getMonth()
        const currentMonthKey = format(currentMonthDate, 'MM-yyyy')
        const newExpenses = [...state.expenses]

        if (fixedExpense.type === 'single') {
            const firstDayOfMonth = new Date(year, month, 1)
            newExpenses.push({
                id: generateId('exp'),
                date: firstDayOfMonth.toISOString(),
                description: fixedExpense.description,
                amount: fixedExpense.amount,
                category: fixedExpense.category || 'otros'
            })
        } else if (fixedExpense.type === 'weekly') {
            const daysInCurrentMonth = getDaysInMonth(currentMonthDate)
            for (let i = 1; i <= daysInCurrentMonth; i++) {
                const dateToCheck = new Date(year, month, i)
                if (fixedExpense.days.includes(getDay(dateToCheck))) {
                    newExpenses.push({
                        id: generateId('exp'),
                        date: dateToCheck.toISOString(),
                        description: fixedExpense.description,
                        amount: fixedExpense.amount,
                        category: fixedExpense.category || 'otros'
                    })
                }
            }
        }

        const newFixedExpenses = state.fixedExpenses.map(item => {
            if (item.id === fixedExpense.id) {
                const applied = item.appliedMonths || []
                if (!applied.includes(currentMonthKey)) {
                    return { ...item, appliedMonths: [...applied, currentMonthKey] }
                }
            }
            return item
        })

        return { expenses: newExpenses, fixedExpenses: newFixedExpenses }
    })
})
