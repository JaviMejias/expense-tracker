import { useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { formatCLP, parseCLP } from '../utils/currency'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faSave, faCheckCircle, faTimes, faAlignLeft, faCoins, faTags } from '@fortawesome/free-solid-svg-icons'
import CustomDatePicker from './CustomDatePicker'
import CustomButton from './CustomButton'
import CustomInput from './CustomInput'
import CategorySelector from './CategorySelector'
import { useThemeStyles } from '../hooks/useThemeStyles'
import { useAppAlert } from '../hooks/useAppAlert'
import EmptyState from './EmptyState'
import CategoryBadge from './CategoryBadge'
import FixedExpenseItem from './FixedExpenseItem'
import { useCategoryStyles } from '../hooks/useCategoryStyles'
import { useDataStore } from '../store/useDataStore'
import { useUIStore } from '../store/useUIStore'
import { useThemeStore } from '../store/useThemeStore'
import { appThemes } from '../utils/theme'

const weekDays = [
    { id: 1, name: 'Lun' },
    { id: 2, name: 'Mar' },
    { id: 3, name: 'Mié' },
    { id: 4, name: 'Jue' },
    { id: 5, name: 'Vie' },
    { id: 6, name: 'Sáb' },
    { id: 0, name: 'Dom' }
]

