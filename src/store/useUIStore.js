import { create } from 'zustand'

export const useUIStore = create((set) => ({
    currentMonthDate: new Date(),
    setCurrentMonthDate: (date) => set({ currentMonthDate: date }),
    
    errors: {},
    setErrors: (errs) => set((state) => ({ errors: typeof errs === 'function' ? errs(state.errors) : errs }))
}))
