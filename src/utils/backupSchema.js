import { z } from 'zod'

export const expenseSchema = z.object({
    id: z.union([z.string(), z.number()]), // Legacy backups might have numeric IDs
    description: z.string().min(1, 'La descripción del gasto no puede estar vacía'),
    amount: z.number().min(0, 'El monto del gasto debe ser un número positivo'),
    category: z.string().min(1, 'La categoría del gasto no puede estar vacía'),
    date: z.string().datetime({ message: 'La fecha del gasto debe ser un formato ISO válido' }),
    linkedInstallmentId: z.union([z.string(), z.number()]).optional(),
    linkedMonth: z.string().optional(),
})

export const fixedExpenseSchema = z.object({
    id: z.union([z.string(), z.number()]),
    description: z.string().min(1, 'La descripción del gasto fijo no puede estar vacía'),
    amount: z.number().min(0, 'El monto del gasto fijo debe ser un número positivo'),
    type: z.enum(['single', 'weekly'], { errorMap: () => ({ message: 'El tipo de gasto fijo debe ser single o weekly' }) }),
    days: z.array(z.number().min(0).max(6)).default([]),
    category: z.string().default('otros'),
    appliedMonths: z.array(z.string()).default([]),
})

export const categorySchema = z.object({
    id: z.union([z.string(), z.number()]),
    name: z.string().min(1, 'El nombre de la categoría no puede estar vacío'),
    emoji: z.string().default('🏷️'),
    color: z.string().default('slate'),
    colorClass: z.string().optional(),
    activeClass: z.string().optional(),
})

export const savingsGoalSchema = z.object({
    id: z.union([z.string(), z.number()]),
    title: z.string().min(1, 'El título de la meta no puede estar vacío'),
    targetAmount: z.number().min(1, 'El monto objetivo de la meta debe ser mayor a 0'),
    currentSaved: z.number().min(0).default(0),
    deadline: z.string().datetime({ message: 'La fecha límite de la meta debe ser un formato ISO válido' }).optional().or(z.literal('')),
    color: z.string().default('indigo'),
})

export const installmentSchema = z.object({
    id: z.union([z.string(), z.number()]),
    description: z.string().min(1, 'La descripción de la cuota no puede estar vacía'),
    totalAmount: z.number().min(0),
    hasInterest: z.boolean().default(false),
    monthlyAmount: z.number().min(0),
    totalInstallments: z.number().min(1),
    firstPaymentMonth: z.string(),
    category: z.string().default('otros'),
    appliedMonths: z.array(z.string()).default([]),
    skippedMonths: z.array(z.string()).default([]),
})

export const backupSchema = z.object({
    salaries: z.record(z.string(), z.number()).default({}),
    expenses: z.array(expenseSchema).default([]),
    fixedExpenses: z.array(fixedExpenseSchema).default([]),
    categoryLimits: z.record(z.string(), z.number()).default({}),
    categories: z.array(categorySchema).min(1, 'El respaldo debe contener al menos las categorías por defecto'),
    savingsGoals: z.array(savingsGoalSchema).default([]),
    installments: z.array(installmentSchema).default([]),
    lastSeenMonth: z.string().nullable().optional(),
    currentTheme: z.string().optional(),
    themeMode: z.enum(['dark', 'light']).optional()
})
