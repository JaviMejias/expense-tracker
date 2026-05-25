import { useState, useEffect } from 'react'
import { format, parseISO, getDaysInMonth, getDay } from 'date-fns'
import Swal from 'sweetalert2'
import { formatCLP, parseCLP } from '../utils/currency'
import { colorThemes } from '../utils/theme'


export function useExpenseTracker() {
    const [activeTab, setActiveTab] = useState('dashboard')
    const [currentMonthDate, setCurrentMonthDate] = useState(new Date())

    const [salaries, setSalaries] = useState(() => {
        const savedData = localStorage.getItem('expenseTrackerV6')
        if (savedData) {
            const parsedData = JSON.parse(savedData)
            return parsedData.salaries || {}
        }
        return {}
    })

    const [expenses, setExpenses] = useState(() => {
        const savedData = localStorage.getItem('expenseTrackerV6')
        if (savedData) {
            const parsedData = JSON.parse(savedData)
            return parsedData.expenses || []
        }
        return []
    })

    const [fixedExpenses, setFixedExpenses] = useState(() => {
        const savedData = localStorage.getItem('expenseTrackerV6')
        if (savedData) {
            const parsedData = JSON.parse(savedData)
            return parsedData.fixedExpenses || []
        }
        return []
    })

    const [categoryLimits, setCategoryLimits] = useState(() => {
        const savedData = localStorage.getItem('expenseTrackerV6')
        if (savedData) {
            const parsedData = JSON.parse(savedData)
            return parsedData.categoryLimits || {}
        }
        return {}
    })

    const [categories, setCategories] = useState(() => {
        const savedData = localStorage.getItem('expenseTrackerV6')
        if (savedData) {
            const parsedData = JSON.parse(savedData)
            if (parsedData.categories) return parsedData.categories
        }
        return [
            { id: 'comida', name: 'Comida', emoji: '🍔', color: 'rose', colorClass: 'border-rose-500/20 text-rose-400 bg-rose-500/5 hover:bg-rose-500/10', activeClass: 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/30' },
            { id: 'servicios', name: 'Servicios', emoji: '⚡', color: 'blue', colorClass: 'border-blue-500/20 text-blue-400 bg-blue-500/5 hover:bg-blue-500/10', activeClass: 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/30' },
            { id: 'transporte', name: 'Transporte', emoji: '🚗', color: 'amber', colorClass: 'border-amber-500/20 text-amber-400 bg-amber-500/5 hover:bg-amber-500/10', activeClass: 'bg-amber-500 text-slate-950 border-amber-500 shadow-lg shadow-amber-500/30 font-extrabold' },
            { id: 'otros', name: 'Otros', emoji: '🏷️', color: 'slate', colorClass: 'border-slate-600/20 text-slate-400 bg-slate-800/10 hover:bg-slate-700/20', activeClass: 'bg-slate-600 text-white border-slate-500 shadow-lg shadow-slate-500/30' }
        ]
    })

    const [savingsGoals, setSavingsGoals] = useState(() => {
        const savedData = localStorage.getItem('expenseTrackerV6')
        if (savedData) {
            const parsedData = JSON.parse(savedData)
            return parsedData.savingsGoals || []
        }
        return []
    })

    const [currentTheme, setCurrentTheme] = useState(() => {
        const savedData = localStorage.getItem('expenseTrackerV6')
        if (savedData) {
            const parsedData = JSON.parse(savedData)
            return parsedData.currentTheme || 'classic'
        }
        return 'classic'
    })

    const [themeMode, setThemeMode] = useState(() => {
        const savedData = localStorage.getItem('expenseTrackerV6')
        if (savedData) {
            const parsedData = JSON.parse(savedData)
            return parsedData.themeMode || 'dark'
        }
        return 'dark'
    })

    const [expenseDate, setExpenseDate] = useState(new Date())
    const [description, setDescription] = useState('')
    const [amount, setAmount] = useState('')
    const [category, setCategory] = useState('otros')
    const [editingId, setEditingId] = useState(null)
    const [errors, setErrors] = useState({})

    useEffect(() => {
        const backupImported = localStorage.getItem('backupImportedFlag')
        if (backupImported === 'true') {
            localStorage.removeItem('backupImportedFlag')
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: '¡Respaldo cargado correctamente!',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: '#1e293b',
                color: '#f1f5f9',
                iconColor: '#10b981'
            })
        }
    }, [])

    useEffect(() => {
        const dataToSave = { salaries, expenses, fixedExpenses, categoryLimits, categories, savingsGoals, currentTheme, themeMode }
        localStorage.setItem('expenseTrackerV6', JSON.stringify(dataToSave))
    }, [salaries, expenses, fixedExpenses, categoryLimits, categories, savingsGoals, currentTheme, themeMode])

    const currentMonthKey = format(currentMonthDate, 'MM-yyyy')
    const currentSalary = salaries[currentMonthKey] || 0
    const currentMonthExpenses = expenses.filter(exp => format(parseISO(exp.date), 'MM-yyyy') === currentMonthKey)
    const totalExpenses = currentMonthExpenses.reduce((acc, curr) => acc + curr.amount, 0)
    const remainingSalary = currentSalary - totalExpenses

    const handleSalaryChange = (e) => {
        const formattedValue = formatCLP(e.target.value)
        const numericValue = parseCLP(formattedValue)

        setSalaries(prev => ({
            ...prev,
            [currentMonthKey]: numericValue
        }))

        if (numericValue <= 0 && formattedValue !== '') {
            setErrors(prev => ({ ...prev, salary: 'Por favor, ingresa un sueldo válido mayor a cero.' }))
        } else {
            setErrors(prev => ({ ...prev, salary: null }))
        }
    }

    const handleAmountChange = (e) => {
        const val = e.target.value
        const filtered = val.replace(/[^0-9+\-*/().\s]/g, '')
        setAmount(filtered)
    }

    const handleSetCategoryLimit = (catId, numericLimit) => {
        setCategoryLimits(prev => ({
            ...prev,
            [catId]: numericLimit
        }))
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        let currentErrors = {}
        let isValid = true

        if (!expenseDate) {
            currentErrors.expenseDate = 'La fecha es obligatoria.'
            isValid = false
        }

        if (!description.trim()) {
            currentErrors.description = 'La descripción no puede estar vacía.'
            isValid = false
        }

        const numericAmount = parseCLP(amount)
        if (numericAmount <= 0) {
            currentErrors.amount = 'Ingresa un monto válido mayor a cero.'
            isValid = false
        }

        setErrors(currentErrors)

        if (isValid) {
            if (editingId) {
                setExpenses(expenses.map(exp =>
                    exp.id === editingId ? { ...exp, date: expenseDate.toISOString(), description, amount: numericAmount, category } : exp
                ))
                setEditingId(null)
                setActiveTab('list')

                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: `Gasto "${description}" editado con éxito`,
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    background: '#1e293b',
                    color: '#f1f5f9',
                    iconColor: '#10b981'
                })
            } else {
                const addedDesc = description
                setExpenses([...expenses, { id: Date.now(), date: expenseDate.toISOString(), description, amount: numericAmount, category }])

                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: `¡"${addedDesc}" registrado con éxito!`,
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    background: '#1e293b',
                    color: '#f1f5f9',
                    iconColor: '#10b981'
                })
            }
            setDescription('')
            setAmount('')
            setCategory('otros')
        }
    }

    const handleEdit = (expense) => {
        setActiveTab('dashboard')
        setEditingId(expense.id)
        setExpenseDate(parseISO(expense.date))
        setDescription(expense.description)
        setAmount(formatCLP(expense.amount))
        setCategory(expense.category || 'otros')
        setErrors({})
    }

    const handleDelete = (idOrIds) => {
        if (Array.isArray(idOrIds)) {
            setExpenses(expenses.filter(exp => !idOrIds.includes(exp.id)))
        } else {
            setExpenses(expenses.filter(exp => exp.id !== idOrIds))
        }
    }

    const handleCancelEdit = () => {
        setEditingId(null)
        setDescription('')
        setAmount('')
        setCategory('otros')
        setErrors({})
    }

    const handleAddCategory = (newCat) => {
        const nameLower = newCat.name.trim().toLowerCase()
        if (categories.some(c => c.name.toLowerCase() === nameLower)) {
            Swal.fire({
                title: 'Categoría Duplicada',
                text: 'Ya existe una categoría con ese nombre.',
                icon: 'warning',
                background: '#1e293b',
                color: '#f1f5f9',
                confirmButtonColor: '#6366f1'
            })
            return false
        }

        const theme = colorThemes[newCat.color] || colorThemes.slate
        const categoryToAdd = {
            id: 'cat_' + Date.now(),
            name: newCat.name.trim(),
            emoji: newCat.emoji.trim() || '🏷️',
            color: newCat.color,
            colorClass: theme.bg,
            activeClass: theme.active
        }

        setCategories([...categories, categoryToAdd])
        return true
    }

    const handleDeleteCategory = async (catId) => {
        const categoryToDelete = categories.find(c => c.id === catId)
        if (!categoryToDelete) return

        const systemIds = ['comida', 'servicios', 'transporte', 'entretencion', 'salud', 'otros']
        if (systemIds.includes(catId)) {
            Swal.fire({
                title: 'Acción No Permitida',
                text: 'Las categorías del sistema por defecto no se pueden eliminar.',
                icon: 'error',
                background: '#1e293b',
                color: '#f1f5f9',
                confirmButtonColor: '#6366f1'
            })
            return
        }

        const result = await Swal.fire({
            title: '¿Eliminar categoría?',
            text: `¿Estás seguro de eliminar "${categoryToDelete.name}"? Los gastos registrados en esta categoría se reasignarán a "Otros".`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f43f5e',
            cancelButtonColor: '#475569',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: '#1e293b',
            color: '#f1f5f9'
        })

        if (result.isConfirmed) {
            setExpenses(prevExpenses => prevExpenses.map(exp =>
                exp.category === catId ? { ...exp, category: 'otros' } : exp
            ))
            setFixedExpenses(prevFixed => prevFixed.map(fixed =>
                fixed.category === catId ? { ...fixed, category: 'otros' } : fixed
            ))
            if (categoryLimits[catId]) {
                setCategoryLimits(prevLimits => {
                    const updated = { ...prevLimits }
                    delete updated[catId]
                    return updated
                })
            }
            setCategories(prevCats => prevCats.filter(c => c.id !== catId))

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: `Categoría "${categoryToDelete.name}" eliminada y gastos reasignados`,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: '#1e293b',
                color: '#f1f5f9',
                iconColor: '#10b981'
            })
        }
    }

    const handleDuplicateExpenses = (ids) => {
        const expensesToDuplicate = expenses.filter(exp => ids.includes(exp.id))
        const duplicated = expensesToDuplicate.map(exp => {
            const originalDate = parseISO(exp.date)
            const targetDate = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), originalDate.getDate())
            return {
                ...exp,
                id: Date.now() + Math.random(),
                date: targetDate.toISOString()
            }
        })
        setExpenses([...expenses, ...duplicated])
    }

    const applyFixedExpenseToMonth = (fixedExpense) => {
        const year = currentMonthDate.getFullYear()
        const month = currentMonthDate.getMonth()
        const newExpenses = [...expenses]

        if (fixedExpense.type === 'single') {
            const firstDayOfMonth = new Date(year, month, 1)
            newExpenses.push({
                id: Date.now() + Math.random(),
                date: firstDayOfMonth.toISOString(),
                description: fixedExpense.description,
                amount: fixedExpense.amount,
                category: fixedExpense.category || 'otros'
            })
        } else if (fixedExpense.type === 'weekly') {
            const daysInCurrentMonth = getDaysInMonth(currentMonthDate)
            for (let i = 1; i <= daysInCurrentMonth; i++) {
                const dateToCheck = new Date(year, month, i)
                if (fixedExpense.days.includes(getDay(dateToCheck))) {
                    newExpenses.push({
                        id: Date.now() + Math.random(),
                        date: dateToCheck.toISOString(),
                        description: fixedExpense.description,
                        amount: fixedExpense.amount,
                        category: fixedExpense.category || 'otros'
                    })
                }
            }
        }

        setExpenses(newExpenses)

        setFixedExpenses(prev => prev.map(item => {
            if (item.id === fixedExpense.id) {
                const applied = item.appliedMonths || []
                if (!applied.includes(currentMonthKey)) {
                    return { ...item, appliedMonths: [...applied, currentMonthKey] }
                }
            }
            return item
        }))
    }

    const handleAddSavingsGoal = (newGoal) => {
        const goalToAdd = {
            id: 'goal_' + Date.now(),
            title: newGoal.title.trim(),
            targetAmount: newGoal.targetAmount,
            currentSaved: 0,
            deadline: newGoal.deadline,
            color: newGoal.color || 'indigo'
        }
        setSavingsGoals(prev => [...prev, goalToAdd])
        return true
    }

    const handleDeleteSavingsGoal = async (goalId) => {
        const goal = savingsGoals.find(g => g.id === goalId)
        if (!goal) return

        const result = await Swal.fire({
            title: '¿Eliminar meta?',
            text: `¿Estás seguro de eliminar la meta de ahorro "${goal.title}"? Los aportes acumulados se perderán.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f43f5e',
            cancelButtonColor: '#475569',
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: '#1e293b',
            color: '#f1f5f9'
        })

        if (result.isConfirmed) {
            setSavingsGoals(prev => prev.filter(g => g.id !== goalId))
            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: `Meta "${goal.title}" eliminada`,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: '#1e293b',
                color: '#f1f5f9',
                iconColor: '#10b981'
            })
        }
    }

    const handleContributeToGoal = (goalId, amountToContribute) => {
        let isCompleted = false

        setSavingsGoals(prev => prev.map(g => {
            if (g.id === goalId) {
                const updatedSaved = g.currentSaved + amountToContribute
                if (updatedSaved >= g.targetAmount) {
                    isCompleted = true
                }
                return { ...g, currentSaved: Math.min(updatedSaved, g.targetAmount) }
            }
            return g
        }))

        const targetGoal = savingsGoals.find(g => g.id === goalId)
        if (targetGoal) {
            const expenseDateObj = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth(), Math.min(new Date().getDate(), getDaysInMonth(currentMonthDate)))
            setExpenses(prev => [...prev, {
                id: Date.now() + Math.random(),
                date: expenseDateObj.toISOString(),
                description: `Ahorro: ${targetGoal.title}`,
                amount: amountToContribute,
                category: 'otros'
            }])
        }

        return isCompleted
    }

    const displaySalary = currentSalary > 0 ? formatCLP(currentSalary) : ''

    return {
        activeTab,
        setActiveTab,
        currentMonthDate,
        setCurrentMonthDate,
        salaries,
        expenses,
        fixedExpenses,
        setFixedExpenses,
        categoryLimits,
        categories,
        savingsGoals,
        currentTheme,
        setCurrentTheme,
        themeMode,
        setThemeMode,
        expenseDate,
        setExpenseDate,
        description,
        setDescription,
        amount,
        setAmount,
        category,
        setCategory,
        editingId,
        errors,
        currentMonthKey,
        currentSalary,
        currentMonthExpenses,
        totalExpenses,
        remainingSalary,
        displaySalary,
        handleSalaryChange,
        handleAmountChange,
        handleSetCategoryLimit,
        handleSubmit,
        handleEdit,
        handleDelete,
        handleCancelEdit,
        handleDuplicateExpenses,
        applyFixedExpenseToMonth,
        handleAddCategory,
        handleDeleteCategory,
        handleAddSavingsGoal,
        handleDeleteSavingsGoal,
        handleContributeToGoal
    }
}
