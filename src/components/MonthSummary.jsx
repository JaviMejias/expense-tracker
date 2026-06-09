import { formatCLP, parseCLP } from '../utils/currency'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faMoneyBillWave, faChartPie, faPiggyBank, faCog, faHandshake } from '@fortawesome/free-solid-svg-icons'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import CustomDatePicker from './CustomDatePicker'
import CustomInput from './CustomInput'
import { useThemeStyles } from '../hooks/useThemeStyles'
import { colorThemes, appThemes } from '../utils/theme'
import { useAppAlert } from '../hooks/useAppAlert'
import ProgressBar from './ProgressBar'
import BudgetCategoryItem from './BudgetCategoryItem'
import SummaryCard from './SummaryCard'

import { useDataStore } from '../store/useDataStore'
import { useUIStore } from '../store/useUIStore'
import { useThemeStore } from '../store/useThemeStore'
import { useDerivedData } from '../hooks/useDerivedData'
import { format } from 'date-fns'
import { useMonthTransition } from '../hooks/useMonthTransition'
import OnboardingScreen from './OnboardingScreen'
import { useDataStore as useDataStoreAll } from '../store/useDataStore'

function MonthSummary() {
    const { categoryLimits, handleSetCategoryLimit, categories, handleSalaryChange: storeHandleSalaryChange, expenses: allExpenses } = useDataStore()
    const { currentMonthDate, setCurrentMonthDate, errors, setErrors } = useUIStore()
    const { themeMode, currentTheme } = useThemeStore()
    const activeTheme = appThemes[currentTheme] || appThemes.classic
    
    const { currentMonthKey, currentSalary, currentMonthExpenses, totalExpenses, remainingSalary, displaySalary, previousBalance, totalAvailable, totalPendingReimbursements } = useDerivedData()

    const { s, isDark, activeColor, textGradientClass, focusRingClass, aura } = useThemeStyles(themeMode, activeTheme)
    const { showToast, showPrompt } = useAppAlert(themeMode)
    const { handleMonthTransition } = useMonthTransition()

    const handleSalaryChange = (e) => {
        const formattedValue = formatCLP(e.target.value)
        const numericValue = parseCLP(formattedValue)

        storeHandleSalaryChange(currentMonthKey, numericValue)

        if (numericValue <= 0 && formattedValue !== '') {
            setErrors(prev => ({ ...prev, salary: 'Por favor, ingresa un sueldo válido mayor a cero.' }))
        } else {
            setErrors(prev => ({ ...prev, salary: null }))
        }
    }

    const handleMonthChange = async (newDate) => {
        const isMovingForward = newDate > currentMonthDate
        if (isMovingForward) {
            const prevMonthKey = format(currentMonthDate, 'MM-yyyy')
            const newMonthKey = format(newDate, 'MM-yyyy')
            setCurrentMonthDate(newDate)
            await handleMonthTransition(prevMonthKey, newMonthKey)
        } else {
            setCurrentMonthDate(newDate)
        }
    }

    const numericSalary = totalAvailable
    const percentSpent = numericSalary > 0 ? (totalExpenses / numericSalary) * 100 : 0

    const categoriesWithGradients = categories.map(cat => ({
        id: cat.id,
        name: cat.name,
        emoji: cat.emoji,
        color: colorThemes[cat.color]?.gradient || colorThemes.slate.gradient,
        hexColor: colorThemes[cat.color]?.hex || '#64748b'
    }))

    const categoryTotals = currentMonthExpenses.reduce((acc, curr) => {
        const cat = curr.category || 'otros'
        acc[cat] = (acc[cat] || 0) + curr.amount
        return acc
    }, {})

    // Donut chart data
    const pieData = categoriesWithGradients
        .map(cat => ({ name: `${cat.emoji} ${cat.name}`, value: categoryTotals[cat.id] || 0, hexColor: cat.hexColor }))
        .filter(d => d.value > 0)

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
        const result = await showPrompt({
            title: `Límite para ${catName}`,
            text: 'Establece un presupuesto máximo mensual para esta categoría (deja vacío para eliminarlo):',
            input: 'text',
            inputValue: currentLimit > 0 ? formatCLP(currentLimit) : '',
            showCancelButton: true,
            confirmButtonText: 'Guardar',
            cancelButtonText: 'Cancelar',
            inputPlaceholder: 'Ej: 150.000',
            isAmountPrompt: true,
            inputValidator: (value) => {
                if (value && parseCLP(value) <= 0) {
                    return 'Por favor ingresa un monto válido mayor a cero.'
                }
            }
        })

        if (result.isConfirmed) {
            const numericLimit = result.value ? parseCLP(result.value) : 0
            handleSetCategoryLimit(catId, numericLimit)

            showToast(numericLimit > 0 ? `Límite de "${catName}" guardado` : `Límite de "${catName}" eliminado`, 'success', 2500)
        }
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
            <h2 className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${textGradientClass} mb-6 flex items-center gap-3 transition-colors duration-500`}>
                <FontAwesomeIcon icon={faChartPie} className={aura.icon} /> Resumen del Mes
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="group">
                    <label className={`flex items-center gap-2 text-sm font-bold ${aura.label} transition-colors mb-2`}>
                        <FontAwesomeIcon icon={faCalendarAlt} /> Mes a Gestionar:
                    </label>
                    <CustomDatePicker
                        selected={currentMonthDate}
                        onChange={handleMonthChange}
                        type="month"
                        activeColor={activeColor}
                        activeTheme={activeTheme}
                        isDark={isDark}
                        s={s}
                        focusRingClass={focusRingClass}
                        className="px-5 py-4 rounded-2xl font-extrabold capitalize"
                    />
                </div>
                <div className="group">
                    <label htmlFor="salaryInput" className={`flex items-center gap-2 text-sm font-bold ${aura.label} transition-colors mb-2`}>
                        <FontAwesomeIcon icon={faMoneyBillWave} /> Sueldo del Mes:
                    </label>
                    <CustomInput
                        id="salaryInput"
                        value={displaySalary}
                        onChange={handleSalaryChange}
                        isAmount={true}
                        iconClass={aura.icon}
                        s={s}
                        focusRingClass={focusRingClass}
                        placeholder="0"
                        className="py-4 rounded-2xl font-bold text-lg"
                    />
                    {errors.salary && <p className="mt-2 text-sm text-rose-400 font-bold animate-pulse">{errors.salary}</p>}
                </div>
            </div>

            {allExpenses.length === 0 ? (
                <div className={`border-t pt-8 mt-4 ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
                    <OnboardingScreen isDark={isDark} s={s} aura={aura} activeTheme={activeTheme} />
                </div>
            ) : (
                <>
                    <div className={`border-t ${isDark ? 'border-slate-700/50' : 'border-slate-200'} pt-8 mb-6`}>
                        <div className={`flex flex-wrap items-center justify-between px-4 sm:px-8 py-4 rounded-2xl bg-gradient-to-r ${isDark ? 'from-slate-800/40 to-slate-800/10' : 'from-slate-100 to-white'} border ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
                            <div className="text-center">
                                <p className={`text-[10px] sm:text-xs uppercase font-black tracking-wider ${s.bodyTextMuted} mb-1`}>Saldo Anterior</p>
                                <p className={`text-sm sm:text-lg font-bold ${previousBalance >= 0 ? (isDark ? 'text-emerald-400' : 'text-emerald-600') : (isDark ? 'text-rose-400' : 'text-rose-600')}`}>
                                    {previousBalance < 0 ? '-' : ''}${formatCLP(Math.abs(previousBalance))}
                                </p>
                            </div>
                            <div className={`text-xl font-black ${s.bodyTextMuted}`}>+</div>
                            <div className="text-center">
                                <p className={`text-[10px] sm:text-xs uppercase font-black tracking-wider ${s.bodyTextMuted} mb-1`}>Sueldo del Mes</p>
                                <p className={`text-sm sm:text-lg font-bold ${isDark ? 'text-emerald-400' : 'text-emerald-600'}`}>${formatCLP(currentSalary)}</p>
                            </div>
                            <div className={`text-xl font-black ${s.bodyTextMuted}`}>=</div>
                            <div className="text-center">
                                <p className={`text-[10px] sm:text-xs uppercase font-black tracking-wider ${s.bodyTextMuted} mb-1`}>Presupuesto Base</p>
                                <p className={`text-base sm:text-xl font-black ${totalAvailable >= 0 ? (isDark ? 'text-emerald-400' : 'text-emerald-600') : (isDark ? 'text-rose-400' : 'text-rose-600')}`}>
                                    {totalAvailable < 0 ? '-' : ''}${formatCLP(Math.abs(totalAvailable))}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <SummaryCard
                            title="Total Gastado"
                            value={`$${formatCLP(totalExpenses)}`}
                            icon={faChartPie}
                            isDark={isDark}
                            className={isDark ? 'bg-gradient-to-br from-rose-900/80 to-pink-900/80 border-rose-800/50' : 'bg-gradient-to-br from-rose-50 to-pink-50 border-rose-200/60 shadow-inner'}
                            titleClass={isDark ? 'text-rose-300' : 'text-rose-600'}
                            valueClass={isDark ? 'text-white' : 'text-rose-700'}
                        />
                        <SummaryCard
                            title="Saldo Disponible"
                            value={`$${formatCLP(remainingSalary)}`}
                            icon={faPiggyBank}
                            isDark={isDark}
                            className={remainingSalary < 0
                                ? (isDark ? 'bg-gradient-to-br from-red-900/80 to-rose-900/80 border border-red-800/50 hover:shadow-red-900/20' : 'bg-gradient-to-br from-red-50 to-rose-50 border border-red-200/60 shadow-inner')
                                : (isDark ? 'bg-gradient-to-br from-emerald-900/80 to-teal-900/80 border border-emerald-800/50 hover:shadow-emerald-900/20' : 'bg-gradient-to-br from-emerald-50 to-teal-50 border border-emerald-200/60 shadow-inner')
                            }
                            valueClass={remainingSalary < 0 ? (isDark ? 'text-white' : 'text-rose-700') : (isDark ? 'text-white' : 'text-emerald-700')}
                        />
                    </div>

                    {totalPendingReimbursements > 0 && (
                        <div className={`mt-4 flex items-center justify-between px-5 py-3 rounded-xl border animate-in fade-in slide-in-from-bottom-2 duration-300 ${isDark ? 'bg-indigo-500/10 border-indigo-500/20' : 'bg-indigo-50 border-indigo-200'}`}>
                            <div className="flex items-center gap-3">
                                <FontAwesomeIcon icon={faHandshake} className={`text-lg ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`} />
                                <p className={`text-sm font-bold ${isDark ? 'text-indigo-300' : 'text-indigo-800'}`}>
                                    Tienes dinero pendiente por cobrar de préstamos.
                                </p>
                            </div>
                            <p className={`text-lg font-black ${isDark ? 'text-indigo-400' : 'text-indigo-600'}`}>
                                +${formatCLP(totalPendingReimbursements)}
                            </p>
                        </div>
                    )}

                    {numericSalary > 0 && (
                        <div className={`mt-8 border-t ${isDark ? 'border-slate-700/50' : 'border-slate-200'} pt-8 animate-in fade-in slide-in-from-bottom-2 duration-300`}>
                            <div className="flex justify-between items-center mb-2">
                                <span className={`text-xs font-black ${s.bodyTextMuted} uppercase tracking-wider`}>Progreso de Presupuesto</span>
                                <span className={`text-sm font-extrabold ${percentSpent >= 100 ? 'text-rose-500' : percentSpent >= 70 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                    {percentSpent.toFixed(0)}% Gastado
                                </span>
                            </div>

                            <ProgressBar
                                percent={percentSpent}
                                colorClass={progressBarColor}
                                trackClass={s.progressTrack}
                                glowClass={progressBgGlow}
                            />

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
                            <h4 className={`text-sm font-black ${s.bodyTextMuted} uppercase tracking-wider mb-6`}>Desglose por Categoría</h4>
                            
                            {/* Donut Chart */}
                            {pieData.length > 0 && (
                                <div className="mb-6">
                                    <ResponsiveContainer width="100%" height={220}>
                                        <PieChart>
                                            <Pie
                                                data={pieData}
                                                cx="50%"
                                                cy="50%"
                                                innerRadius={60}
                                                outerRadius={90}
                                                paddingAngle={3}
                                                dataKey="value"
                                                animationBegin={0}
                                                animationDuration={1000}
                                            >
                                                {pieData.map((entry, index) => (
                                                    <Cell key={`cell-${index}`} fill={entry.hexColor} opacity={0.85} />
                                                ))}
                                            </Pie>
                                            <Tooltip
                                                formatter={(value) => [`$${formatCLP(value)}`, 'Total']}
                                                contentStyle={{
                                                    background: isDark ? '#0f172a' : '#fff',
                                                    border: `1px solid ${isDark ? '#334155' : '#e2e8f0'}`,
                                                    borderRadius: '12px',
                                                    fontSize: '12px',
                                                    fontWeight: 700
                                                }}
                                            />
                                            <Legend
                                                iconType="circle"
                                                iconSize={8}
                                                formatter={(value) => <span style={{ fontSize: '11px', fontWeight: 700, color: isDark ? '#cbd5e1' : '#475569' }}>{value}</span>}
                                            />
                                        </PieChart>
                                    </ResponsiveContainer>
                                </div>
                            )}

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                {categoriesWithGradients.map(cat => {
                                    const total = categoryTotals[cat.id] || 0
                                    if (total === 0) return null

                                    const limit = categoryLimits[cat.id] || 0
                                    const catPercentOfTotal = totalExpenses > 0 ? (total / totalExpenses) * 100 : 0
                                    const catPercent = limit > 0 ? (total / limit) * 100 : catPercentOfTotal
                                    const isExceeded = limit > 0 && catPercent >= 100

                                    return (
                                        <BudgetCategoryItem
                                            key={cat.id}
                                            cat={cat}
                                            total={total}
                                            limit={limit}
                                            catPercent={catPercent}
                                            catPercentOfTotal={catPercentOfTotal}
                                            isExceeded={isExceeded}
                                            s={s}
                                            aura={aura}
                                            isDark={isDark}
                                            onSetLimit={handleSetLimitClick}
                                        />
                                    )
                                })}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    )
}

export default MonthSummary