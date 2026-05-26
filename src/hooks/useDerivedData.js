import { useDataStore } from '../store/useDataStore'
import { useUIStore } from '../store/useUIStore'
import { format, parseISO } from 'date-fns'
import { formatCLP } from '../utils/currency'

export function useDerivedData() {
    const { salaries, expenses } = useDataStore()
    const { currentMonthDate } = useUIStore()

    const currentMonthKey = format(currentMonthDate, 'MM-yyyy')
    const currentSalary = salaries[currentMonthKey] || 0
    const currentMonthExpenses = expenses.filter(exp => format(parseISO(exp.date), 'MM-yyyy') === currentMonthKey)
    const totalExpenses = currentMonthExpenses.reduce((acc, curr) => acc + curr.amount, 0)
    const remainingSalary = currentSalary - totalExpenses
    const displaySalary = currentSalary > 0 ? formatCLP(currentSalary) : ''

    return {
        currentMonthKey,
        currentSalary,
        currentMonthExpenses,
        totalExpenses,
        remainingSalary,
        displaySalary
    }
}
