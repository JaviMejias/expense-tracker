import { generateId, getInitialData } from '../storeUtils'

export const createInstallmentsSlice = (set, get) => ({
    installments: getInitialData('installments', []),

    addInstallment: (data) => set((state) => ({
        installments: [...(state.installments || []), {
            id: generateId('inst'),
            description: data.description,
            totalAmount: data.totalAmount,
            hasInterest: data.hasInterest,
            monthlyAmount: data.monthlyAmount,
            totalInstallments: data.totalInstallments,
            purchaseDate: data.purchaseDate,
            firstPaymentMonth: data.firstPaymentMonth,
            category: data.category || 'otros',
            appliedMonths: data.appliedMonths || [],
            skippedMonths: [],
        }]
    })),

    deleteInstallment: (id) => set((state) => ({
        installments: (state.installments || []).filter(inst => inst.id !== id)
    })),

    applyInstallmentToMonth: (id, monthKey) => set((state) => {
        const inst = (state.installments || []).find(i => i.id === id)
        if (!inst) return {}
        const [mm, yyyy] = monthKey.split('-').map(Number)
        const expenseDate = new Date(yyyy, mm - 1, 1)
        const [fMM, fYYYY] = inst.firstPaymentMonth.split('-').map(Number)
        const installmentNum = (yyyy * 12 + mm) - (fYYYY * 12 + fMM) + 1
        const newExpense = {
            id: generateId('exp'),
            date: expenseDate.toISOString(),
            description: `${inst.description} (cuota ${installmentNum}/${inst.totalInstallments})`,
            amount: inst.monthlyAmount,
            category: inst.category || 'otros',
            linkedInstallmentId: id,
            linkedMonth: monthKey
        }
        return {
            installments: state.installments.map(i =>
                i.id === id
                    ? {
                        ...i,
                        appliedMonths: [...i.appliedMonths, monthKey],
                        skippedMonths: (i.skippedMonths || []).filter(m => m !== monthKey)
                      }
                    : i
            ),
            expenses: [...state.expenses, newExpense]
        }
    }),

    skipInstallmentMonth: (id, monthKey) => set((state) => ({
        installments: (state.installments || []).map(i =>
            i.id === id
                ? { ...i, skippedMonths: [...(i.skippedMonths || []), monthKey] }
                : i
        )
    }))
})
