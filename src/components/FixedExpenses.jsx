import { useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Swal from 'sweetalert2'
import { formatCLP, parseCLP } from '../utils/currency'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faSave, faCheckCircle, faTimes, faAlignLeft, faCoins, faTags } from '@fortawesome/free-solid-svg-icons'
import { colorThemes, getThemeClass } from '../utils/theme'

function FixedExpenses({ fixedExpenses, setFixedExpenses, applyFixedExpenseToMonth, currentMonthDate, setCurrentMonthDate, categories = [], themeMode = 'dark', activeTheme }) {
    const s = getThemeClass(themeMode)
    const isDark = themeMode === 'dark'
    const [fixedDescription, setFixedDescription] = useState('')
    const [fixedAmount, setFixedAmount] = useState('')
    const [fixedType, setFixedType] = useState('single')
    const [fixedDays, setFixedDays] = useState([])
    const [fixedCategory, setFixedCategory] = useState('otros')
    const [fixedErrors, setFixedErrors] = useState({})

    const primaryButtonClass = activeTheme ? `${activeTheme.accentBgColor} ${activeTheme.accentHoverBgColor}` : 'bg-indigo-600 hover:bg-indigo-500'
    const textGradientClass = activeTheme ? (isDark ? activeTheme.textGradient : activeTheme.textGradientLight) : (isDark ? 'from-indigo-400 to-purple-400' : 'from-indigo-600 to-purple-600')

    const activeColor = activeTheme?.accentBgColor?.includes('rose') ? 'rose' : activeTheme?.accentBgColor?.includes('emerald') ? 'emerald' : 'indigo'
    const focusRingClass = { rose: 'focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500', emerald: 'focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500', indigo: 'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500' }[activeColor]

    const auraStyles = {
        rose: {
            label: isDark ? 'text-rose-300' : 'text-rose-600',
            icon: 'text-rose-500',
            radio: isDark ? 'text-rose-500 focus:ring-rose-500 bg-slate-800 border-slate-600' : 'text-rose-600 focus:ring-rose-500 bg-white border-slate-300',
            radioHover: 'hover:border-rose-500',
            dayActive: 'bg-rose-500 text-white shadow-md shadow-rose-500/30 border border-rose-400',
            dayHover: isDark ? 'hover:border-rose-500 hover:text-rose-200' : 'hover:border-rose-500 hover:text-slate-800',
            hoverItem: 'hover:border-rose-500/50',
            dayBadge: isDark ? 'bg-rose-500/10 text-rose-300 border-rose-500/20' : 'bg-rose-50 text-rose-700 border border-rose-100',
            monthBox: isDark ? 'from-rose-950/40 via-slate-900/80 to-slate-950/60 border-rose-500/20 shadow-rose-950/50 hover:border-rose-500/30' : 'from-rose-50/50 via-white/85 to-slate-100/60 border-rose-200 shadow-rose-100/30 hover:border-rose-300',
            applyBtn: 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-500/30 border border-rose-400/50 hover:shadow-rose-500/50 hover:border-rose-300'
        },
        emerald: {
            label: isDark ? 'text-emerald-300' : 'text-emerald-600',
            icon: 'text-emerald-500',
            radio: isDark ? 'text-emerald-500 focus:ring-emerald-500 bg-slate-800 border-slate-600' : 'text-emerald-600 focus:ring-emerald-500 bg-white border-slate-300',
            radioHover: 'hover:border-emerald-500',
            dayActive: 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 border border-emerald-400',
            dayHover: isDark ? 'hover:border-emerald-500 hover:text-emerald-200' : 'hover:border-emerald-500 hover:text-slate-800',
            hoverItem: 'hover:border-emerald-500/50',
            dayBadge: isDark ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border border-emerald-100',
            monthBox: isDark ? 'from-emerald-950/40 via-slate-900/80 to-slate-950/60 border-emerald-500/20 shadow-emerald-950/50 hover:border-emerald-500/30' : 'from-emerald-50/50 via-white/85 to-slate-100/60 border-emerald-200 shadow-emerald-100/30 hover:border-emerald-300',
            applyBtn: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 border border-emerald-400/50 hover:shadow-emerald-500/50 hover:border-emerald-300'
        },
        indigo: {
            label: isDark ? 'text-indigo-300' : 'text-indigo-600',
            icon: 'text-indigo-500',
            radio: isDark ? 'text-indigo-500 focus:ring-indigo-500 bg-slate-800 border-slate-600' : 'text-indigo-600 focus:ring-indigo-500 bg-white border-slate-300',
            radioHover: 'hover:border-indigo-500',
            dayActive: 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30 border border-indigo-400',
            dayHover: isDark ? 'hover:border-indigo-500 hover:text-indigo-200' : 'hover:border-indigo-500 hover:text-slate-800',
            hoverItem: 'hover:border-indigo-500/50',
            dayBadge: isDark ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' : 'bg-indigo-50 text-indigo-700 border border-indigo-100',
            monthBox: isDark ? 'from-indigo-950/40 via-slate-900/80 to-slate-950/60 border-indigo-500/20 shadow-indigo-950/50 hover:border-indigo-500/30' : 'from-indigo-50/50 via-white/85 to-slate-100/60 border-indigo-200 shadow-indigo-100/30 hover:border-indigo-300',
            applyBtn: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/50 hover:shadow-indigo-500/50 hover:border-indigo-300'
        }
    }[activeColor]

    const currentMonthKey = format(currentMonthDate, 'MM-yyyy')

    const weekDays = [
        { id: 1, name: 'Lun' },
        { id: 2, name: 'Mar' },
        { id: 3, name: 'Mié' },
        { id: 4, name: 'Jue' },
        { id: 5, name: 'Vie' },
        { id: 6, name: 'Sáb' },
        { id: 0, name: 'Dom' }
    ]


    const categoryStyles = categories.reduce((acc, cat) => {
        acc[cat.id] = {
            label: cat.name,
            emoji: cat.emoji,
            bgClass: cat.colorClass || colorThemes[cat.color]?.bgClass || colorThemes.slate.bgClass
        }
        return acc
    }, {})

    const handleFixedAmountChange = (e) => {
        const val = e.target.value
        const filtered = val.replace(/[^0-9+\-*/().\s]/g, '')
        setFixedAmount(filtered)
    }

    const evaluateExpression = (expr) => {
        if (!expr) return 0
        const hasOperators = /[+\-*/]/.test(expr)
        if (!hasOperators) {
            return parseInt(expr.toString().replace(/\D/g, ''), 10) || 0
        }

        const cleaned = expr.replace(/\./g, '').replace(/[^0-9+\-*/().]/g, '')
        try {
            const result = Function(`"use strict"; return (${cleaned})`)()
            return typeof result === 'number' && !isNaN(result) && isFinite(result) ? Math.round(result) : 0
        } catch {
            return 0
        }
    }

    const handleFixedAmountBlur = () => {
        const evaluated = evaluateExpression(fixedAmount)
        if (evaluated > 0) {
            setFixedAmount(formatCLP(evaluated))
        } else {
            setFixedAmount('')
        }
    }

    const toggleFixedDay = (dayId) => {
        setFixedDays(prev =>
            prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId]
        )
    }

    const handleApplyToMonth = async (item) => {
        const applied = item.appliedMonths || []
        if (applied.includes(currentMonthKey)) {
            const result = await Swal.fire({
                title: '¿Plantilla duplicada?',
                text: `Ya aplicaste la plantilla "${item.description}" en este mes. ¿Estás seguro de querer añadirla nuevamente?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: s.swal.confirmButtonColor,
                cancelButtonColor: '#f43f5e',
                confirmButtonText: 'Sí, duplicar',
                cancelButtonText: 'Cancelar',
                background: s.swal.background,
                color: s.swal.color
            })
            if (!result.isConfirmed) return
        }

        applyFixedExpenseToMonth(item)

        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: `¡"${item.description}" añadido a ${format(currentMonthDate, 'MMMM', { locale: es })}!`,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: s.swal.background,
            color: s.swal.color,
            iconColor: '#10b981'
        })
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

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Plantilla guardada',
                showConfirmButton: false,
                timer: 2000,
                background: s.swal.background,
                color: s.swal.color,
                iconColor: '#10b981'
            })
        }
    }

    const handleDeleteFixedExpense = (id) => {
        setFixedExpenses(fixedExpenses.filter(f => f.id !== id))
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10 relative">
            <div>
                <h2 className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${textGradientClass} mb-6 flex items-center gap-2`}>
                    <FontAwesomeIcon icon={faStar} className={auraStyles.icon} /> Plantillas de Gastos
                </h2>
                <form onSubmit={handleSaveFixedExpense} className={`space-y-5 ${s.itemBg} p-6 rounded-3xl`}>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="fixedDescription" className={`flex items-center gap-2 text-sm font-bold ${auraStyles.label} mb-2`}>
                                <FontAwesomeIcon icon={faAlignLeft} /> Nombre (Ej: Gym, Pasajes):
                            </label>
                            <input
                                type="text"
                                id="fixedDescription"
                                value={fixedDescription}
                                onChange={(e) => setFixedDescription(e.target.value)}
                                className={`block w-full px-4 py-3 ${s.input} ${focusRingClass} rounded-xl font-medium transition-all shadow-inner`}
                            />
                            {fixedErrors.description && <p className="mt-1 text-sm text-rose-400 font-bold">{fixedErrors.description}</p>}
                        </div>
                        <div>
                            <label htmlFor="fixedAmount" className={`flex items-center gap-2 text-sm font-bold ${auraStyles.label} mb-2`}>
                                <FontAwesomeIcon icon={faCoins} /> Monto Total Diario/Único:
                            </label>
                            <div className="relative">
                                <span className={`absolute inset-y-0 left-0 pl-4 flex items-center font-bold ${auraStyles.icon}`}>$</span>
                                <input
                                    type="text"
                                    id="fixedAmount"
                                    value={fixedAmount}
                                    onChange={handleFixedAmountChange}
                                    onBlur={handleFixedAmountBlur}
                                    className={`block w-full pl-8 pr-4 py-3 ${s.input} ${focusRingClass} rounded-xl font-bold transition-all shadow-inner`}
                                />
                            </div>
                            {fixedErrors.amount && <p className="mt-1 text-sm text-rose-400 font-bold">{fixedErrors.amount}</p>}
                        </div>
                    </div>

                    <div>
                        <label className={`block text-sm font-bold ${auraStyles.label} mb-2`}>Tipo de Gasto:</label>
                        <div className="flex flex-col sm:flex-row gap-4">
                            <label className={`flex items-center gap-2 cursor-pointer ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-700'} ${auraStyles.radioHover} px-4 py-3 rounded-xl border transition-all flex-1 select-none`}>
                                <input
                                    type="radio"
                                    checked={fixedType === 'single'}
                                    onChange={() => setFixedType('single')}
                                    className={`w-5 h-5 cursor-pointer ${auraStyles.radio}`}
                                />
                                <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Mensual Único</span>
                            </label>
                            <label className={`flex items-center gap-2 cursor-pointer ${isDark ? 'bg-slate-900 border-slate-700 text-slate-200' : 'bg-white border-slate-300 text-slate-700'} ${auraStyles.radioHover} px-4 py-3 rounded-xl border transition-all flex-1 select-none`}>
                                <input
                                    type="radio"
                                    checked={fixedType === 'weekly'}
                                    onChange={() => setFixedType('weekly')}
                                    className={`w-5 h-5 cursor-pointer ${auraStyles.radio}`}
                                />
                                <span className={`font-bold ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>Repetir por Días</span>
                            </label>
                        </div>
                    </div>

                    {fixedType === 'weekly' && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <label className={`block text-sm font-bold ${auraStyles.label} mb-3`}>Selecciona los días (Ej: Lunes a Viernes):</label>
                            <div className="flex flex-wrap gap-2">
                                {weekDays.map(day => (
                                    <button
                                        key={day.id}
                                        type="button"
                                        onClick={() => toggleFixedDay(day.id)}
                                        className={`px-4 py-2 rounded-xl font-bold transition-all transform hover:scale-105 cursor-pointer ${fixedDays.includes(day.id) ? auraStyles.dayActive : (isDark ? `bg-slate-900 text-slate-400 border border-slate-700 ${auraStyles.dayHover}` : `bg-white text-slate-600 border border-slate-300 shadow-sm ${auraStyles.dayHover}`)}`}
                                    >
                                        {day.name}
                                    </button>
                                ))}
                            </div>
                            {fixedErrors.days && <p className="mt-2 text-sm text-rose-400 font-bold">{fixedErrors.days}</p>}
                        </div>
                    )}

                    <div className="group">
                        <label className={`flex items-center gap-2 text-sm font-bold ${auraStyles.label} mb-3 transition-colors`}>
                            <FontAwesomeIcon icon={faTags} /> Categoría de la Plantilla:
                        </label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                            {categories.map(cat => {
                                const isActive = fixedCategory === cat.id
                                return (
                                    <button
                                        key={cat.id}
                                        type="button"
                                        onClick={() => setFixedCategory(cat.id)}
                                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 transform select-none cursor-pointer focus:outline-none ${focusRingClass} ${isActive ? cat.activeClass : `${isDark ? 'border-slate-700' : 'border-slate-200'} ${auraStyles.hoverItem} ${cat.colorClass}`
                                            }`}
                                    >
                                        <span className="text-2xl mb-1.5">{cat.emoji}</span>
                                        <span className="text-xs font-black tracking-wide uppercase">{cat.name}</span>
                                    </button>
                                )
                            })}
                        </div>
                    </div>

                    <button type="submit" className={`w-full ${primaryButtonClass} text-white font-extrabold py-4 rounded-xl transition-colors mt-4 shadow-lg flex items-center justify-center gap-2 cursor-pointer`}>
                        <FontAwesomeIcon icon={faSave} /> Guardar Plantilla
                    </button>
                </form>
            </div>

            <div>
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between border-b ${isDark ? 'border-slate-700/50' : 'border-slate-200'} pb-4 mb-6 gap-4`}>
                    <h3 className={`text-xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${textGradientClass} flex items-center gap-2`}>
                        Mis Plantillas
                    </h3>

                    {/* Contenedor Premium del Selector de Mes de Destino */}
                    <div className={`w-full sm:w-auto bg-gradient-to-br ${auraStyles.monthBox} backdrop-blur-md px-5 py-3 rounded-2xl border flex flex-col sm:flex-row items-center gap-3 sm:gap-4 transition-all group`}>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className="text-xs font-black text-slate-300 group-hover:text-indigo-300 transition-colors uppercase tracking-wider">Aplicar al mes de:</span>
                        </div>
                        <DatePicker
                            selected={currentMonthDate}
                            onChange={(date) => setCurrentMonthDate(date)}
                            dateFormat="MMMM yyyy"
                            showMonthYearPicker
                            locale={es}
                            calendarClassName={`aura-datepicker-${activeColor}`}
                            wrapperClassName="w-full sm:w-auto"
                            className={`block w-full sm:w-44 px-4 py-2 ${s.input} ${focusRingClass} rounded-xl font-extrabold text-xs text-center uppercase tracking-wide cursor-pointer transition-all shadow-inner ${activeTheme ? activeTheme.accentGlowText : (isDark ? 'text-indigo-400' : 'text-indigo-600')}`}
                        />
                    </div>
                </div>
                <div className="space-y-4">
                    {fixedExpenses.length === 0 ? (
                        <p className={`${s.bodyTextMuted} font-medium italic text-center py-6 ${isDark ? 'bg-slate-800/30 border-slate-600' : 'bg-slate-100/50 border-slate-300'} rounded-2xl border border-dashed`}>No has creado plantillas de gastos fijos.</p>
                    ) : (
                        fixedExpenses.map(item => (
                            <div key={item.id} className={`flex flex-col sm:flex-row justify-between items-center ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200/80 shadow-md shadow-slate-100/50'} ${auraStyles.hoverItem} p-5 rounded-2xl border gap-4 transition-all hover:-translate-y-1`}>
                                <div className="flex-1 w-full">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className={`font-extrabold ${s.bodyText}`}>{item.description}</p>

                                        {/* Dynamic Category Badge */}
                                        {(() => {
                                            const cat = categoryStyles[item.category || 'otros']
                                            return (
                                                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${cat.bgClass} flex items-center gap-1 select-none`}>
                                                    <span>{cat.emoji}</span>
                                                    <span>{cat.label}</span>
                                                </span>
                                            )
                                        })()}
                                    </div>
                                    <p className="text-sm font-bold text-rose-400 mt-1">${formatCLP(item.amount)} {item.type === 'weekly' && 'por día'}</p>
                                    {item.type === 'weekly' && (
                                        <div className="flex gap-1 mt-2">
                                            {item.days.map(d => {
                                                const dayName = weekDays.find(w => w.id === d)?.name;
                                                return <span key={d} className={`text-xs font-bold px-2 py-1 rounded-md border ${auraStyles.dayBadge}`}>{dayName}</span>
                                            })}
                                        </div>
                                    )}
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                                    <button
                                        onClick={() => handleApplyToMonth(item)}
                                        className={`flex-1 sm:flex-none font-bold py-3 px-5 rounded-xl transition-all transform hover:-translate-y-1 capitalize flex items-center justify-center gap-2 cursor-pointer ${auraStyles.applyBtn}`}
                                    >
                                        <FontAwesomeIcon icon={faCheckCircle} /> Añadir a {format(currentMonthDate, 'MMMM', { locale: es })}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteFixedExpense(item.id)}
                                        className={`${isDark ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' : 'bg-rose-50 text-rose-600 border-rose-100'} font-bold py-3 px-4 rounded-xl hover:bg-rose-500 hover:text-white border transition-colors cursor-pointer`}
                                    >
                                        <FontAwesomeIcon icon={faTimes} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default FixedExpenses