import { es } from 'date-fns/locale'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faSave, faTimesCircle, faTags, faDollarSign, faCalendarDay } from '@fortawesome/free-solid-svg-icons'
import Swal from 'sweetalert2'
import { useNavigate } from 'react-router-dom'
import { formatCLP, parseCLP } from '../utils/currency'
import CustomDatePicker from './CustomDatePicker'
import CustomButton from './CustomButton'
import CustomInput from './CustomInput'
import { useThemeStyles } from '../hooks/useThemeStyles'
import CategorySelector from './CategorySelector'
import { appThemes } from '../utils/theme'

import { useDataStore } from '../store/useDataStore'
import { useUIStore } from '../store/useUIStore'
import { useThemeStore } from '../store/useThemeStore'

function ExpenseForm() {
    const { categories, addExpense, updateExpense } = useDataStore()
    const { 
        expenseDate, setExpenseDate, 
        description, setDescription, 
        amount, setAmount, 
        category, setCategory, 
        editingId, setEditingId, 
        errors, setErrors, 
        resetForm 
    } = useUIStore()
    const navigate = useNavigate()
    const { themeMode, currentTheme } = useThemeStore()
    const activeTheme = appThemes[currentTheme] || appThemes.classic

    const handleAmountChange = (e) => {
        const val = e.target.value
        const filtered = val.replace(/[^0-9+\-*/().\s]/g, '')
        setAmount(filtered)
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
                updateExpense(editingId, { date: expenseDate.toISOString(), description, amount: numericAmount, category })
                setEditingId(null)
                navigate('/lista')

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
                addExpense({ id: Date.now(), date: expenseDate.toISOString(), description, amount: numericAmount, category })

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

    const handleCancelEdit = () => {
        resetForm()
        navigate('/lista')
    }
    const { s, isDark, activeColor, textGradientClass, focusRingClass, aura } = useThemeStyles(themeMode, activeTheme)

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