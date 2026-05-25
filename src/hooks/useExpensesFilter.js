import { useMemo } from 'react'
import { parseISO, startOfDay, endOfDay } from 'date-fns'

export function useExpensesFilter(expenses, startDate, endDate, searchQuery, sortBy, categoryStyles) {
    const filteredExpenses = useMemo(() => {
        return expenses.filter(expense => {
            const expenseDate = parseISO(expense.date)
            const matchesDate = expenseDate >= startOfDay(startDate) && expenseDate <= endOfDay(endDate)

            const searchLower = searchQuery.toLowerCase().trim()
            const catObj = categoryStyles[expense.category] || categoryStyles['otros']
            const matchesSearch = !searchLower ||
                expense.description.toLowerCase().includes(searchLower) ||
                (expense.category && expense.category.toLowerCase().includes(searchLower)) ||
                (catObj && catObj.label.toLowerCase().includes(searchLower))

            return matchesDate && matchesSearch
        })
    }, [expenses, startDate, endDate, searchQuery, categoryStyles])

    const sortedExpenses = useMemo(() => {
        return [...filteredExpenses].sort((a, b) => {
            if (sortBy === 'date-desc') {
                return new Date(b.date).getTime() - new Date(a.date).getTime()
            } else if (sortBy === 'date-asc') {
                return new Date(a.date).getTime() - new Date(b.date).getTime()
            } else if (sortBy === 'amount-desc') {
                return b.amount - a.amount
            } else if (sortBy === 'amount-asc') {
                return a.amount - b.amount
            } else if (sortBy === 'desc-az') {
                return a.description.localeCompare(b.description)
            }
            return 0
        })
    }, [filteredExpenses, sortBy])

    return { filteredExpenses, sortedExpenses }
}