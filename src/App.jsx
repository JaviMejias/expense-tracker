import { useState, useEffect } from 'react'
import 'react-datepicker/dist/react-datepicker.css'
import { format, parseISO, getDaysInMonth, getDay } from 'date-fns'
import { es } from 'date-fns/locale'
import { registerLocale } from 'react-datepicker'
import { formatCLP, parseCLP } from './utils/currency'

import MonthSummary from './components/MonthSummary'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import FixedExpenses from './components/FixedExpenses'
import DataBackup from './components/DataBackup'

registerLocale('es', es)

function App() {
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeTab, setActiveTab] = useState('dashboard')
  const [currentMonthDate, setCurrentMonthDate] = useState(new Date())
  const [salaries, setSalaries] = useState({})
  const [expenses, setExpenses] = useState([])
  const [fixedExpenses, setFixedExpenses] = useState([])

  const [expenseDate, setExpenseDate] = useState(new Date())
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [errors, setErrors] = useState({})

  useEffect(() => {
    const savedData = localStorage.getItem('expenseTrackerV6')
    if (savedData) {
      const parsedData = JSON.parse(savedData)
      setSalaries(parsedData.salaries || {})
      setExpenses(parsedData.expenses || [])
      setFixedExpenses(parsedData.fixedExpenses || [])
    }
    setIsLoaded(true)
  }, [])

  useEffect(() => {
    if (isLoaded) {
      const dataToSave = { salaries, expenses, fixedExpenses }
      localStorage.setItem('expenseTrackerV6', JSON.stringify(dataToSave))
    }
  }, [salaries, expenses, fixedExpenses, isLoaded])

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

  const handleAmountChange = (e) => setAmount(formatCLP(e.target.value))

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
          exp.id === editingId ? { ...exp, date: expenseDate.toISOString(), description, amount: numericAmount } : exp
        ))
        setEditingId(null)
      } else {
        setExpenses([...expenses, { id: Date.now(), date: expenseDate.toISOString(), description, amount: numericAmount }])
      }
      setDescription('')
      setAmount('')
      setActiveTab('list')
    }
  }

  const handleEdit = (expense) => {
    setActiveTab('dashboard')
    setEditingId(expense.id)
    setExpenseDate(parseISO(expense.date))
    setDescription(expense.description)
    setAmount(formatCLP(expense.amount))
    setErrors({})
  }

  const handleDelete = (id) => {
    setExpenses(expenses.filter(exp => exp.id !== id))
  }

  const handleCancelEdit = () => {
    setEditingId(null)
    setDescription('')
    setAmount('')
    setErrors({})
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
        amount: fixedExpense.amount
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
            amount: fixedExpense.amount
          })
        }
      }
    }

    setExpenses(newExpenses)
    setActiveTab('list')
  }

  const displaySalary = currentSalary > 0 ? formatCLP(currentSalary) : ''

  if (!isLoaded) return null

  return (
    <div className="min-h-screen bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-50 via-purple-50 to-pink-50 py-10 px-4 sm:px-6 lg:px-8 font-sans selection:bg-purple-300 selection:text-purple-900">
      <div className="max-w-2xl mx-auto space-y-8 animate-fade-in">
        <header className="text-center transform hover:scale-105 transition-transform duration-500">
          <h1 className="text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-fuchsia-600 to-pink-500 tracking-tight drop-shadow-sm mb-2">
            Gestor de Gastos
          </h1>
          <p className="text-purple-600/80 font-medium tracking-wide">Administra tu dinero con estilo</p>
        </header>

        <MonthSummary
          currentMonthDate={currentMonthDate}
          setCurrentMonthDate={setCurrentMonthDate}
          displaySalary={displaySalary}
          handleSalaryChange={handleSalaryChange}
          errors={errors}
          totalExpenses={totalExpenses}
          remainingSalary={remainingSalary}
        />

        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-purple-200/50 border border-white overflow-hidden">
          <div className="flex p-2 bg-purple-50/50 flex-wrap sm:flex-nowrap gap-2 sm:gap-0">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 py-4 font-extrabold text-sm sm:text-base rounded-2xl transition-all duration-300 min-w-[120px] ${activeTab === 'dashboard' ? 'bg-white text-violet-700 shadow-md shadow-purple-200/50 scale-100' : 'text-purple-400 hover:text-purple-600 hover:bg-white/50 scale-95'}`}
            >
              ✨ Registrar
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`flex-1 py-4 font-extrabold text-sm sm:text-base rounded-2xl transition-all duration-300 min-w-[120px] ${activeTab === 'list' ? 'bg-white text-violet-700 shadow-md shadow-purple-200/50 scale-100' : 'text-purple-400 hover:text-purple-600 hover:bg-white/50 scale-95'}`}
            >
              📄 Lista
            </button>
            <button
              onClick={() => setActiveTab('fixed')}
              className={`flex-1 py-4 font-extrabold text-sm sm:text-base rounded-2xl transition-all duration-300 min-w-[120px] ${activeTab === 'fixed' ? 'bg-white text-violet-700 shadow-md shadow-purple-200/50 scale-100' : 'text-purple-400 hover:text-purple-600 hover:bg-white/50 scale-95'}`}
            >
              ⭐ Fijos
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === 'dashboard' && (
              <ExpenseForm
                editingId={editingId}
                expenseDate={expenseDate}
                setExpenseDate={setExpenseDate}
                description={description}
                setDescription={setDescription}
                amount={amount}
                handleAmountChange={handleAmountChange}
                errors={errors}
                handleSubmit={handleSubmit}
                handleCancelEdit={handleCancelEdit}
              />
            )}

            {activeTab === 'list' && (
              <ExpenseList
                currentMonthExpenses={currentMonthExpenses}
                currentMonthKey={currentMonthKey}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
              />
            )}

            {activeTab === 'fixed' && (
              <FixedExpenses
                fixedExpenses={fixedExpenses}
                setFixedExpenses={setFixedExpenses}
                applyFixedExpenseToMonth={applyFixedExpenseToMonth}
                currentMonthDate={currentMonthDate}
              />
            )}
          </div>
        </div>

        <DataBackup />
      </div>
    </div>
  )
}

export default App