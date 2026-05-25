import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { formatCLP, parseCLP } from '../utils/currency'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash, faCoins, faPiggyBank, faBullseye, faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import { colorThemes, getThemeClass } from '../utils/theme'
import CustomDatePicker from './CustomDatePicker'
import CustomButton from './CustomButton'
import CustomInput from './CustomInput'
import ColorSelector from './ColorSelector'
import { useThemeStyles } from '../hooks/useThemeStyles'
import CircularProgress from './CircularProgress'
import { useAppAlert } from '../hooks/useAppAlert'
import EmptyState from './EmptyState'
import SavingsGoalItem from './SavingsGoalItem'

function SavingsGoals({
    savingsGoals = [],
    handleAddSavingsGoal,
    handleDeleteSavingsGoal,
    handleContributeToGoal,
    remainingSalary = 0,
    onCompleteCelebrate,
    themeMode = 'dark',
    activeTheme
}) {
    const [goalTitle, setGoalTitle] = useState('')
    const [goalTarget, setGoalTarget] = useState('')
    const [goalDeadline, setGoalDeadline] = useState('')
    const [goalColor, setGoalColor] = useState('indigo')

    const { s, isDark, activeColor, focusRingClass, aura } = useThemeStyles(themeMode, activeTheme)
    const { showAlert, showToast, showPrompt } = useAppAlert(themeMode)

    const totalSaved = savingsGoals.reduce((acc, curr) => acc + curr.currentSaved, 0)

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

        const success = handleAddSavingsGoal({
            title: goalTitle,
            targetAmount: targetNum,
            deadline: new Date(goalDeadline).toISOString(),
            color: goalColor
        })

        if (success) {
            setGoalTitle('')
            setGoalTarget('')
            setGoalDeadline('')
            setGoalColor('indigo')

            showToast('¡Meta de ahorro creada con éxito!')
        }
    }

    const handleContributeClick = async (goal) => {
        const maxAllowed = remainingSalary
        if (maxAllowed <= 0) {
            showAlert('Presupuesto Insuficiente', 'No dispones de sueldo libre en este mes para transferir al ahorro.')
            return
        }

        const { value: amountStr } = await showPrompt({
            title: `Aportar a "${goal.title}"`,
            text: `¿Cuánto deseas transferir a esta meta? (Sueldo disponible este mes: $${formatCLP(maxAllowed)})`,
            input: 'text',
            inputPlaceholder: 'Ingresa el monto (ej: 25000)...',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            confirmButtonText: 'Confirmar Aporte 💰',
            cancelButtonText: 'Cancelar',
            isAmountPrompt: true,
            inputValidator: (value) => {
                const num = parseCLP(value)
                if (num <= 0) {
                    return 'Ingresa un monto válido mayor a cero'
                }
                if (num > maxAllowed) {
                    return `El monto excede el sueldo disponible ($${formatCLP(maxAllowed)})`
                }
                const remainingToComplete = goal.targetAmount - goal.currentSaved
                if (num > remainingToComplete) {
                    return `El aporte no puede superar los $${formatCLP(remainingToComplete)} requeridos para completar la meta.`
                }
            }
        })

        if (amountStr) {
            const numAmount = parseCLP(amountStr)
            const isCompleted = handleContributeToGoal(goal.id, numAmount)

            if (isCompleted) {
                onCompleteCelebrate()
                showAlert('¡Meta Completada! 🎉', `¡Felicidades! Has alcanzado el 100% de tu meta "${goal.title}". Sigue ahorrando con esa constancia.`, 'success')
            } else {
                showToast(`Aporte de $${formatCLP(numAmount)} registrado correctamente`)
            }
        }
    }

    const handleTargetChange = (e) => {
        const val = e.target.value
        setGoalTarget(formatCLP(val))
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className={`relative overflow-hidden bg-gradient-to-br ${aura.gradient} border rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all shadow-2xl`}>
                <div className={`absolute -right-10 -bottom-10 w-44 h-44 rounded-full pointer-events-none ${aura.bgGlow}`}></div>
                <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-inner ${aura.boxBg}`}>
                        <FontAwesomeIcon icon={faPiggyBank} />
                    </div>
                    <div>
                        <h3 className={`text-xs font-black uppercase tracking-widest ${aura.label}`}>Ahorro Acumulado Total</h3>
                        <p className={`text-3xl sm:text-4xl font-black ${s.bodyText} mt-1`}>${formatCLP(totalSaved)}</p>
                        <p className={`text-xs ${s.bodyTextMuted} mt-1.5 font-medium`}>Suma de todas tus metas activas</p>
                    </div>
                </div>
                <div className={`w-full sm:w-auto ${isDark ? 'bg-slate-900/60 border-slate-700/50' : 'bg-slate-50 border-slate-200/80 shadow-inner'} p-4 rounded-2xl text-center sm:text-right`}>
                    <span className={`text-[10px] font-black ${s.bodyTextMuted} uppercase tracking-widest`}>Sueldo disponible este mes</span>
                    <p className={`text-xl sm:text-2xl font-black mt-1 ${remainingSalary > 0 ? 'text-emerald-400' : 'text-slate-400'}`}>
                        ${formatCLP(remainingSalary)}
                    </p>
                </div>
            </div>

            <div className="space-y-6">
                <h3 className={`text-lg font-black text-transparent bg-clip-text bg-gradient-to-r ${aura.gradientText} flex items-center gap-2 select-none uppercase tracking-wider`}>
                    <FontAwesomeIcon icon={faBullseye} className={aura.icon} /> Tus Metas Activas
                </h3>

                {savingsGoals.length === 0 ? (
                    <EmptyState
                        icon={faCoins}
                        message="Aún no tienes metas de ahorro registradas."
                        subtitle="¡Crea tu primera meta abajo para comenzar a guardar!"
                        isDark={isDark}
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {savingsGoals.map(goal => {
                            const percent = goal.targetAmount > 0 ? (goal.currentSaved / goal.targetAmount) * 100 : 0
                            const theme = colorThemes[goal.color] || colorThemes.rose

                            return (
                                <SavingsGoalItem
                                    key={goal.id}
                                    goal={goal}
                                    theme={theme}
                                    percent={percent}
                                    s={s}
                                    isDark={isDark}
                                    aura={aura}
                                    onContribute={handleContributeClick}
                                    onDelete={handleDeleteSavingsGoal}
                                />
                            )
                        })}
                    </div>
                )}
            </div>

            <div className={`${s.itemBg} p-6 sm:p-8 rounded-[2rem] space-y-6`}>
                <h3 className={`text-lg font-black text-transparent bg-clip-text bg-gradient-to-r ${aura.gradientText} flex items-center gap-2 select-none uppercase tracking-wider`}>
                    <FontAwesomeIcon icon={faPlus} className={aura.icon} /> Crear Nueva Meta de Ahorro
                </h3>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-end">
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

                    <div className="sm:col-span-12 md:col-span-6 flex justify-end">
                        <CustomButton
                            type="submit"
                            variant="primary"
                            icon={faPlus}
                            className="w-full sm:w-auto py-2.5 px-6 text-xs uppercase tracking-wider h-[42px]"
                            activeTheme={activeTheme}
                            isDark={isDark}
                        >
                            Crear Meta
                        </CustomButton>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SavingsGoals
