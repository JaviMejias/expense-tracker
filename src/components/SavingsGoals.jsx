import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import Swal from 'sweetalert2'
import { formatCLP, parseCLP } from '../utils/currency'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash, faCoins, faPiggyBank, faBullseye, faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import { colorThemes, getThemeClass } from '../utils/theme'

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
    const s = getThemeClass(themeMode)
    const isDark = themeMode === 'dark'
    const [goalTitle, setGoalTitle] = useState('')
    const [goalTarget, setGoalTarget] = useState('')
    const [goalDeadline, setGoalDeadline] = useState('')
    const [goalColor, setGoalColor] = useState('indigo')

    const primaryButtonClass = activeTheme ? `${activeTheme.accentBgColor} ${activeTheme.accentHoverBgColor}` : 'bg-indigo-600 hover:bg-indigo-500'
    const textGradientClass = activeTheme ? (isDark ? activeTheme.textGradient : activeTheme.textGradientLight) : (isDark ? 'from-indigo-400 to-purple-400' : 'from-indigo-600 to-purple-600')

    const activeColor = activeTheme?.accentBgColor?.includes('rose') ? 'rose' : activeTheme?.accentBgColor?.includes('emerald') ? 'emerald' : 'indigo'
    const focusRingClass = { rose: 'focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500', emerald: 'focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500', indigo: 'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500' }[activeColor]

    const auraStyles = {
        rose: {
            icon: 'text-rose-400',
            bgGlow: 'bg-rose-500/10 blur-[50px]',
            boxBg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
            label: 'text-rose-400',
            gradient: isDark ? 'from-rose-950/60 to-pink-900/40 border-rose-500/20 hover:border-rose-500/35' : 'from-rose-50/50 via-white/85 to-pink-50/50 border-rose-200 hover:border-rose-300',
            btn: 'bg-rose-600 hover:bg-rose-500 text-white',
            gradientText: 'from-rose-300 to-pink-300'
        },
        emerald: {
            icon: 'text-emerald-400',
            bgGlow: 'bg-emerald-500/10 blur-[50px]',
            boxBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
            label: 'text-emerald-400',
            gradient: isDark ? 'from-emerald-950/60 to-teal-900/40 border-emerald-500/20 hover:border-emerald-500/35' : 'from-emerald-50/50 via-white/85 to-teal-50/50 border-emerald-200 hover:border-emerald-300',
            btn: 'bg-emerald-600 hover:bg-emerald-500 text-white',
            gradientText: 'from-emerald-300 to-teal-300'
        },
        indigo: {
            icon: 'text-indigo-400',
            bgGlow: 'bg-indigo-500/10 blur-[50px]',
            boxBg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
            label: 'text-indigo-400',
            gradient: isDark ? 'from-indigo-950/60 to-purple-900/40 border-indigo-500/20 hover:border-indigo-500/35' : 'from-indigo-50/50 via-white/85 to-purple-50/50 border-indigo-200 hover:border-indigo-300',
            btn: 'bg-indigo-600 hover:bg-indigo-500 text-white',
            gradientText: 'from-indigo-300 to-purple-300'
        }
    }[activeColor]

    const totalSaved = savingsGoals.reduce((acc, curr) => acc + curr.currentSaved, 0)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!goalTitle.trim()) {
            Swal.fire({
                title: 'Campo Requerido',
                text: 'Ingresa un nombre para tu meta de ahorro.',
                icon: 'warning',
                background: s.swal.background,
                color: s.swal.color,
                confirmButtonColor: s.swal.confirmButtonColor
            })
            return
        }

        const targetNum = parseCLP(goalTarget)
        if (targetNum <= 0) {
            Swal.fire({
                title: 'Monto Inválido',
                text: 'El monto objetivo debe ser mayor a cero.',
                icon: 'warning',
                background: s.swal.background,
                color: s.swal.color,
                confirmButtonColor: s.swal.confirmButtonColor
            })
            return
        }

        if (!goalDeadline) {
            Swal.fire({
                title: 'Campo Requerido',
                text: 'Por favor selecciona una fecha límite para cumplir tu meta.',
                icon: 'warning',
                background: s.swal.background,
                color: s.swal.color,
                confirmButtonColor: s.swal.confirmButtonColor
            })
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

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: '¡Meta de ahorro creada con éxito!',
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: s.swal.background,
                color: s.swal.color,
                iconColor: '#10b981'
            })
        }
    }

    const handleContributeClick = async (goal) => {
        const maxAllowed = remainingSalary
        if (maxAllowed <= 0) {
            Swal.fire({
                title: 'Presupuesto Insuficiente',
                text: 'No dispones de sueldo libre en este mes para transferir al ahorro.',
                icon: 'warning',
                background: s.swal.background,
                color: s.swal.color,
                confirmButtonColor: s.swal.confirmButtonColor
            })
            return
        }

        const { value: amountStr } = await Swal.fire({
            title: `Aportar a "${goal.title}"`,
            text: `¿Cuánto deseas transferir a esta meta? (Sueldo disponible este mes: $${formatCLP(maxAllowed)})`,
            input: 'text',
            inputPlaceholder: 'Ingresa el monto (ej: 25000)...',
            showCancelButton: true,
            confirmButtonColor: '#10b981',
            cancelButtonColor: isDark ? '#475569' : '#e2e8f0',
            confirmButtonText: 'Confirmar Aporte 💰',
            cancelButtonText: 'Cancelar',
            background: s.swal.background,
            color: s.swal.color,
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
                Swal.fire({
                    title: '¡Meta Completada! 🎉',
                    text: `¡Felicidades! Has alcanzado el 100% de tu meta "${goal.title}". Sigue ahorrando con esa constancia.`,
                    icon: 'success',
                    background: s.swal.background,
                    color: s.swal.color,
                    confirmButtonColor: '#10b981'
                })
            } else {
                Swal.fire({
                    toast: true,
                    position: 'top-end',
                    icon: 'success',
                    title: `Aporte de $${formatCLP(numAmount)} registrado correctamente`,
                    showConfirmButton: false,
                    timer: 3000,
                    timerProgressBar: true,
                    background: s.swal.background,
                    color: s.swal.color,
                    iconColor: '#10b981'
                })
            }
        }
    }

    const handleTargetChange = (e) => {
        const val = e.target.value
        setGoalTarget(formatCLP(val))
    }

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* Piggy Bank Dashboard Card */}
            <div className={`relative overflow-hidden bg-gradient-to-br ${auraStyles.gradient} border rounded-[2rem] p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-6 transition-all shadow-2xl`}>
                <div className={`absolute -right-10 -bottom-10 w-44 h-44 rounded-full pointer-events-none ${auraStyles.bgGlow}`}></div>
                <div className="flex items-center gap-4 text-center sm:text-left flex-col sm:flex-row">
                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl shadow-inner ${auraStyles.boxBg}`}>
                        <FontAwesomeIcon icon={faPiggyBank} />
                    </div>
                    <div>
                        <h3 className={`text-xs font-black uppercase tracking-widest ${auraStyles.label}`}>Ahorro Acumulado Total</h3>
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

            {/* Goals Grid */}
            <div className="space-y-6">
                <h3 className={`text-lg font-black text-transparent bg-clip-text bg-gradient-to-r ${auraStyles.gradientText} flex items-center gap-2 select-none uppercase tracking-wider`}>
                    <FontAwesomeIcon icon={faBullseye} className={auraStyles.icon} /> Tus Metas Activas
                </h3>

                {savingsGoals.length === 0 ? (
                    <div className={`text-center py-16 ${isDark ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-100/50 border-slate-200'} border border-dashed rounded-3xl`}>
                        <FontAwesomeIcon icon={faCoins} className="text-5xl text-slate-600 mb-4 animate-pulse" />
                        <p className={`${s.bodyTextMuted} font-bold text-lg`}>Aún no tienes metas de ahorro registradas.</p>
                        <p className={`${isDark ? 'text-slate-500' : 'text-slate-400'} text-sm mt-1`}>¡Crea tu primera meta abajo para comenzar a guardar!</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {savingsGoals.map(goal => {
                            const percent = goal.targetAmount > 0 ? (goal.currentSaved / goal.targetAmount) * 100 : 0
                            const theme = colorThemes[goal.color] || colorThemes.rose

                            // SVG calculations
                            const radius = 32
                            const circumference = 2 * Math.PI * radius
                            const strokeDashoffset = circumference - (Math.min(percent, 100) / 100) * circumference

                            const colorClasses = {
                                rose: 'text-rose-400 border-rose-500/20 bg-rose-500/5 hover:border-rose-500/40',
                                blue: 'text-blue-400 border-blue-500/20 bg-blue-500/5 hover:border-blue-500/40',
                                amber: 'text-amber-400 border-amber-500/20 bg-amber-500/5 hover:border-amber-500/40',
                                emerald: 'text-emerald-400 border-emerald-500/20 bg-emerald-500/5 hover:border-emerald-500/40',
                                pink: 'text-pink-400 border-pink-500/20 bg-pink-500/5 hover:border-pink-500/40',
                                violet: 'text-violet-400 border-violet-500/20 bg-violet-500/5 hover:border-violet-500/40',
                                sky: 'text-sky-400 border-sky-500/20 bg-sky-500/5 hover:border-sky-500/40',
                                slate: 'text-slate-400 border-slate-600/20 bg-slate-800/10 hover:border-slate-600/40'
                            }

                            const svgColors = {
                                rose: '#f43f5e',
                                blue: '#3b82f6',
                                amber: '#f59e0b',
                                emerald: '#10b981',
                                pink: '#ec4899',
                                violet: '#8b5cf6',
                                sky: '#06b6d4',
                                slate: '#64748b'
                            }

                            return (
                                <div key={goal.id} className={`group p-6 ${isDark ? 'bg-slate-800/60 border-slate-700/50 hover:border-indigo-500/30' : 'bg-white border-slate-200 shadow-md shadow-slate-100/30 hover:border-indigo-500/50'} border rounded-3xl transition-all duration-300 flex items-center justify-between gap-6 relative overflow-hidden`}>
                                    <div className="flex-1 space-y-3">
                                        <div>
                                            <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border capitalize inline-block mb-1.5 ${colorClasses[goal.color]}`}>
                                                Meta {theme.label}
                                            </span>
                                            <h4 className={`text-xl font-extrabold ${s.bodyText} leading-snug`}>{goal.title}</h4>
                                        </div>

                                        <div className="flex flex-col gap-1">
                                            <div className={`flex justify-between text-xs font-bold ${s.bodyTextMuted}`}>
                                                <span>Ahorrado:</span>
                                                <span className={`${isDark ? 'text-slate-200' : 'text-slate-700'}`}>${formatCLP(goal.currentSaved)} / ${formatCLP(goal.targetAmount)}</span>
                                            </div>

                                            {goal.deadline && (
                                                <div className={`flex items-center gap-1.5 text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'} font-bold mt-1`}>
                                                    <FontAwesomeIcon icon={faCalendarAlt} className="opacity-70" />
                                                    <span>Límite: {format(parseISO(goal.deadline), "d 'de' MMMM, yyyy", { locale: es })}</span>
                                                </div>
                                            )}
                                        </div>

                                        {goal.currentSaved < goal.targetAmount ? (
                                            <button
                                                type="button"
                                                onClick={() => handleContributeClick(goal)}
                                                className={`${auraStyles.btn} font-extrabold text-[10px] uppercase tracking-wider px-4 py-2 rounded-xl transition-all shadow-md cursor-pointer select-none`}
                                            >
                                                Aportar 💰
                                            </button>
                                        ) : (
                                            <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-xl inline-block animate-pulse">
                                                Meta Completada 🎉
                                            </span>
                                        )}
                                    </div>

                                    {/* Circular Progress SVG */}
                                    <div className="relative w-20 h-20 flex-shrink-0">
                                        <svg className="w-full h-full transform -rotate-90">
                                            <circle
                                                cx="40"
                                                cy="40"
                                                r={radius}
                                                stroke={isDark ? '#1e293b' : '#e2e8f0'}
                                                strokeWidth="6"
                                                fill="transparent"
                                            />
                                            <circle
                                                cx="40"
                                                cy="40"
                                                r={radius}
                                                stroke={svgColors[goal.color] || '#6366f1'}
                                                strokeWidth="6"
                                                fill="transparent"
                                                strokeDasharray={circumference}
                                                strokeDashoffset={strokeDashoffset}
                                                strokeLinecap="round"
                                                className="transition-all duration-1000 ease-out"
                                            />
                                        </svg>
                                        <div className={`absolute inset-0 flex items-center justify-center text-xs font-black ${s.bodyText} select-none`}>
                                            {percent.toFixed(0)}%
                                        </div>
                                    </div>

                                    {/* Delete Button */}
                                    <button
                                        type="button"
                                        onClick={() => handleDeleteSavingsGoal(goal.id)}
                                        className={`absolute top-4 right-4 ${isDark ? 'bg-slate-900/50 border-slate-700/50 hover:bg-rose-500/20 hover:border-rose-500/50 text-slate-400 hover:text-rose-400' : 'bg-slate-100/80 border-slate-200 hover:bg-rose-500 hover:text-white text-slate-500'} border w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer opacity-100 sm:opacity-0 group-hover:opacity-100 select-none`}
                                        title="Eliminar meta"
                                    >
                                        <FontAwesomeIcon icon={faTrash} className="text-[10px]" />
                                    </button>
                                </div>
                            )
                        })}
                    </div>
                )}
            </div>

            {/* Create Goal Form */}
            <div className={`${s.itemBg} p-6 sm:p-8 rounded-[2rem] space-y-6`}>
                <h3 className={`text-lg font-black text-transparent bg-clip-text bg-gradient-to-r ${auraStyles.gradientText} flex items-center gap-2 select-none uppercase tracking-wider`}>
                    <FontAwesomeIcon icon={faPlus} className={auraStyles.icon} /> Crear Nueva Meta de Ahorro
                </h3>

                <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-5 items-end">
                    <div className="sm:col-span-4">
                        <label htmlFor="goalTitle" className={`block text-[10px] font-bold ${auraStyles.label} mb-1.5 uppercase tracking-wider`}>Título de la Meta</label>
                        <input
                            type="text"
                            id="goalTitle"
                            value={goalTitle}
                            onChange={(e) => setGoalTitle(e.target.value)}
                            placeholder="Ej: Enganche de Casa, Computadora..."
                            className={`block w-full px-4 py-2.5 ${s.input} ${focusRingClass} rounded-xl text-sm font-bold transition-all`}
                        />
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="goalTarget" className={`block text-[10px] font-bold ${auraStyles.label} mb-1.5 uppercase tracking-wider`}>Monto Objetivo ($)</label>
                        <input
                            type="text"
                            id="goalTarget"
                            value={goalTarget}
                            onChange={handleTargetChange}
                            placeholder="Monto meta..."
                            className={`block w-full px-4 py-2.5 ${s.input} ${focusRingClass} rounded-xl text-sm font-bold transition-all`}
                        />
                    </div>

                    <div className="sm:col-span-3">
                        <label htmlFor="goalDeadline" className={`block text-[10px] font-bold ${auraStyles.label} mb-1.5 uppercase tracking-wider`}>Fecha Límite</label>
                        <DatePicker
                            selected={goalDeadline ? new Date(goalDeadline) : null}
                            onChange={(date) => setGoalDeadline(date ? date.toISOString() : '')}
                            dateFormat="dd MMM yyyy"
                            locale={es}
                            calendarClassName={`aura-datepicker-${activeColor}`}
                            wrapperClassName="w-full"
                            placeholderText="Seleccionar..."
                            className={`block w-full px-4 py-2.5 ${s.input} ${focusRingClass} rounded-xl text-sm font-bold transition-all text-center sm:text-left ${activeTheme ? activeTheme.accentGlowText : (isDark ? 'text-indigo-400' : 'text-indigo-600')}`}
                        />
                    </div>

                    {/* Color selector grid */}
                    <div className="sm:col-span-12 md:col-span-6 flex flex-col mt-2">
                        <span className={`block text-[10px] font-bold ${s.bodyTextMuted} mb-2.5 uppercase tracking-wider`}>Color de la Meta</span>
                        <div className="flex gap-2.5 items-center h-10">
                            {Object.keys(colorThemes).map(themeKey => {
                                const theme = colorThemes[themeKey]
                                const isSelected = goalColor === themeKey
                                const colorDotClasses = {
                                    rose: 'bg-rose-500 ring-rose-500/40',
                                    blue: 'bg-blue-500 ring-blue-500/40',
                                    amber: 'bg-amber-500 ring-amber-500/40',
                                    emerald: 'bg-emerald-500 ring-emerald-500/40',
                                    pink: 'bg-pink-500 ring-pink-500/40',
                                    violet: 'bg-violet-500 ring-violet-500/40',
                                    sky: 'bg-sky-500 ring-sky-500/40',
                                    slate: 'bg-slate-500 ring-slate-500/40'
                                }
                                return (
                                    <button
                                        key={themeKey}
                                        type="button"
                                        onClick={() => setGoalColor(themeKey)}
                                        className={`w-6.5 h-6.5 rounded-full ${colorDotClasses[themeKey]} cursor-pointer transform hover:scale-125 transition-all outline-none ${isSelected ? `ring-4 ring-offset-2 ${isDark ? 'ring-offset-slate-900' : 'ring-offset-white'} scale-110` : 'opacity-60 hover:opacity-100'}`}
                                        title={theme.label}
                                    ></button>
                                )
                            })}
                        </div>
                    </div>

                    <div className="sm:col-span-12 md:col-span-6 flex justify-end">
                        <button
                            type="submit"
                            className={`w-full sm:w-auto ${primaryButtonClass} text-white font-extrabold py-2.5 px-6 rounded-xl transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-1.5 cursor-pointer text-xs uppercase select-none tracking-wider h-[42px] shadow-lg`}
                        >
                            <FontAwesomeIcon icon={faPlus} /> Crear Meta
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default SavingsGoals
