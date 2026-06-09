import { getInitialData } from '../storeUtils'

export const createCoreSlice = (set, get) => ({
    salaries: getInitialData('salaries', {}),
    lastSeenMonth: getInitialData('lastSeenMonth', null),
    _hasHydrated: false,

    setSalaries: (updater) => set((state) => ({ salaries: typeof updater === 'function' ? updater(state.salaries) : updater })),

    handleSalaryChange: (monthKey, numericValue) => set((state) => ({
        salaries: {
            ...state.salaries,
            [monthKey]: numericValue
        }
    })),

    setLastSeenMonth: (monthKey) => set({ lastSeenMonth: monthKey }),
    setHasHydrated: () => set({ _hasHydrated: true })
})
