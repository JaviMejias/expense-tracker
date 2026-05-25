import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Swal from 'sweetalert2'
import { formatCLP, parseCLP } from '../utils/currency'
import { es } from 'date-fns/locale'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faMoneyBillWave, faChartPie, faPiggyBank, faCog } from '@fortawesome/free-solid-svg-icons'
import { getThemeClass } from '../utils/theme'

function MonthSummary({
    currentMonthDate,
    setCurrentMonthDate,
    displaySalary,
    handleSalaryChange,
    errors,
    totalExpenses,
    remainingSalary,
    currentMonthExpenses = [],
    categoryLimits = {},
    handleSetCategoryLimit,
    categories = [],
    themeMode = 'dark',
    activeTheme
}) {
    const s = getThemeClass(themeMode)
    const isDark = themeMode === 'dark'

    const numericSalary = totalExpenses + remainingSalary
    const percentSpent = numericSalary > 0 ? (totalExpenses / numericSalary) * 100 : 0

    const activeColor = activeTheme?.accentBgColor?.includes('rose') ? 'rose' : activeTheme?.accentBgColor?.includes('emerald') ? 'emerald' : 'indigo'
    const focusRingClass = { rose: 'focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500', emerald: 'focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500', indigo: 'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500' }[activeColor]
    const labelClass = { rose: `flex items-center gap-2 text-sm font-bold ${isDark ? 'text-rose-300 group-hover:text-rose-400' : 'text-rose-600 group-hover:text-rose-700'} transition-colors`, emerald: `flex items-center gap-2 text-sm font-bold ${isDark ? 'text-emerald-300 group-hover:text-emerald-400' : 'text-emerald-600 group-hover:text-emerald-700'} transition-colors`, indigo: `flex items-center gap-2 text-sm font-bold ${isDark ? 'text-indigo-300 group-hover:text-indigo-400' : 'text-indigo-600 group-hover:text-indigo-700'} transition-colors` }[activeColor]
    const textGradientClass = activeTheme ? (isDark ? activeTheme.textGradient : activeTheme.textGradientLight) : (isDark ? 'from-indigo-400 to-purple-400' : 'from-indigo-600 to-purple-600')

    const auraStyles = {
        rose: { icon: 'text-rose-500', hoverBorder: 'hover:border-rose-500/20 hover:text-rose-400', badge: isDark ? 'text-rose-300 bg-rose-500/10 border-rose-500/20' : 'text-rose-600 bg-rose-50 border-rose-200' },
        emerald: { icon: 'text-emerald-500', hoverBorder: 'hover:border-emerald-500/20 hover:text-emerald-400', badge: isDark ? 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20' : 'text-emerald-600 bg-emerald-50 border-emerald-200' },
        indigo: { icon: 'text-indigo-500', hoverBorder: 'hover:border-indigo-500/20 hover:text-indigo-400', badge: isDark ? 'text-indigo-300 bg-indigo-500/10 border-indigo-500/20' : 'text-indigo-600 bg-indigo-50 border-indigo-200' }
    }[activeColor]

    const colorGradients = {
        rose: 'from-rose-500 to-red-600',
        blue: 'from-blue-500 to-indigo-600',
        amber: 'from-amber-500 to-yellow-600',
        emerald: 'from-emerald-500 to-teal-600',
        pink: 'from-pink-500 to-rose-600',
        violet: 'from-violet-500 to-purple-600',
        sky: 'from-sky-500 to-blue-600',
        slate: 'from-slate-500 to-slate-600'
    }

    const categoriesWithGradients = categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        emoji: cat.emoji,
        color: colorGradients[cat.color] || colorGradients.slate
    }))

    const categoryTotals = currentMonthExpenses.reduce((acc, curr) => {
        const cat = curr.category || 'otros'
        acc[cat] = (acc[cat] || 0) + curr.amount
        return acc
    }, {})

    let progressBarColor = 'bg-gradient-to-r from-emerald-500 to-teal-400'
    let progressBgGlow = 'shadow-emerald-500/20'
    let progressWarningText = null

    if (percentSpent >= 100) {
        progressBarColor = 'bg-gradient-to-r from-rose-500 to-red-600 animate-pulse'
        progressBgGlow = 'shadow-red-500/40 shadow-[0_0_12px_rgba(239,68,68,0.4)]'
        progressWarningText = `¡Alerta de Presupuesto! Has gastado el ${percentSpent.toFixed(0)}% de tu sueldo (Exceso de $${formatCLP(totalExpenses - numericSalary)})`
    } else if (percentSpent >= 70) {
        progressBarColor = 'bg-gradient-to-r from-amber-500 to-orange-400'
        progressBgGlow = 'shadow-amber-500/30'
        progressWarningText = `¡Advertencia de Gasto! Has consumido el ${percentSpent.toFixed(0)}% de tu sueldo disponible`
    }

    const handleSetLimitClick = async (catId, catName) => {
        const currentLimit = categoryLimits[catId] || 0
        const result = await Swal.fire({
            title: `Límite para ${catName}`,
            text: 'Establece un presupuesto máximo mensual para esta categoría (deja vacío para eliminarlo):',
            input: 'text',
            inputValue: currentLimit > 0 ? formatCLP(currentLimit) : '',
            showCancelButton: true,
            confirmButtonColor: s.swal.confirmButtonColor,
            cancelButtonColor: '#475569',
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            background: s.swal.background,
            color: s.swal.color,
            inputPlaceholder: 'Ej: 150.000',
            inputValidator: (value) => {
                if (value && parseCLP(value) <= 0) {
                    return 'Por favor ingresa un monto válido mayor a cero.'
                }
            }
        })

        if (result.isConfirmed) {
            const numericLimit = result.value ? parseCLP(result.value) : 0
            handleSetCategoryLimit(catId, numericLimit)

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: numericLimit > 0 ? `Límite de "${catName}" guardado` : `Límite de "${catName}" eliminado`,
                showConfirmButton: false,
                timer: 2500,
                timerProgressBar: true,
                background: s.swal.background,
                color: s.swal.color,
                iconColor: '#10b981'
            })
        }
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
            <h2 className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${textGradientClass} mb-6 flex items-center gap-3 transition-colors duration-500`}>
                <FontAwesomeIcon icon={faChartPie} className={auraStyles.icon} /> Resumen del Mes
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="group">
                    <label className={`${labelClass} mb-2`}>
                        <FontAwesomeIcon icon={faCalendarAlt} /> Mes a Gestionar:
                    </label>
                    <DatePicker
                        selected={currentMonthDate}
                        onChange={(date) => setCurrentMonthDate(date)}
                        dateFormat="MMMM yyyy"
                        showMonthYearPicker
                        locale={es}
                        calendarClassName={`aura-datepicker-${activeColor}`}
                        wrapperClassName="w-full"
                        className={`block w-full px-5 py-4 ${s.input} ${focusRingClass} rounded-2xl font-extrabold capitalize transition-all cursor-pointer shadow-inner text-center sm:text-left ${activeTheme ? activeTheme.accentGlowText : (isDark ? 'text-indigo-400' : 'text-indigo-600')}`}
                    />
                </div>
                <div className="group">
                    <label htmlFor="salaryInput" className={`${labelClass} mb-2`}>
                        <FontAwesomeIcon icon={faMoneyBillWave} /> Sueldo del Mes:
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <span className={`${auraStyles.icon} font-extrabold text-lg transition-colors`}>$</span>
                        </div>
                        <input
                            type="text"
                            id="salaryInput"
                            value={displaySalary}
                            onChange={handleSalaryChange}
                            placeholder="0"
                            className={`block w-full pl-10 pr-5 py-4 ${s.input} ${focusRingClass} rounded-2xl font-bold text-lg transition-all shadow-inner`}
                        />
                    </div>
                    {errors.salary && <p className="mt-2 text-sm text-rose-400 font-bold animate-pulse">{errors.salary}</p>}
                </div>
            </div>

            <div className={`grid grid-cols-1 sm:grid-cols-2 gap-4 border-t ${isDark ? 'border-slate-700/50' : 'border-slate-200'} pt-8`}>
                <div className={`relative overflow-hidden ${isDark ? 'bg-gradient-to-br from-rose-900/80 to-pink-900/80 border-rose-800/50' : 'bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200/60 shadow-inner'} border rounded-3xl p-6 text-center transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group`}>
                    <div className="absolute inset-0 bg-white/5 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                    <p className={`flex items-center justify-center gap-2 text-xs font-black ${isDark ? 'text-rose-300' : 'text-rose-600'} uppercase tracking-widest mb-2`}>
                        <FontAwesomeIcon icon={faChartPie} /> Total Gastado
                    </p>
                    <p className={`text-3xl font-extrabold ${isDark ? 'text-white' : 'text-rose-700'} drop-shadow-sm`}>${formatCLP(totalExpenses)}</p>
                </div>
                <div className={`relative overflow-hidden rounded-3xl p-6 text-center transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group ${remainingSalary < 0
                    ? (isDark ? 'bg-gradient-to-br from-red-900/80 to-rose-900/80 border border-red-800/50 hover:shadow-red-900/20' : 'bg-gradient-to-br from-red-50 to-rose-50 border border-red-200/60 shadow-inner')
                    : (isDark ? 'bg-gradient-to-br from-emerald-900/80 to-teal-900/80 border border-emerald-800/50 hover:shadow-emerald-900/20' : 'bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/60 shadow-inner')
                    }`}>
                    <div className="absolute inset-0 bg-white/5 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                    <p className={`flex items-center justify-center gap-2 text-xs font-black ${isDark ? 'text-slate-300' : 'text-slate-600'} uppercase tracking-widest mb-2`}>
                        <FontAwesomeIcon icon={faPiggyBank} /> Saldo Disponible
                    </p>
                    <p className={`text-3xl font-extrabold ${remainingSalary < 0 ? (isDark ? 'text-white' : 'text-rose-700') : (isDark ? 'text-white' : 'text-emerald-700')} drop-shadow-sm`}>
                        ${formatCLP(remainingSalary)}
                    </p>
                </div>
            </div>

            {numericSalary > 0 && (
                <div className={`mt-8 border-t ${isDark ? 'border-slate-700/50' : 'border-slate-200'} pt-8 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                    <div className="flex justify-between items-center mb-2">
                        <span className={`text-xs font-black ${s.bodyTextMuted} uppercase tracking-wider`}>Progreso de Presupuesto</span>
                        <span className={`text-sm font-extrabold ${percentSpent >= 100 ? 'text-rose-500' : percentSpent >= 70 ? 'text-amber-500' : 'text-emerald-500'}`}>
                            {percentSpent.toFixed(0)}% Gastado
                        </span>
                    </div>

                    <div className={`w-full h-4 ${s.progressTrack} rounded-full overflow-hidden p-0.5 shadow-inner`}>
                        <div
                            style={{ width: `${Math.min(percentSpent, 100)}%` }}
                            className={`h-full rounded-full transition-all duration-500 shadow-[0_0_12px_var(--tw-shadow-color)] ${progressBarColor} ${progressBgGlow}`}
                        ></div>
                    </div>

                    {progressWarningText && (
                        <p className={`mt-3 text-xs font-bold text-center p-3 rounded-xl border border-dashed animate-pulse ${percentSpent >= 100
                            ? (isDark ? 'bg-rose-500/10 border-rose-500/20 text-rose-400' : 'bg-rose-50 border-rose-100 text-rose-700')
                            : (isDark ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-amber-50 border-amber-100 text-amber-700')
                            }`}>
                            {progressWarningText}
                        </p>
                    )}
                </div>
            )}

            {currentMonthExpenses.length > 0 && (
                <div className={`mt-8 border-t ${isDark ? 'border-slate-700/50' : 'border-slate-200'} pt-8 animate-in fade-in slide-in-from-bottom-2 duration-500`}>
                    <h4 className={`text-sm font-black ${s.bodyTextMuted} uppercase tracking-wider mb-4`}>Desglose por Categoría</h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {categoriesWithGradients.map(cat => {
                            const total = categoryTotals[cat.id] || 0
                            if (total === 0) return null

                            const limit = categoryLimits[cat.id] || 0
                            const catPercentOfTotal = totalExpenses > 0 ? (total / totalExpenses) * 100 : 0
                            const catPercent = limit > 0 ? (total / limit) * 100 : catPercentOfTotal
                            const isExceeded = limit > 0 && catPercent >= 100

                            return (
                                <div key={cat.id} className={`${s.itemBg} p-4 rounded-2xl flex flex-col justify-between hover:border-indigo-500/20 transition-all duration-300`}>
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="flex items-center gap-2">
                                            <span className="text-lg">{cat.emoji}</span>
                                            <span className={`text-sm font-extrabold ${s.bodyText}`}>{cat.name}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            {limit > 0 && (
                                                <span className={`text-[9px] font-black px-2 py-0.5 rounded-md border ${isExceeded
                                                    ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 animate-pulse'
                                                    : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                                                    }`}>
                                                    {isExceeded ? 'EXCEDIDO' : 'ACTIVO'}
                                                </span>
                                            )}
                                            <span className={`text-xs font-bold px-2 py-0.5 rounded-lg select-none border ${auraStyles.badge}`}>
                                                {limit > 0 ? `${catPercent.toFixed(0)}%` : `${catPercentOfTotal.toFixed(0)}%`}
                                            </span>
                                            <button
                                                type="button"
                                                onClick={() => handleSetLimitClick(cat.id, cat.name)}
                                                className={`${isDark ? 'text-slate-500' : 'text-slate-400'} ${auraStyles.hoverBorder} p-1 transition-all cursor-pointer select-none border border-transparent rounded-md`}
                                                title="Definir límite de presupuesto"
                                            >
                                                <FontAwesomeIcon icon={faCog} className="text-xs" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="flex items-end justify-between gap-4 mt-2">
                                        <div className="flex-1 mb-1">
                                            <div className={`w-full h-2 ${s.progressTrack} rounded-full overflow-hidden p-0.5 shadow-inner`}>
                                                <div
                                                    style={{ width: `${Math.min(catPercent, 100)}%` }}
                                                    className={`h-full rounded-full transition-all duration-300 ${isExceeded
                                                        ? 'bg-gradient-to-r from-rose-500 to-red-600 animate-pulse'
                                                        : `bg-gradient-to-r ${cat.color}`
                                                        }`}
                                                ></div>
                                            </div>
                                        </div>
                                        <div className="text-right flex flex-col">
                                            <span className="text-sm font-black text-rose-500">-${formatCLP(total)}</span>
                                            {limit > 0 && (
                                                <span className={`text-[9px] font-bold ${s.bodyTextMuted} mt-0.5`}>
                                                    Límite: ${formatCLP(limit)}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default MonthSummary