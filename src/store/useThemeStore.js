import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useThemeStore = create(
    persist(
        (set) => ({
            themeMode: 'dark',
            currentTheme: 'classic',
            setThemeMode: (mode) => set({ themeMode: mode }),
            setCurrentTheme: (theme) => set({ currentTheme: theme }),
        }),
        {
            name: 'expenseTracker-theme',
        }
    )
)
