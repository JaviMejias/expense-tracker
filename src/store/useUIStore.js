import { create } from 'zustand'

export const useUIStore = create((set) => ({
    currentMonthDate: new Date(),
    setCurrentMonthDate: (date) => set({ currentMonthDate: date }),

    expenseDate: new Date(),
    setExpenseDate: (date) => set({ expenseDate: date }),

    description: '',
    setDescription: (desc) => set({ description: desc }),

    amount: '',
    setAmount: (amt) => set({ amount: amt }),

    category: 'otros',
    setCategory: (cat) => set({ category: cat }),

    editingId: null,
    setEditingId: (id) => set({ editingId: id }),

    errors: {},
    setErrors: (errs) => set((state) => ({ errors: typeof errs === 'function' ? errs(state.errors) : errs })),

    resetForm: () => set({
        expenseDate: new Date(),
        description: '',
        amount: '',
        category: 'otros',
        editingId: null,
        errors: {}
    }),
}))
