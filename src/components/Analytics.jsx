import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { formatCLP } from '../utils/currency'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartBar, faArrowUp, faCalendarAlt, faCrown, faLightbulb } from '@fortawesome/free-solid-svg-icons'
import SectionHeader from './SectionHeader'
import { useAnalytics } from '../hooks/useAnalytics'
import { useThemeStyles } from '../hooks/useThemeStyles'
import EmptyState from './EmptyState'
import CategoryBadge from './CategoryBadge'
import TopExpenseItem from './TopExpenseItem'
import CustomSelect from './CustomSelect'
import BarChart from './BarChart'
import StatCard from './StatCard'
import AdvisorCard from './AdvisorCard'

function Analytics({ expenses = [], categories = [], themeMode = 'dark', activeTheme }) {
    const { s, isDark, textGradientClass, aura } = useThemeStyles(themeMode, activeTheme)

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

    const {
        availableYears,
        monthlyData,
        maxMonthlySpend,
        totalSpentInYear,
        averageSpending,
        peakMonth,
        topExpenses,
        categoryStyles,
        momTrendCard,
        paretoAdvice
    } = useAnalytics(expenses, categories, selectedYear, s)

    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <SectionHeader
                    title="Reporte Anual"
                    icon={faChartBar}
                    gradientClass={textGradientClass}
                    iconClass={aura.icon}
                    className="!mb-0"
                />
                <div className="w-full sm:w-auto flex items-center gap-3">
                    <label className={`text-xs font-bold ${s.bodyTextMuted} uppercase tracking-wider`}>Año a analizar:</label>
                    <CustomSelect
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        options={availableYears.map(y => ({ value: y, label: y }))}
                        isDark={isDark}
                        className="!bg-transparent !border-none !p-0 font-black text-lg text-slate-500"
                    />
                </div>
            </div>

            <div>
                {totalSpentInYear === 0 ? (
                    <EmptyState
                        icon={faChartBar}
                        message={`No hay gastos registrados en ${selectedYear}.`}
                        isDark={isDark}
                    />
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className={`lg:col-span-2 ${s.itemBg} p-6 rounded-3xl flex flex-col justify-between min-h-[350px]`}>
                            <div>
                                <h3 className={`text-sm font-black ${s.bodyTextMuted} uppercase tracking-widest mb-6`}>Evolución de Gastos {selectedYear}</h3>
                            </div>

                            <BarChart data={monthlyData} maxSpend={maxMonthlySpend} isDark={isDark} s={s} aura={aura} />
                        </div>
                        <div className="flex flex-col gap-4">
                            <StatCard
                                title="Promedio Mensual"
                                value={`$${formatCLP(averageSpending)}`}
                                icon="$"
                                aura={aura}
                                s={s}
                            />
                            {peakMonth && (
                                <StatCard
                                    title="Mes Mayor Consumo"
                                    value={peakMonth.monthName}
                                    subtitle={`$${formatCLP(peakMonth.total)}`}
                                    icon={<FontAwesomeIcon icon={faArrowUp} className="animate-bounce" />}
                                    aura={aura}
                                    s={s}
                                />
                            )}
                            <StatCard
                                title={`Total Año ${selectedYear}`}
                                value={`$${formatCLP(totalSpentInYear)}`}
                                icon={<FontAwesomeIcon icon={faCalendarAlt} />}
                                aura={aura}
                                s={s}
                            />
                        </div>
                    </div>
                )}
            </div>
            {expenses.length > 0 && (
                <div className={`${s.itemBg} p-6 sm:p-8 rounded-3xl mb-10 space-y-6`}>
                    <SectionHeader
                        as="h3"
                        title="Asistente Financiero Predictivo"
                        icon={faLightbulb}
                        gradientClass={aura.gradientText}
                        iconClass={`${aura.icon} animate-pulse`}
                    />
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <AdvisorCard
                            title={momTrendCard.title}
                            text={momTrendCard.text}
                            icon={momTrendCard.icon}
                            colorClass={momTrendCard.colorClass}
                            isDark={isDark}
                            s={s}
                        />
                        <AdvisorCard
                            title="Foco de Ahorro Recomendado"
                            text={paretoAdvice}
                            icon={faLightbulb}
                            iconColorClass="text-yellow-400"
                            colorClass={s.advisorPareto}
                            isDark={isDark}
                            s={s}
                        />
                    </div>
                </div>
            )}

            {expenses.length > 0 && (
                <div className={`${s.itemBg} p-6 sm:p-8 rounded-3xl`}>
                    <SectionHeader
                        as="h3"
                        title={`Compras Mayores (Top 5 de ${selectedYear})`}
                        icon={faCrown}
                        gradientClass={aura.gradientText}
                        iconClass={aura.icon}
                    />

                    <div className="space-y-3">
                        {topExpenses.map((expense, idx) => (
                            <TopExpenseItem
                                key={expense.id}
                                expense={expense}
                                idx={idx}
                                categoryStyle={categoryStyles[expense.category] || categoryStyles['otros']}
                                s={s}
                                aura={aura}
                                isDark={isDark}
                            />
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Analytics
