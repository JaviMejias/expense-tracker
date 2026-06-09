import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useSettingsStore = create(
    persist(
        (set) => ({
            geminiApiKey: '',
            setGeminiApiKey: (key) => set({ geminiApiKey: key }),
        }),
        {
            name: 'expenseTracker-settings',
        }
    )
)
