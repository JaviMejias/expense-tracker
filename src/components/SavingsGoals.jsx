import { useState } from 'react'
import { parseISO, differenceInCalendarMonths } from 'date-fns'
import { formatCLP, parseCLP } from '../utils/currency'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCoins, faPiggyBank, faBullseye, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { AnimatePresence } from 'framer-motion'
import { colorThemes, appThemes } from '../utils/theme'
import { useThemeStyles } from '../hooks/useThemeStyles'
import { useAppAlert } from '../hooks/useAppAlert'
import EmptyState from './EmptyState'
import SavingsGoalItem from './SavingsGoalItem'
import SavingsGoalForm from './SavingsGoalForm'
import { useDataStore } from '../store/useDataStore'
import { useThemeStore } from '../store/useThemeStore'
import { useUIStore } from '../store/useUIStore'
import { useDerivedData } from '../hooks/useDerivedData'

function SavingsGoals({ onCompleteCelebrate }) {
    const { savingsGoals, getSavingsGoalForDeletion, confirmDeleteSavingsGoal, contributeToGoal } = useDataStore()
    const { themeMode, currentTheme } = useThemeStore()
    const activeTheme = appThemes[currentTheme] || appThemes.classic
    const { currentMonthDate } = useUIStore()
    const { remainingSalary } = useDerivedData()

    const [showForm, setShowForm] = useState(false)

    const { s, isDark, activeColor, focusRingClass, aura } = useThemeStyles(themeMode, activeTheme)
    const { showAlert, showToast, showPrompt, showConfirm } = useAppAlert(themeMode)

    const totalSaved = savingsGoals.reduce((acc, curr) => acc + curr.currentSaved, 0)

    const handleDeleteGoal = async (goalId) => {
        const goal = getSavingsGoalForDeletion(goalId)
        if (!goal) return

        const confirmed = await showConfirm(
            '¿Eliminar meta?',
            `¿Estás seguro de eliminar la meta "${goal.title}"? Los aportes acumulados se perderán.`
        )
        if (confirmed.isConfirmed) {
            confirmDeleteSavingsGoal(goalId)
            showToast(`Meta "${goal.title}" eliminada`)
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
            const isCompleted = contributeToGoal(goal.id, numAmount, currentMonthDate)

            if (isCompleted) {
                onCompleteCelebrate()
                showAlert('¡Meta Completada! 🎉', `¡Felicidades! Has alcanzado el 100% de tu meta "${goal.title}". Sigue ahorrando con esa constancia.`, 'success')
            } else {
                showToast(`Aporte de $${formatCLP(numAmount)} registrado correctamente`)
            }
        }
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
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-2">
                    <h3 className={`text-lg font-black text-transparent bg-clip-text bg-gradient-to-r ${aura.gradientText} flex items-center gap-2 select-none uppercase tracking-wider`}>
                        <FontAwesomeIcon icon={faBullseye} className={aura.icon} /> Tus Metas Activas
                    </h3>
                    <button
                        type="button"
                        onClick={() => setShowForm(!showForm)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all cursor-pointer
                            ${showForm
                                ? (isDark ? 'bg-slate-700 border-slate-600 text-slate-300' : 'bg-slate-200 border-slate-300 text-slate-600')
                                : (isDark ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/30' : 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100')
                            }`}
                    >
                        <FontAwesomeIcon icon={showForm ? faChevronUp : faChevronDown} />
                        {showForm ? 'Cerrar' : 'Nueva Meta'}
                    </button>
                </div>
                
                <AnimatePresence>
                    {showForm && (
                        <SavingsGoalForm
                            isDark={isDark}
                            activeTheme={activeTheme}
                            activeColor={activeColor}
                            aura={aura}
                            s={s}
                            focusRingClass={focusRingClass}
                            onCancel={() => setShowForm(false)}
                        />
                    )}
                </AnimatePresence>

                {savingsGoals.length === 0 ? (
                    <EmptyState
                        icon={faCoins}
                        message="Aún no tienes metas de ahorro registradas."
                        subtitle="¡Crea tu primera meta abajo para comenzar a guardar!"
                        isDark={isDark}
                    />
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AnimatePresence mode="popLayout">
                            {savingsGoals.map((goal, index) => {
                                const percent = goal.targetAmount > 0 ? (goal.currentSaved / goal.targetAmount) * 100 : 0
                                const theme = colorThemes[goal.color] || colorThemes.rose

                                const remaining = goal.targetAmount - goal.currentSaved
                                const monthsLeft = goal.deadline
                                    ? Math.max(1, differenceInCalendarMonths(parseISO(goal.deadline), new Date()))
                                    : null
                                const monthlySuggestion = monthsLeft && remaining > 0
                                    ? Math.ceil(remaining / monthsLeft)
                                    : null

                                return (
                                    <SavingsGoalItem
                                        key={goal.id}
                                        goal={goal}
                                        index={index}
                                        theme={theme}
                                        percent={percent}
                                        s={s}
                                        isDark={isDark}
                                        aura={aura}
                                        monthsLeft={monthsLeft}
                                        monthlySuggestion={monthlySuggestion}
                                        onContribute={handleContributeClick}
                                        onDelete={handleDeleteGoal}
                                    />
                                )
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>
        </div>
    )
}

export default SavingsGoals
