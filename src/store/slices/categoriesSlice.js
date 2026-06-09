import { colorThemes } from '../../utils/theme'
import { generateId, getInitialData } from '../storeUtils'

const defaultCategories = [
    { id: 'comida', name: 'Comida', emoji: '🍔', color: 'rose', colorClass: 'border-rose-500/20 text-rose-400 bg-rose-500/5 hover:bg-rose-500/10', activeClass: 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/30' },
    { id: 'servicios', name: 'Servicios', emoji: '⚡', color: 'blue', colorClass: 'border-blue-500/20 text-blue-400 bg-blue-500/5 hover:bg-blue-500/10', activeClass: 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/30' },
    { id: 'transporte', name: 'Transporte', emoji: '🚗', color: 'amber', colorClass: 'border-amber-500/20 text-amber-400 bg-amber-500/5 hover:bg-amber-500/10', activeClass: 'bg-amber-500 text-slate-950 border-amber-500 shadow-lg shadow-amber-500/30 font-extrabold' },
    { id: 'otros', name: 'Otros', emoji: '🏷️', color: 'slate', colorClass: 'border-slate-600/20 text-slate-400 bg-slate-800/10 hover:bg-slate-700/20', activeClass: 'bg-slate-600 text-white border-slate-500 shadow-lg shadow-slate-500/30' }
]

export const createCategoriesSlice = (set, get) => ({
    categoryLimits: getInitialData('categoryLimits', {}),
    categories: getInitialData('categories', defaultCategories),

    setCategoryLimits: (updater) => set((state) => ({ categoryLimits: typeof updater === 'function' ? updater(state.categoryLimits) : updater })),
    setCategories: (updater) => set((state) => ({ categories: typeof updater === 'function' ? updater(state.categories) : updater })),

    handleSetCategoryLimit: (catId, numericLimit) => set((state) => {
        const updated = { ...state.categoryLimits }
        if (numericLimit > 0) {
            updated[catId] = numericLimit
        } else {
            delete updated[catId]
        }
        return { categoryLimits: updated }
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

    updateCategory: (catId, updatedFields) => {
        const state = get()
        const nameLower = updatedFields.name.trim().toLowerCase()
        const isDuplicate = state.categories.some(c => c.id !== catId && c.name.toLowerCase() === nameLower)
        if (isDuplicate) return { success: false, reason: 'duplicate' }

        const theme = colorThemes[updatedFields.color] || colorThemes.slate
        set((s) => ({
            categories: s.categories.map(cat =>
                cat.id === catId
                    ? {
                        ...cat,
                        name: updatedFields.name.trim(),
                        emoji: (updatedFields.emoji || '').trim() || '🏷️',
                        color: updatedFields.color,
                        colorClass: theme.bg,
                        activeClass: theme.active
                      }
                    : cat
            )
        }))
        return { success: true }
    },

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

    deleteCategory: () => {} // Kept for backward compatibility
})
