import { useState } from 'react'
import { differenceInCalendarMonths } from 'date-fns'
import { formatCLP, parseCLP } from '../utils/currency'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import CustomDatePicker from './CustomDatePicker'
import CustomButton from './CustomButton'
import CustomInput from './CustomInput'
import ColorSelector from './ColorSelector'
import { useDataStore } from '../store/useDataStore'
import { useAppAlert } from '../hooks/useAppAlert'
import { motion } from 'framer-motion'

function SavingsGoalForm({ isDark, activeTheme, activeColor, s, focusRingClass, aura, onCancel }) {
    const { addSavingsGoal } = useDataStore()
    const { showAlert, showToast } = useAppAlert(isDark ? 'dark' : 'light')

    const [goalTitle, setGoalTitle] = useState('')
    const [goalTarget, setGoalTarget] = useState('')
    const [goalDeadline, setGoalDeadline] = useState('')
    const [goalColor, setGoalColor] = useState('indigo')

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!goalTitle.trim()) {
            showAlert('Campo Requerido', 'Ingresa un nombre para tu meta de ahorro.')
            return
        }

        const targetNum = parseCLP(goalTarget)
        if (targetNum <= 0) {
            showAlert('Monto Inválido', 'El monto objetivo debe ser mayor a cero.')
            return
        }

        if (!goalDeadline) {
            showAlert('Campo Requerido', 'Por favor selecciona una fecha límite para cumplir tu meta.')
            return
        }

        addSavingsGoal({
            title: goalTitle,
            targetAmount: targetNum,
            deadline: new Date(goalDeadline).toISOString(),
            color: goalColor
        })

        setGoalTitle('')
        setGoalTarget('')
        setGoalDeadline('')
        setGoalColor('indigo')
        showToast('¡Meta de ahorro creada con éxito!')
        
        if (onCancel) onCancel()
    }

    const handleTargetChange = (e) => {
        const val = e.target.value
        setGoalTarget(formatCLP(val))
    }

    const formMonthlySuggestion = (() => {
        if (!goalTarget || !goalDeadline) return null
        const targetNum = parseCLP(goalTarget)
        if (targetNum <= 0) return null
        const months = differenceInCalendarMonths(new Date(goalDeadline), new Date())
        if (months <= 0) return null
        return Math.ceil(targetNum / months)
    })()

    return (
        <motion.form
            initial={{ opacity: 0, height: 0, scale: 0.95, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', scale: 1, marginBottom: 32 }}
            exit={{ opacity: 0, height: 0, scale: 0.95, marginBottom: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onSubmit={handleSubmit}
            className={`overflow-hidden ${s.itemBg} p-6 sm:p-8 rounded-[2rem] space-y-6`}
        >
            <h3 className={`text-lg font-black text-transparent bg-clip-text bg-gradient-to-r ${aura.gradientText} flex items-center gap-2 select-none uppercase tracking-wider`}>
                <FontAwesomeIcon icon={faPlus} className={aura.icon} /> Crear Nueva Meta de Ahorro
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-end">
                <div className="sm:col-span-4">
                    <label htmlFor="goalTitle" className={`block text-[10px] font-bold ${aura.label} mb-1.5 uppercase tracking-wider`}>Título de la Meta</label>
                    <CustomInput
                        id="goalTitle"
                        value={goalTitle}
                        onChange={(e) => setGoalTitle(e.target.value)}
                        placeholder="Ej: Enganche de Casa, Computadora..."
                        s={s}
                        focusRingClass={focusRingClass}
                        className="py-2.5 rounded-xl text-sm font-bold"
                    />
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="goalTarget" className={`block text-[10px] font-bold ${aura.label} mb-1.5 uppercase tracking-wider`}>Monto Objetivo ($)</label>
                    <CustomInput
                        id="goalTarget"
                        value={goalTarget}
                        onChange={handleTargetChange}
                        placeholder="Monto meta..."
                        s={s}
                        focusRingClass={focusRingClass}
                        className="py-2.5 rounded-xl text-sm font-bold"
                    />
                </div>

                <div className="sm:col-span-3">
                    <label htmlFor="goalDeadline" className={`block text-[10px] font-bold ${aura.label} mb-1.5 uppercase tracking-wider`}>Fecha Límite</label>
                    <CustomDatePicker
                        selected={goalDeadline ? new Date(goalDeadline) : null}
                        onChange={(date) => setGoalDeadline(date ? date.toISOString() : '')}
                        activeColor={activeColor}
                        activeTheme={activeTheme}
                        isDark={isDark}
                        s={s}
                        focusRingClass={focusRingClass}
                        placeholderText="Seleccionar..."
                        fastNavigation={true}
                        className="px-4 py-2.5 rounded-xl text-sm font-bold"
                    />
                </div>

                <div className="sm:col-span-12 md:col-span-6 flex flex-col mt-2">
                    <span className={`block text-[10px] font-bold ${s.bodyTextMuted} mb-2.5 uppercase tracking-wider`}>Color de la Meta</span>
                    <ColorSelector
                        selectedColor={goalColor}
                        onSelectColor={setGoalColor}
                        isDark={isDark}
                    />
                </div>

                {formMonthlySuggestion && (
                    <div className="sm:col-span-12">
                        <div className={`flex items-center gap-3 px-4 py-3 rounded-2xl border ${isDark ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-emerald-50 border-emerald-200'}`}>
                            <span className="text-xl">💡</span>
                            <div>
                                <p className={`text-xs font-black uppercase tracking-widest ${isDark ? 'text-emerald-400' : 'text-emerald-700'}`}>Sugerencia de Ahorro Mensual</p>
                                <p className={`text-sm font-bold mt-0.5 ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                                    Para llegar a tu meta, deberías ahorrar aprox.
                                    <span className={`font-black ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}> ${formatCLP(formMonthlySuggestion)}/mes </span>
                                    durante <span className="font-black">{differenceInCalendarMonths(new Date(goalDeadline), new Date())} meses</span>.
                                </p>
                            </div>
                        </div>
                    </div>
                )}

                <div className="sm:col-span-12 md:col-span-6 flex gap-3 justify-end mt-4">
                    <CustomButton
                        type="submit"
                        variant="primary"
                        icon={faPlus}
                        className="flex-1 sm:flex-none py-2.5 px-6 text-xs uppercase tracking-wider h-[42px]"
                        activeTheme={activeTheme}
                        isDark={isDark}
                    >
                        Crear Meta
                    </CustomButton>
                    {onCancel && (
                        <button type="button" onClick={onCancel}
                            className={`flex-1 sm:flex-none px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider border h-[42px] transition-all cursor-pointer ${isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-300 text-slate-500 hover:bg-slate-100'}`}>
                            Cancelar
                        </button>
                    )}
                </div>
            </div>
        </motion.form>
    )
}

export default SavingsGoalForm
