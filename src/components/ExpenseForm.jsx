import { useState, useRef } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faSave, faTimesCircle, faTags, faDollarSign, faCalendarDay, faExclamationTriangle, faHandshake } from '@fortawesome/free-solid-svg-icons'
import { useNavigate } from 'react-router-dom'
import { formatCLP, parseCLP } from '../utils/currency'
import CustomDatePicker from './CustomDatePicker'
import CustomButton from './CustomButton'
import CustomInput from './CustomInput'
import { useThemeStyles } from '../hooks/useThemeStyles'
import CategorySelector from './CategorySelector'
import { appThemes } from '../utils/theme'
import { useDataStore } from '../store/useDataStore'
import { useThemeStore } from '../store/useThemeStore'
import { useAppAlert } from '../hooks/useAppAlert'
import { useDerivedData } from '../hooks/useDerivedData'
import { useLocation } from 'react-router-dom'
import { parseISO } from 'date-fns'

function ExpenseForm() {
    const { categories, addExpense, updateExpense, categoryLimits } = useDataStore()
    const location = useLocation()
    const editExpense = location.state?.editExpense

    const [expenseDate, setExpenseDate] = useState(editExpense ? parseISO(editExpense.date) : new Date())
    const [description, setDescription] = useState(editExpense?.description || '')
    const [amount, setAmount] = useState(editExpense ? formatCLP(editExpense.amount) : '')
    const [category, setCategory] = useState(editExpense?.category || 'otros')
    const [isReimbursable, setIsReimbursable] = useState(editExpense?.isReimbursable || false)
    const editingId = editExpense?.id || null
    const [errors, setErrors] = useState({})
    const navigate = useNavigate()
    const { themeMode, currentTheme } = useThemeStore()
    const activeTheme = appThemes[currentTheme] || appThemes.classic
    const { showToast, showConfirm } = useAppAlert(themeMode)
    const { currentMonthExpenses } = useDerivedData()

    const { s, isDark, activeColor, textGradientClass, focusRingClass, aura } = useThemeStyles(themeMode, activeTheme)

    // Budget warning preview as user types the amount
    const numericAmount = parseCLP(amount)
    const limit = categoryLimits?.[category] || 0
    const currentCategorySpend = currentMonthExpenses
        .filter(e => e.category === category && (!editingId || e.id !== editingId))
        .reduce((sum, e) => sum + e.amount, 0)
    const projectedTotal = currentCategorySpend + numericAmount
    const willExceedLimit = limit > 0 && numericAmount > 0 && projectedTotal > limit
    const catName = categories.find(c => c.id === category)?.name || category

    const handleAmountChange = (e) => {
        const val = e.target.value
        const filtered = val.replace(/[^0-9+\-*/().\s]/g, '')
        setAmount(filtered)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        let currentErrors = {}
        let isValid = true

        if (!expenseDate) { currentErrors.expenseDate = 'La fecha es obligatoria.'; isValid = false }
        if (!description.trim()) { currentErrors.description = 'La descripción no puede estar vacía.'; isValid = false }
        const numericAmountFinal = parseCLP(amount)
        if (numericAmountFinal <= 0) { currentErrors.amount = 'Ingresa un monto válido mayor a cero.'; isValid = false }

        setErrors(currentErrors)
        if (!isValid) return

        // Budget limit check
        if (willExceedLimit) {
            const excess = projectedTotal - limit
            const confirmed = await showConfirm(
                `⚠️ Límite de "${catName}" excedido`,
                `Con este gasto llegarías a $${formatCLP(projectedTotal)} en "${catName}", superando tu límite de $${formatCLP(limit)} en $${formatCLP(excess)}. ¿Quieres registrarlo de todas formas?`,
                'Sí, registrar igual',
                false
            )
            if (!confirmed.isConfirmed) return
        }

        if (editingId) {
            updateExpense(editingId, { date: expenseDate.toISOString(), description, amount: numericAmountFinal, category, isReimbursable })
            navigate('/lista')
            showToast(`Movimiento "${description}" editado con éxito`)
        } else {
            const addedDesc = description
            addExpense({ id: Date.now(), date: expenseDate.toISOString(), description, amount: numericAmountFinal, category, isReimbursable, reimbursedAmount: isReimbursable ? 0 : undefined, isForgiven: false })
            showToast(`¡"${addedDesc}" registrado con éxito!`)
        }
        setDescription('')
        setAmount('')
        setCategory('otros')
        setIsReimbursable(false)
    }

    const handleCancelEdit = () => {
        navigate('/lista')
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${textGradientClass} mb-6 flex items-center gap-3 transition-colors duration-500`}>
                {editingId ? <FontAwesomeIcon icon={faSave} className={aura.icon} /> : <FontAwesomeIcon icon={faPlusCircle} className={aura.icon} />}
                {editingId ? 'Editar Movimiento' : 'Nuevo Movimiento'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="group">
                    <label className={`flex items-center gap-2 text-sm font-bold ${aura.label} transition-colors mb-2`}>
                        <FontAwesomeIcon icon={faCalendarDay} /> Fecha:
                    </label>
                    <CustomDatePicker
                        selected={expenseDate}
                        onChange={(date) => setExpenseDate(date)}
                        dateFormat="dd 'de' MMMM, yyyy"
                        activeColor={activeColor}
                        activeTheme={activeTheme}
                        isDark={isDark}
                        s={s}
                        focusRingClass={focusRingClass}
                        className="px-5 py-4 rounded-2xl font-bold capitalize"
                    />
                    {errors.expenseDate && <p className="mt-2 text-sm text-rose-400 font-bold animate-pulse">{errors.expenseDate}</p>}
                </div>

                <div className="group">
                    <label htmlFor="descriptionInput" className={`flex items-center gap-2 text-sm font-bold ${aura.label} transition-colors mb-2`}>
                        <FontAwesomeIcon icon={faTags} /> Descripción:
                    </label>
                    <CustomInput
                        id="descriptionInput"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Ej: Salida fin de semana"
                        s={s}
                        focusRingClass={focusRingClass}
                        className="py-4 rounded-2xl font-medium"
                    />
                    {errors.description && <p className="mt-2 text-sm text-rose-400 font-bold animate-pulse">{errors.description}</p>}
                </div>

                <div className="group">
                    <label htmlFor="amountInput" className={`flex items-center gap-2 text-sm font-bold ${aura.label} transition-colors mb-2`}>
                        <FontAwesomeIcon icon={faDollarSign} /> Monto:
                    </label>
                    <CustomInput
                        id="amountInput"
                        value={amount}
                        onChange={handleAmountChange}
                        isAmount={true}
                        setEvaluatedAmount={setAmount}
                        iconClass={aura.icon}
                        placeholder="0"
                        s={s}
                        focusRingClass={focusRingClass}
                        className="py-4 rounded-2xl font-bold text-lg"
                    />
                    {errors.amount && <p className="mt-2 text-sm text-rose-400 font-bold animate-pulse">{errors.amount}</p>}

                    {/* Live budget warning */}
                    {willExceedLimit && (
                        <div className={`mt-3 flex items-start gap-3 p-3 rounded-xl border animate-in fade-in slide-in-from-top-2 duration-300 ${isDark ? 'bg-amber-500/10 border-amber-500/30 text-amber-300' : 'bg-amber-50 border-amber-200 text-amber-700'}`}>
                            <FontAwesomeIcon icon={faExclamationTriangle} className="mt-0.5 shrink-0 animate-pulse" />
                            <p className="text-xs font-bold">
                                ⚠️ Superarás el límite de <strong>{catName}</strong> ({formatCLP(limit)}). Proyectado: <strong>${formatCLP(projectedTotal)}</strong>
                            </p>
                        </div>
                    )}

                    <div className="mt-4 flex items-center justify-between">
                        <label className={`flex items-center gap-2 text-sm font-bold ${aura.label} cursor-pointer`} onClick={() => setIsReimbursable(!isReimbursable)}>
                            <FontAwesomeIcon icon={faHandshake} className={isReimbursable ? 'text-indigo-500' : ''} />
                            Este gasto es reembolsable (Préstamo)
                        </label>
                        <button
                            type="button"
                            onClick={() => setIsReimbursable(!isReimbursable)}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${isReimbursable ? (isDark ? 'bg-indigo-500' : 'bg-indigo-600') : (isDark ? 'bg-slate-600' : 'bg-slate-300')}`}
                        >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${isReimbursable ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                    </div>
                </div>

                <div className="group">
                    <label className={`flex items-center gap-2 text-sm font-bold ${aura.label} transition-colors mb-3`}>
                        <FontAwesomeIcon icon={faTags} /> Categoría del Gasto:
                    </label>
                    <CategorySelector
                        categories={categories}
                        selectedId={category}
                        onSelect={setCategory}
                        isDark={isDark}
                        focusRingClass={focusRingClass}
                        hoverClass={aura.hoverItem}
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <CustomButton
                        type="submit"
                        variant="primary"
                        icon={editingId ? faSave : faPlusCircle}
                        className="flex-1 py-4 px-6 !rounded-2xl"
                        activeTheme={activeTheme}
                        isDark={isDark}
                    >
                        {editingId ? 'Guardar Cambios' : 'Agregar'}
                    </CustomButton>
                    {editingId && (
                        <CustomButton
                            type="button"
                            onClick={handleCancelEdit}
                            variant="secondary"
                            icon={faTimesCircle}
                            className="flex-1 py-4 px-6 !rounded-2xl"
                            isDark={isDark}
                        >
                            Cancelar
                        </CustomButton>
                    )}
                </div>
            </form>
        </div>
    )
}

export default ExpenseForm