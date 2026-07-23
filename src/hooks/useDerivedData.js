import { useMemo } from 'react'
import { useDataStore } from '../store/useDataStore'
import { useUIStore } from '../store/useUIStore'
import { format, parseISO, startOfMonth, isBefore, parse } from 'date-fns'
import { formatCLP } from '../utils/currency'

export function useDerivedData() {
    const { salaries, expenses } = useDataStore()
    const { currentMonthDate } = useUIStore()

    const currentMonthKey = format(currentMonthDate, 'MM-yyyy')
    const currentSalary = salaries[currentMonthKey] || 0

    const monthStart = startOfMonth(currentMonthDate)

    const previousBalance = useMemo(() => {
        let totalPreviousSalaries = 0
        Object.entries(salaries).forEach(([key, amount]) => {
            const salaryDate = parse(key, 'MM-yyyy', new Date())
            if (isBefore(salaryDate, monthStart)) {
                totalPreviousSalaries += amount
            }
        })

        const totalPreviousExpenses = expenses
            .filter(exp => isBefore(parseISO(exp.date), monthStart))
            .reduce((acc, curr) => acc + (curr.amount - (curr.reimbursedAmount || 0)), 0)

        return totalPreviousSalaries - totalPreviousExpenses
    }, [salaries, expenses, monthStart])

    const currentMonthExpenses = useMemo(
        () => expenses.filter(exp => format(parseISO(exp.date), 'MM-yyyy') === currentMonthKey),
        [expenses, currentMonthKey]
    )

    const totalExpenses = useMemo(
        () => currentMonthExpenses.reduce((acc, curr) => acc + (curr.amount - (curr.reimbursedAmount || 0)), 0),
        [currentMonthExpenses]
    )

    const totalAvailable = previousBalance + currentSalary
    const remainingSalary = totalAvailable - totalExpenses
    const displaySalary = currentSalary > 0 ? formatCLP(currentSalary) : ''

    const totalPendingReimbursements = useMemo(() => {
        return expenses
            .filter(exp => exp.isReimbursable && !exp.isForgiven)
            .reduce((acc, exp) => acc + Math.max(0, exp.amount - (exp.reimbursedAmount || 0)), 0)
    }, [expenses])

    return {
        currentMonthKey,
        currentSalary,
        previousBalance,
        totalAvailable,
        currentMonthExpenses,
        totalExpenses,
        remainingSalary,
        displaySalary,
        totalPendingReimbursements
    }
}