function FixedExpenses() {
    const { fixedExpenses, setFixedExpenses, applyFixedExpenseToMonth, categories } = useDataStore()
    const { currentMonthDate, setCurrentMonthDate } = useUIStore()
    const { themeMode, currentTheme } = useThemeStore()
    const activeTheme = appThemes[currentTheme] || appThemes.classic
    const { s, isDark, activeColor, textGradientClass, focusRingClass, aura } = useThemeStyles(themeMode, activeTheme)
    const { showToast, showConfirm } = useAppAlert(themeMode)
    const [fixedDescription, setFixedDescription] = useState('')
    const [fixedAmount, setFixedAmount] = useState('')
    const [fixedType, setFixedType] = useState('single')
    const [fixedDays, setFixedDays] = useState([])
    const [fixedCategory, setFixedCategory] = useState('otros')
    const [fixedErrors, setFixedErrors] = useState({})

    const currentMonthKey = format(currentMonthDate, 'MM-yyyy')

    const categoryStyles = useCategoryStyles(categories)

    const handleFixedAmountChange = (e) => {
        const val = e.target.value
        const filtered = val.replace(/[^0-9+\-*/().\s]/g, '')
        setFixedAmount(filtered)
    }

    const toggleFixedDay = (dayId) => {
        setFixedDays(prev =>
            prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId]
        )
    }

    const handleApplyToMonth = async (item) => {
        const applied = item.appliedMonths || []
        if (applied.includes(currentMonthKey)) {
            const result = await showConfirm(
                '¿Plantilla duplicada?',
                `Ya aplicaste la plantilla "${item.description}" en este mes. ¿Estás seguro de querer añadirla nuevamente?`,
                'Sí, duplicar',
                false
            )
            if (!result.isConfirmed) return
        }

        applyFixedExpenseToMonth(item, currentMonthDate)

        showToast(`¡"${item.description}" añadido a ${format(currentMonthDate, 'MMMM', { locale: es })}!`)
    }

    const handleSaveFixedExpense = (e) => {
        e.preventDefault()
        let currentErrors = {}
        let isValid = true

        if (!fixedDescription.trim()) {
            currentErrors.description = 'La descripción es requerida.'
            isValid = false
        }

        const numericAmount = parseCLP(fixedAmount)
        if (numericAmount <= 0) {
            currentErrors.amount = 'El monto debe ser mayor a cero.'
            isValid = false
        }

        if (fixedType === 'weekly' && fixedDays.length === 0) {
            currentErrors.days = 'Debes seleccionar al menos un día de la semana.'
            isValid = false
        }

        setFixedErrors(currentErrors)

        if (isValid) {
            const newFixed = {
                id: Date.now(),
                description: fixedDescription,
                amount: numericAmount,
                type: fixedType,
                days: fixedType === 'weekly' ? fixedDays : [],
                category: fixedCategory || 'otros',
                appliedMonths: []
            }
            setFixedExpenses([...fixedExpenses, newFixed])
            setFixedDescription('')
            setFixedAmount('')
            setFixedDays([])
            setFixedType('single')
            setFixedCategory('otros')

            showToast('Plantilla guardada', 'success', 2000)
        }
    }

    const handleDeleteFixedExpense = async (id) => {
        const item = fixedExpenses.find(f => f.id === id)
        const confirmed = await showConfirm(
            '¿Eliminar plantilla?',
            `¿Estás seguro de eliminar "${item?.description || 'esta plantilla'}"?`
        )
        if (confirmed.isConfirmed) {
            setFixedExpenses(fixedExpenses.filter(f => f.id !== id))
            showToast(`Plantilla "${item?.description}" eliminada`)
        }
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10 relative">
            <div>
                <h2 className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${textGradientClass} mb-6 flex items-center gap-2`}>
                    <FontAwesomeIcon icon={faStar} className={aura.icon} /> Plantillas de Gastos
                </h2>
                <form onSubmit={handleSaveFixedExpense} className={`space-y-5 ${s.itemBg} p-6 rounded-3xl`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="fixedDescription" className={`flex items-center gap-2 text-sm font-bold ${aura.label} transition-colors mb-2`}>
                                <FontAwesomeIcon icon={faAlignLeft} /> Nombre (Ej: Gym, Pasajes):
                            </label>
                            <CustomInput
                                id="fixedDescription"
                                value={fixedDescription}
                                onChange={(e) => setFixedDescription(e.target.value)}
                                s={s}
                                focusRingClass={focusRingClass}
                                className="py-3 rounded-xl font-medium"
                            />
                            {fixedErrors.description && <p className="mt-1 text-sm text-rose-400 font-bold">{fixedErrors.description}</p>}
                        </div>
                        <div>
                            <label htmlFor="fixedAmount" className={`flex items-center gap-2 text-sm font-bold ${aura.label} transition-colors mb-2`}>
                                <FontAwesomeIcon icon={faCoins} /> Monto Total Diario/Único:
                            </label>
                            <CustomInput
                                id="fixedAmount"
                                value={fixedAmount}
                                onChange={handleFixedAmountChange}
                                isAmount={true}
                                setEvaluatedAmount={setFixedAmount}
                                iconClass={aura.icon}
                                s={s}
                                focusRingClass={focusRingClass}
                                className="py-3 rounded-xl font-bold"
                            />
                            {fixedErrors.amount && <p className="mt-1 text-sm text-rose-400 font-bold">{fixedErrors.amount}</p>}
                        </div>
                    </div>

                    <div>
                        <label className={`block text-sm font-bold ${aura.label} mb-2`}>Tipo de Gasto:</label>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <label className={`flex items-center gap-2 cursor-pointer ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-700'} ${aura.radioHover} px-4 py-3 rounded-xl border transition-all flex-1 select-none`}>
                                <input
                                    type="radio"
                                    checked={fixedType === 'single'}
                                    onChange={() => setFixedType('single')}
                                    className={`w-5 h-5 cursor-pointer ${aura.radio}`}
                                />
                                <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Mensual Único</span>
                            </label>
                            <label className={`flex items-center gap-2 cursor-pointer ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-700'} ${aura.radioHover} px-4 py-3 rounded-xl border transition-all flex-1 select-none`}>
                                <input
                                    type="radio"
                                    checked={fixedType === 'weekly'}
                                    onChange={() => setFixedType('weekly')}
                                    className={`w-5 h-5 cursor-pointer ${aura.radio}`}
                                />
                                <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Repetir por Días</span>
                            </label>
                        </div>
                    </div>

                    {fixedType === 'weekly' && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <label className={`block text-sm font-bold ${aura.label} mb-3`}>Selecciona los días (Ej: Lunes a Viernes):</label>
                            <div className="flex flex-wrap gap-2">
                                {weekDays.map(day => (
                                    <button
                                        key={day.id}
                                        type="button"
                                        onClick={() => toggleFixedDay(day.id)}
                                        className={`px-4 py-2 rounded-xl font-bold transition-all transform hover:scale-105 cursor-pointer ${fixedDays.includes(day.id) ? aura.dayActive : (isDark ? `bg-slate-900 text-slate-400 border border-slate-700 ${aura.dayHover}` : `bg-white text-slate-600 border border-slate-300 shadow-sm ${aura.dayHover}`)}`}
                                    >
                                        {day.name}
                                    </button>
                                ))}
                            </div>
                            {fixedErrors.days && <p className="mt-2 text-sm text-rose-400 font-bold">{fixedErrors.days}</p>}
                        </div>
                    )}

                    <div className="group">
                        <label className={`flex items-center gap-2 text-sm font-bold ${aura.label} mb-3 transition-colors`}>
                            <FontAwesomeIcon icon={faTags} /> Categoría de la Plantilla:
                        </label>
                        <CategorySelector
                            categories={categories}
                            selectedId={fixedCategory}
                            onSelect={setFixedCategory}
                            isDark={isDark}
                            focusRingClass={focusRingClass}
                            hoverClass={aura.hoverItem}
                        />
                    </div>

                    <CustomButton
                        type="submit"
                        variant="primary"
                        icon={faSave}
                        className="w-full py-4 mt-4"
                        activeTheme={activeTheme}
                        isDark={isDark}
                    >
                        Guardar Plantilla
                    </CustomButton>
                </form>
            </div>

            <div>
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between border-b ${isDark ? 'border-slate-700/50' : 'border-slate-200'} pb-4 mb-6 gap-4`}>
                    <h3 className={`text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${textGradientClass} flex items-center gap-2`}>
                        Mis Plantillas
                    </h3>

                    <div className={`w-full sm:w-auto bg-gradient-to-br ${aura.monthBox} backdrop-blur-md px-5 py-3 rounded-2xl border flex flex-col sm:flex-row items-center gap-3 sm:gap-4 transition-all group`}>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-xs font-black text-slate-300 group-hover:text-indigo-300 transition-colors uppercase tracking-wider">Aplicar al mes de:</span>
                        </div>
                        <CustomDatePicker
                            selected={currentMonthDate}
                            onChange={(date) => setCurrentMonthDate(date)}
                            type="month"
                            activeColor={activeColor}
                            activeTheme={activeTheme}
                            isDark={isDark}
                            s={s}
                            focusRingClass={focusRingClass}
                            wrapperClassName="w-full sm:w-auto"
                            className="sm:w-44 px-4 py-2 rounded-xl font-extrabold text-xs uppercase tracking-wide"
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    {fixedExpenses.length === 0 ? (
                        <EmptyState
                            icon={faStar}
                            message="No has creado plantillas de gastos fijos."
                            isDark={isDark}
                        />
                    ) : (
                        fixedExpenses.map(item => (
                            <FixedExpenseItem
                                key={item.id}
                                item={item}
                                categoryStyle={categoryStyles[item.category || 'otros']}
                                weekDays={weekDays}
                                currentMonthDate={currentMonthDate}
                                s={s}
                                aura={aura}
                                isDark={isDark}
                                onApplyToMonth={handleApplyToMonth}
                                onDelete={handleDeleteFixedExpense}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default FixedExpenses