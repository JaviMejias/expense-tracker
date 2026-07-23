import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faAlignLeft, faCoins, faTags } from '@fortawesome/free-solid-svg-icons'
import CustomButton from './CustomButton'
import CustomInput from './CustomInput'
import CategorySelector from './CategorySelector'
import { useDataStore } from '../store/useDataStore'
import { useAppAlert } from '../hooks/useAppAlert'
import { parseCLP } from '../utils/currency'
import { motion } from 'framer-motion'

function FixedExpenseForm({ weekDays, isDark, activeTheme, aura, s, focusRingClass, onCancel }) {
    const { fixedExpenses, setFixedExpenses, categories } = useDataStore()
    const { showToast } = useAppAlert(isDark ? 'dark' : 'light')

    const [fixedDescription, setFixedDescription] = useState('')
    const [fixedAmount, setFixedAmount] = useState('')
    const [fixedType, setFixedType] = useState('single')
    const [fixedDays, setFixedDays] = useState([])
    const [fixedCategory, setFixedCategory] = useState('otros')
    const [fixedErrors, setFixedErrors] = useState({})

    const handleFixedAmountChange = (e) => {
        const val = e.target.value
        const filtered = val.replace(/[^0-9+\-*/().\s]/g, '')
        setFixedAmount(filtered)
    }

    const toggleFixedDay = (dayId) => {
        setFixedDays(prev => prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId])
    }

    const handleSaveFixedExpense = (e) => {
        e.preventDefault()
        const currentErrors = {}
        let isValid = true

        if (!fixedDescription.trim()) { currentErrors.description = 'La descripción es requerida.'; isValid = false }
        if (parseCLP(fixedAmount) <= 0) { currentErrors.amount = 'El monto debe ser mayor a cero.'; isValid = false }
        if (fixedType === 'weekly' && fixedDays.length === 0) { currentErrors.days = 'Debes seleccionar al menos un día.'; isValid = false }

        setFixedErrors(currentErrors)
        if (!isValid) return

        setFixedExpenses([...fixedExpenses, {
            id: Date.now(),
            description: fixedDescription,
            amount: parseCLP(fixedAmount),
            type: fixedType,
            days: fixedType === 'weekly' ? fixedDays : [],
            category: fixedCategory || 'otros',
            appliedMonths: []
        }])
        setFixedDescription('')
        setFixedAmount('')
        setFixedDays([])
        setFixedType('single')
        setFixedCategory('otros')
        showToast('Plantilla guardada', 'success', 2000)
        
        if (onCancel) onCancel()
    }

    return (
        <motion.form
            initial={{ opacity: 0, height: 0, scale: 0.95, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', scale: 1, marginBottom: 32 }}
            exit={{ opacity: 0, height: 0, scale: 0.95, marginBottom: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onSubmit={handleSaveFixedExpense}
            className={`overflow-hidden space-y-5 ${s.itemBg} p-6 rounded-3xl`}
        >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                    <label htmlFor="fixedDescription" className={`flex items-center gap-2 text-sm font-bold ${aura.label} transition-colors mb-2`}>
                        <FontAwesomeIcon icon={faAlignLeft} /> Nombre (Ej: Gym, Pasajes):
                    </label>
                    <CustomInput id="fixedDescription" value={fixedDescription} onChange={(e) => setFixedDescription(e.target.value)} s={s} focusRingClass={focusRingClass} className="py-3 rounded-xl font-medium" />
                    {fixedErrors.description && <p className="mt-1 text-sm text-rose-400 font-bold">{fixedErrors.description}</p>}
                </div>
                <div>
                    <label htmlFor="fixedAmount" className={`flex items-center gap-2 text-sm font-bold ${aura.label} transition-colors mb-2`}>
                        <FontAwesomeIcon icon={faCoins} /> Monto Total Diario/Único:
                    </label>
                    <CustomInput id="fixedAmount" value={fixedAmount} onChange={handleFixedAmountChange} isAmount={true} setEvaluatedAmount={setFixedAmount} iconClass={aura.icon} s={s} focusRingClass={focusRingClass} className="py-3 rounded-xl font-bold" />
                    {fixedErrors.amount && <p className="mt-1 text-sm text-rose-400 font-bold">{fixedErrors.amount}</p>}
                </div>
            </div>

            <div>
                <label className={`block text-sm font-bold ${aura.label} mb-2`}>Tipo de Gasto:</label>
                <div className="flex flex-col sm:flex-row gap-4">
                    <label className={`flex items-center gap-2 cursor-pointer ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-700'} ${aura.radioHover} px-4 py-3 rounded-xl border transition-all flex-1 select-none`}>
                        <input type="radio" checked={fixedType === 'single'} onChange={() => setFixedType('single')} className={`w-5 h-5 cursor-pointer ${aura.radio}`} />
                        <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Mensual Único</span>
                    </label>
                    <label className={`flex items-center gap-2 cursor-pointer ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-700'} ${aura.radioHover} px-4 py-3 rounded-xl border transition-all flex-1 select-none`}>
                        <input type="radio" checked={fixedType === 'weekly'} onChange={() => setFixedType('weekly')} className={`w-5 h-5 cursor-pointer ${aura.radio}`} />
                        <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Repetir por Días</span>
                    </label>
                </div>
            </div>

            {fixedType === 'weekly' && (
                <div className="animate-in fade-in slide-in-from-top-2">
                    <label className={`block text-sm font-bold ${aura.label} mb-3`}>Selecciona los días (Ej: Lunes a Viernes):</label>
                    <div className="flex flex-wrap gap-2">
                        {weekDays.map(day => (
                            <button key={day.id} type="button" onClick={() => toggleFixedDay(day.id)}
                                className={`px-4 py-2 rounded-xl font-bold transition-all transform hover:scale-105 cursor-pointer ${fixedDays.includes(day.id) ? aura.dayActive : (isDark ? `bg-slate-900 text-slate-400 border border-slate-700 ${aura.dayHover}` : `bg-white text-slate-600 border border-slate-300 shadow-sm ${aura.dayHover}`)}`}>
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
                <CategorySelector categories={categories} selectedId={fixedCategory} onSelect={setFixedCategory} isDark={isDark} focusRingClass={focusRingClass} hoverClass={aura.hoverItem} />
            </div>

            <div className="flex flex-col sm:flex-row gap-3 mt-4">
                <CustomButton type="submit" variant="primary" icon={faSave} className="flex-1 py-4" activeTheme={activeTheme} isDark={isDark}>
                    Guardar Plantilla
                </CustomButton>
                {onCancel && (
                    <button type="button" onClick={onCancel}
                        className={`px-5 py-4 rounded-xl font-bold text-sm border transition-all cursor-pointer ${isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-300 text-slate-500 hover:bg-slate-100'}`}>
                        Cancelar
                    </button>
                )}
            </div>
        </motion.form>
    )
}

export default FixedExpenseForm
