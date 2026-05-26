import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { parseISO, getDaysInMonth, getDay, format } from 'date-fns'
import { colorThemes } from '../utils/theme'

const generateId = (prefix = 'id') => `${prefix}_${crypto.randomUUID()}`

// Función para migrar datos antiguos si existen
const getInitialData = (key, defaultVal) => {
    try {
        const savedData = localStorage.getItem('expenseTrackerV6')
        if (savedData) {
            const parsedData = JSON.parse(savedData)
            if (parsedData[key] !== undefined) return parsedData[key]
        }
    } catch (e) {
        console.error("Error reading legacy data", e)
    }
    return defaultVal
}

const defaultCategories = [
    { id: 'comida', name: 'Comida', emoji: '🍔', color: 'rose', colorClass: 'border-rose-500/20 text-rose-400 bg-rose-500/5 hover:bg-rose-500/10', activeClass: 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/30' },
    { id: 'servicios', name: 'Servicios', emoji: '⚡', color: 'blue', colorClass: 'border-blue-500/20 text-blue-400 bg-blue-500/5 hover:bg-blue-500/10', activeClass: 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/30' },
    { id: 'transporte', name: 'Transporte', emoji: '🚗', color: 'amber', colorClass: 'border-amber-500/20 text-amber-400 bg-amber-500/5 hover:bg-amber-500/10', activeClass: 'bg-amber-500 text-slate-950 border-amber-500 shadow-lg shadow-amber-500/30 font-extrabold' },
    { id: 'otros', name: 'Otros', emoji: '🏷️', color: 'slate', colorClass: 'border-slate-600/20 text-slate-400 bg-slate-800/10 hover:bg-slate-700/20', activeClass: 'bg-slate-600 text-white border-slate-500 shadow-lg shadow-slate-500/30' }
]

export const useDataStore = create(
    persist(
        (set, get) => ({
            salaries: getInitialData('salaries', {}),
            expenses: getInitialData('expenses', []),
            fixedExpenses: getInitialData('fixedExpenses', []),
            categoryLimits: getInitialData('categoryLimits', {}),
            categories: getInitialData('categories', defaultCategories),
            savingsGoals: getInitialData('savingsGoals', []),

            setSalaries: (updater) => set((state) => ({ salaries: typeof updater === 'function' ? updater(state.salaries) : updater })),
            setExpenses: (updater) => set((state) => ({ expenses: typeof updater === 'function' ? updater(state.expenses) : updater })),
            setFixedExpenses: (updater) => set((state) => ({ fixedExpenses: typeof updater === 'function' ? updater(state.fixedExpenses) : updater })),
            setCategoryLimits: (updater) => set((state) => ({ categoryLimits: typeof updater === 'function' ? updater(state.categoryLimits) : updater })),
            setCategories: (updater) => set((state) => ({ categories: typeof updater === 'function' ? updater(state.categories) : updater })),
            setSavingsGoals: (updater) => set((state) => ({ savingsGoals: typeof updater === 'function' ? updater(state.savingsGoals) : updater })),

            handleSalaryChange: (monthKey, numericValue) => set((state) => ({
                salaries: {
                    ...state.salaries,
                    [monthKey]: numericValue
                }
            })),

            handleSetCategoryLimit: (catId, numericLimit) => set((state) => {
                const updated = { ...state.categoryLimits }
                if (numericLimit > 0) {
                    updated[catId] = numericLimit
                } else {
                    delete updated[catId]
                }
                return { categoryLimits: updated }
            }),

            addExpense: (expense) => set((state) => ({
                expenses: [...state.expenses, { ...expense, id: generateId('exp') }]
            })),

            updateExpense: (id, updatedExpense) => set((state) => ({
                expenses: state.expenses.map(exp => exp.id === id ? { ...exp, ...updatedExpense } : exp)
            })),

            deleteExpense: (idOrIds) => set((state) => {
                if (Array.isArray(idOrIds)) {
                    return { expenses: state.expenses.filter(exp => !idOrIds.includes(exp.id)) }
                } else {
                    return { expenses: state.expenses.filter(exp => exp.id !== idOrIds) }
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
            }),

            addCategory: (newCat) => {
                const state = get()
                const nameLower = newCat.name.trim().toLowerCase()
                if (state.categories.some(c => c.name.toLowerCase() === nameLower)) {
                    return { success: false, reason: 'duplicate' }
                }

                const theme = colorThemes[newCat.color] || colorThemes.slate
                const categoryToAdd = {
                    id: generateId('cat'),
                    name: newCat.name.trim(),
                    emoji: newCat.emoji.trim() || '🏷️',
                    color: newCat.color,
                    colorClass: theme.bg,
                    activeClass: theme.active
                }

                set({ categories: [...state.categories, categoryToAdd] })
                return { success: true }
            },

            // Returns the category name for the component to show the confirmation dialog.
            // The actual deletion is done by confirmDeleteCategory after user confirms.
            getCategoryForDeletion: (catId) => {
                const state = get()
                const systemIds = ['comida', 'servicios', 'transporte', 'entretencion', 'salud', 'otros']
                if (systemIds.includes(catId)) return { success: false, reason: 'system' }
                const category = state.categories.find(c => c.id === catId)
                if (!category) return { success: false, reason: 'not_found' }
                return { success: true, category }
            },

            confirmDeleteCategory: (catId) => {
                set((s) => {
                    const newExpenses = s.expenses.map(exp => exp.category === catId ? { ...exp, category: 'otros' } : exp)
                    const newFixed = s.fixedExpenses.map(fixed => fixed.category === catId ? { ...fixed, category: 'otros' } : fixed)
                    const newLimits = { ...s.categoryLimits }
                    delete newLimits[catId]
                    const newCats = s.categories.filter(c => c.id !== catId)
                    return { expenses: newExpenses, fixedExpenses: newFixed, categoryLimits: newLimits, categories: newCats }
                })
            },

            // Kept for backward compatibility — components that call deleteCategory directly
            deleteCategory: () => {},


            addSavingsGoal: (newGoal) => set((state) => {
                const goalToAdd = {
                    id: generateId('goal'),
                    title: newGoal.title.trim(),
                    targetAmount: newGoal.targetAmount,
                    currentSaved: 0,
                    deadline: newGoal.deadline,
                    color: newGoal.color || 'indigo'
                }
                return { savingsGoals: [...state.savingsGoals, goalToAdd] }
            }),

            // Returns the goal object so the component can show a confirmation dialog.
            getSavingsGoalForDeletion: (goalId) => {
                const goal = get().savingsGoals.find(g => g.id === goalId)
                return goal || null
            },

            confirmDeleteSavingsGoal: (goalId) => {
                set((state) => ({ savingsGoals: state.savingsGoals.filter(g => g.id !== goalId) }))
            },

            // Kept for backward compatibility
            deleteSavingsGoal: () => {},


            contributeToGoal: (goalId, amountToContribute, currentMonthDate) => {
                let isCompleted = false
                const state = get()
                const targetGoal = state.savingsGoals.find(g => g.id === goalId)
                
                if (targetGoal) {
                    set((s) => {
                        const newGoals = s.savingsGoals.map(g => {
                            if (g.id === goalId) {
                                const updatedSaved = g.currentSaved + amountToContribute
                                if (updatedSaved >= g.targetAmount) {
                                    isCompleted = true
                                }
                                return { ...g, currentSaved: Math.min(updatedSaved, g.targetAmount) }
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
        }),
        {
            name: 'expenseTracker-data'
        }
    )
)
