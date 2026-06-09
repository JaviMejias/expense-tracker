import { create } from 'zustand'
import { persist } from 'zustand/middleware'

import { createCoreSlice } from './slices/coreSlice'
import { createExpensesSlice } from './slices/expensesSlice'
import { createCategoriesSlice } from './slices/categoriesSlice'
import { createInstallmentsSlice } from './slices/installmentsSlice'
import { createSavingsGoalsSlice } from './slices/savingsGoalsSlice'

export const useDataStore = create(
    persist(
        (set, get) => ({
            ...createCoreSlice(set, get),
            ...createExpensesSlice(set, get),
            ...createCategoriesSlice(set, get),
            ...createInstallmentsSlice(set, get),
            ...createSavingsGoalsSlice(set, get),
        }),
        {
            name: 'expenseTracker-data',
            partialize: (state) => {
                // Excluir _hasHydrated y setHasHydrated de la persistencia (son flags de runtime)
                const { _hasHydrated, setHasHydrated, ...persisted } = state
                return persisted
            },
            onRehydrateStorage: () => (state) => {
                state?.setHasHydrated()
            }
        }
    )
)
