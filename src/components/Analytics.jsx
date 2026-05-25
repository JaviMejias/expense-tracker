import { useMemo, useState } from 'react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { formatCLP } from '../utils/currency'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChartBar, faArrowUp, faCalendarAlt, faCrown, faLightbulb, faChartLine, faArrowDown } from '@fortawesome/free-solid-svg-icons'
import { colorThemes, getThemeClass } from '../utils/theme'

function Analytics({ expenses = [], categories = [], themeMode = 'dark', activeTheme }) {
    const s = getThemeClass(themeMode)
    const isDark = themeMode === 'dark'

    const textGradientClass = activeTheme ? (isDark ? activeTheme.textGradient : activeTheme.textGradientLight) : (isDark ? 'from-indigo-400 to-purple-400' : 'from-indigo-600 to-purple-600')
    const activeColor = activeTheme?.accentBgColor?.includes('rose') ? 'rose' : activeTheme?.accentBgColor?.includes('emerald') ? 'emerald' : 'indigo'

    const auraStyles = {
        rose: {
            icon: 'text-rose-400',
            bgGlow: 'bg-rose-500/10 blur-[50px]',
            boxBg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
            label: 'text-rose-400',
            gradient: isDark ? 'from-rose-950/40 to-slate-900/60 border-rose-500/20 hover:border-rose-500/35' : 'from-rose-50/50 via-white to-slate-100/60 border-rose-200 hover:border-rose-300',
            chartBar: 'from-rose-600 via-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 shadow-[0_0_15px_rgba(244,63,94,0.2)] hover:shadow-[0_0_20px_rgba(244,63,94,0.4)]',
            gradientText: 'from-rose-400 to-pink-400',
            cardHover: 'hover:border-rose-500/20',
            badge: 'bg-rose-500/10 border-rose-500/20 text-rose-400'
        },
        emerald: {
            icon: 'text-emerald-400',
            bgGlow: 'bg-emerald-500/10 blur-[50px]',
            boxBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
            label: 'text-emerald-400',
            gradient: isDark ? 'from-emerald-950/40 to-slate-900/60 border-emerald-500/20 hover:border-emerald-500/35' : 'from-emerald-50/50 via-white to-slate-100/60 border-emerald-200 hover:border-emerald-300',
            chartBar: 'from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]',
            gradientText: 'from-emerald-400 to-teal-400',
            cardHover: 'hover:border-emerald-500/20',
            badge: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
        },
        indigo: {
            icon: 'text-indigo-400',
            bgGlow: 'bg-indigo-500/10 blur-[50px]',
            boxBg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
            label: 'text-indigo-400',
            gradient: isDark ? 'from-indigo-950/40 to-slate-900/60 border-indigo-500/20 hover:border-indigo-500/35' : 'from-indigo-50/50 via-white to-slate-100/60 border-indigo-200 hover:border-indigo-300',
            chartBar: 'from-indigo-600 via-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-pink-500 shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[0_0_20px_rgba(244,63,94,0.4)]',
            gradientText: 'from-indigo-400 to-purple-400',
            cardHover: 'hover:border-indigo-500/20',
            badge: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
        }
    }[activeColor]

    const availableYears = useMemo(() => {
        const years = new Set(expenses.map(e => parseISO(e.date).getFullYear()))
        years.add(new Date().getFullYear())
        return Array.from(years).sort((a, b) => b - a)
    }, [expenses])

    const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

    const monthlyData = useMemo(() => {
        const data = Array.from({ length: 12 }, (_, i) => {
            const date = new Date(selectedYear, i, 1)
            return {
                key: format(date, 'yyyy-MM'),
                name: format(date, 'MMM', { locale: es }),
                fullName: format(date, 'MMMM yyyy', { locale: es }),
                total: 0
            }
        })
        expenses.forEach(exp => {
            const date = parseISO(exp.date)
            if (date.getFullYear() === selectedYear) {
                data[date.getMonth()].total += exp.amount
            }
        })
        return data
    }, [expenses, selectedYear])

    const maxMonthlySpend = useMemo(() => {
        return Math.max(...monthlyData.map(m => m.total), 1)
    }, [monthlyData])

    const totalSpentInYear = useMemo(() => monthlyData.reduce((acc, curr) => acc + curr.total, 0), [monthlyData])
    const activeMonthsCount = useMemo(() => monthlyData.filter(m => m.total > 0).length || 1, [monthlyData])
    const averageSpending = totalSpentInYear / activeMonthsCount
    const peakMonth = useMemo(() => [...monthlyData].filter(m => m.total > 0).sort((a, b) => b.total - a.total)[0], [monthlyData])

    const topExpenses = useMemo(() => {
        return [...expenses]
            .filter(e => parseISO(e.date).getFullYear() === selectedYear)
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5)
    }, [expenses, selectedYear])

    const categoryStyles = useMemo(() => {
        return categories.reduce((acc, cat) => {
            acc[cat.id] = {
                label: cat.name,
                emoji: cat.emoji,
                bgClass: cat.colorClass || colorThemes[cat.color]?.bgClass || colorThemes.slate.bgClass
            }
            return acc
        }, {})
    }, [categories])

    const momTrendCard = useMemo(() => {
        const activeMonths = monthlyData.filter(m => m.total > 0)
        if (activeMonths.length >= 2) {
            const prevMonth = activeMonths[activeMonths.length - 2]
            const currMonth = activeMonths[activeMonths.length - 1]
            const diff = currMonth.total - prevMonth.total
            const percentChange = prevMonth.total > 0 ? (diff / prevMonth.total) * 100 : 0

            if (percentChange > 5) {
                return {
                    type: 'warning',
                    icon: faArrowUp,
                    title: `Tus gastos aumentaron un ${percentChange.toFixed(0)}%`,
                    text: `Registraste $${formatCLP(diff)} más en egresos este mes comparado con el anterior. Te sugerimos revisar tus plantillas fijas y posponer consumos secundarios.`,
                    colorClass: s.advisorWarning
                }
            } else if (percentChange < -5) {
                return {
                    type: 'success',
                    icon: faArrowDown,
                    title: `Tus gastos disminuyeron un ${Math.abs(percentChange).toFixed(0)}%`,
                    text: `¡Excelente trabajo! Gastaste $${formatCLP(Math.abs(diff))} menos que el mes pasado. Tu disciplina de ahorro está rindiendo frutos.`,
                    colorClass: s.advisorSuccess
                }
            } else {
                return {
                    type: 'stable',
                    icon: faChartLine,
                    title: 'Tus gastos se mantienen estables',
                    text: `Has mantenido un nivel de consumo muy constante (variación del ${percentChange.toFixed(0)}%). ¡Felicitaciones por esta consistencia!`,
                    colorClass: s.advisorStable
                }
            }
        } else {
            return {
                type: 'info',
                icon: faChartLine,
                title: 'Analizando tendencias...',
                text: 'Una vez que acumules historial de gastos en al menos 2 meses distintos, verás el análisis de variaciones en tiempo real aquí.',
                colorClass: s.advisorInfo
            }
        }
    }, [monthlyData, themeMode])

    const yearlyCatTotals = useMemo(() => {
        return expenses
            .filter(e => parseISO(e.date).getFullYear() === selectedYear)
            .reduce((acc, curr) => {
                const cat = curr.category || 'otros'
                acc[cat] = (acc[cat] || 0) + curr.amount
                return acc
            }, {})
    }, [expenses, selectedYear])

    const dominantCatId = useMemo(() => {
        return Object.keys(yearlyCatTotals).length > 0
            ? Object.keys(yearlyCatTotals).sort((a, b) => yearlyCatTotals[b] - yearlyCatTotals[a])[0]
            : null
    }, [yearlyCatTotals])

    const paretoAdvice = useMemo(() => {
        if (dominantCatId) {
            const catLabel = categoryStyles[dominantCatId]?.label || 'Gastos Varios'
            const catEmoji = categoryStyles[dominantCatId]?.emoji || '🏷️'

            switch (dominantCatId) {
                case 'comida':
                    return `Tu mayor egreso de este período se concentra en comida ${catEmoji}. Cocinar más en casa, planificar menús semanales o consolidar compras en supermercados mayoristas suele recortar hasta un 30% en este rubro.`
                case 'servicios':
                    return `La categoría de Servicios ${catEmoji} lidera tus consumos. Te recomendamos revisar tus suscripciones recurrentes de streaming o aplicaciones inactivas para cortar de inmediato fugas silenciosas de dinero.`
                case 'transporte':
                    return `El Transporte ${catEmoji} representa tu mayor flujo de salida. Si utilizas aplicaciones de viaje con frecuencia, consolidar tus traslados o evaluar días de caminata o transporte alternativo puede generar un gran alivio.`
                case 'entretencion':
                    return `La diversión y salidas ${catEmoji} han sido tu foco principal de gasto. Intenta fijar un límite rígido a principios de mes en esta categoría para evitar excederte sin darte cuenta.`
                case 'salud':
                    return `Lideran los gastos de Salud ${catEmoji}. Es una categoría esencial, pero te sugerimos preguntar siempre por alternativas genéricas bioequivalentes en tus compras de farmacia para optimizar costos.`
                default:
                    return `Los gastos diversos (${catLabel}) representan tu mayor desembolso. Intenta desglosar en descripciones detalladas el uso de estos fondos para identificar micro-gastos superfluos.`
            }
        }
        return "No registras consumos en este mes activo aún. Registra gastos diarios o aplica tus plantillas fijas para obtener consejos financieros interactivos personalizados."
    }, [dominantCatId, categoryStyles])


    return (
        <div className="space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <h2 className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${textGradientClass} flex items-center gap-2`}>
                    <FontAwesomeIcon icon={faChartBar} className={auraStyles.icon} /> Reporte Anual
                </h2>
                <div className="w-full sm:w-auto flex items-center gap-3">
                    <label className={`text-xs font-bold ${s.bodyTextMuted} uppercase tracking-wider`}>Año a analizar:</label>
                    <select
                        value={selectedYear}
                        onChange={(e) => setSelectedYear(Number(e.target.value))}
                        className={`bg-transparent font-black text-lg ${auraStyles.label} cursor-pointer focus:outline-none`}
                    >
                        {availableYears.map(year => (
                            <option key={year} value={year} className={isDark ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-800'}>{year}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div>
                {totalSpentInYear === 0 ? (
                    <div className={`text-center py-16 ${isDark ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-100/50 border-slate-200'} border border-dashed rounded-3xl`}>
                        <FontAwesomeIcon icon={faChartBar} className="text-5xl text-slate-500/50 mb-4 animate-pulse" />
                        <p className={`${s.bodyTextMuted} font-bold text-lg`}>No hay gastos registrados en {selectedYear}.</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        <div className={`lg:col-span-2 ${s.itemBg} p-6 rounded-3xl flex flex-col justify-between min-h-[350px]`}>
                            <div>
                                <h3 className={`text-sm font-black ${s.bodyTextMuted} uppercase tracking-widest mb-6`}>Evolución de Gastos {selectedYear}</h3>
                            </div>

                            {/* Gráfico Real con CSS Grid */}
                            <div className="relative h-64 mt-6 mb-2">
                                {/* Eje Y (Grid Lines) */}
                                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6">
                                    {[4, 3, 2, 1, 0].map((step, idx) => (
                                        <div key={idx} className="flex items-center w-full h-0">
                                            <span className={`text-[9px] sm:text-[10px] font-bold ${s.bodyTextMuted} w-10 sm:w-16 text-right pr-2 sm:pr-4 shrink-0 truncate`}>
                                                ${formatCLP(maxMonthlySpend * (step / 4))}
                                            </span>
                                            <div className={`flex-1 border-t ${isDark ? 'border-slate-700/50' : 'border-slate-200'} border-dashed`}></div>
                                        </div>
                                    ))}
                                </div>

                                {/* Barras y Eje X */}
                                <div className="absolute inset-0 left-10 sm:left-16 flex flex-col justify-end">
                                    <div className="flex-1 flex items-end justify-around pb-0 z-10 w-full">
                                        {monthlyData.map(month => {
                                            const heightPercent = maxMonthlySpend > 0 ? (month.total / maxMonthlySpend) * 100 : 0
                                            return (
                                                <div key={month.key} className="relative flex flex-col items-center group w-full h-full justify-end">
                                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-950/95 border border-indigo-500/30 px-3 py-2 rounded-xl absolute bottom-[calc(100%+8px)] text-center shadow-xl z-20 whitespace-nowrap pointer-events-none">
                                                        <p className="text-[10px] font-bold text-slate-400 capitalize">{month.fullName}</p>
                                                        <p className="text-xs font-black text-rose-400 mt-0.5">${formatCLP(month.total)}</p>
                                                    </div>
                                                    {month.total > 0 && (
                                                        <div
                                                            style={{ height: `${heightPercent}%`, minHeight: '4px' }}
                                                            className={`w-3 sm:w-6 lg:w-8 rounded-t-md transition-all duration-700 ease-out bg-gradient-to-t group-hover:opacity-80 ${auraStyles.chartBar}`}
                                                        ></div>
                                                    )}
                                                </div>
                                            )
                                        })}
                                    </div>
                                    {/* Eje X (Etiquetas de los Meses) */}
                                    <div className={`flex justify-around w-full border-t ${isDark ? 'border-slate-700/80' : 'border-slate-300'} pt-2 h-6`}>
                                        {monthlyData.map(month => (
                                            <span key={month.key} className={`text-[9px] sm:text-[10px] font-black ${s.bodyTextMuted} uppercase tracking-wide text-center w-full truncate`}>
                                                {month.name}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col gap-4">
                            <div className={`bg-gradient-to-br ${auraStyles.gradient} p-6 border rounded-3xl flex items-center gap-4 transition-all`}>
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold shadow-inner ${auraStyles.boxBg}`}>
                                    $
                                </div>
                                <div>
                                    <p className={`text-[10px] font-black ${auraStyles.label} uppercase tracking-wider`}>Promedio Mensual</p>
                                    <p className={`text-2xl font-extrabold ${s.bodyText} mt-1`}>${formatCLP(averageSpending)}</p>
                                </div>
                            </div>
                            {peakMonth && (
                                <div className={`bg-gradient-to-br ${auraStyles.gradient} p-6 border rounded-3xl flex items-center gap-4 transition-all`}>
                                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${auraStyles.boxBg}`}>
                                        <FontAwesomeIcon icon={faArrowUp} className="animate-bounce" />
                                    </div>
                                    <div>
                                        <p className={`text-[10px] font-black ${auraStyles.label} uppercase tracking-wider`}>Mes Mayor Consumo</p>
                                        <p className={`text-xl font-extrabold ${s.bodyText} mt-1 capitalize`}>{peakMonth.name}</p>
                                        <p className={`text-sm font-bold ${auraStyles.label} mt-0.5`}>${formatCLP(peakMonth.total)}</p>
                                    </div>
                                </div>
                            )}
                            <div className={`bg-gradient-to-br ${auraStyles.gradient} p-6 border rounded-3xl flex items-center gap-4 transition-all`}>
                                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-inner ${auraStyles.boxBg}`}>
                                    <FontAwesomeIcon icon={faCalendarAlt} />
                                </div>
                                <div>
                                    <p className={`text-[10px] font-black ${auraStyles.label} uppercase tracking-wider`}>Total Año {selectedYear}</p>
                                    <p className={`text-2xl font-extrabold ${s.bodyText} mt-1`}>${formatCLP(totalSpentInYear)}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </div>
            {expenses.length > 0 && (
                <div className={`${s.itemBg} p-6 sm:p-8 rounded-3xl mb-10 space-y-6`}>
                    <h3 className={`text-lg font-black text-transparent bg-clip-text bg-gradient-to-r ${auraStyles.gradientText} flex items-center gap-2 select-none`}>
                        <FontAwesomeIcon icon={faLightbulb} className={`${auraStyles.icon} animate-pulse`} /> Asistente Financiero Predictivo
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className={`p-5 rounded-2xl flex items-start gap-4 transition-all hover:scale-102 duration-300 ${momTrendCard.colorClass}`}>
                            <div className="w-10 h-10 rounded-xl bg-slate-900/50 flex items-center justify-center text-lg shrink-0 mt-1">
                                <FontAwesomeIcon icon={momTrendCard.icon} />
                            </div>
                            <div className="space-y-1">
                                <h4 className={`font-extrabold text-sm sm:text-base ${s.bodyText}`}>{momTrendCard.title}</h4>
                                <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'} leading-relaxed`}>{momTrendCard.text}</p>
                            </div>
                        </div>
                        <div className={`p-5 rounded-2xl flex items-start gap-4 transition-all hover:scale-102 duration-300 ${s.advisorPareto}`}>
                            <div className="w-10 h-10 rounded-xl bg-slate-900/50 flex items-center justify-center text-lg shrink-0 mt-1">
                                <FontAwesomeIcon icon={faLightbulb} className="text-yellow-400" />
                            </div>
                            <div className="space-y-1">
                                <h4 className={`font-extrabold text-sm sm:text-base ${s.bodyText}`}>Foco de Ahorro Recomendado</h4>
                                <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'} leading-relaxed`}>{paretoAdvice}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {expenses.length > 0 && (
                <div className={`${s.itemBg} p-6 sm:p-8 rounded-3xl`}>
                    <h3 className={`text-lg font-black text-transparent bg-clip-text bg-gradient-to-r ${auraStyles.gradientText} mb-6 flex items-center gap-2 select-none`}>
                        <FontAwesomeIcon icon={faCrown} className={auraStyles.icon} /> Compras Mayores (Top 5 de {selectedYear})
                    </h3>

                    <div className="space-y-3">
                        {topExpenses.map((expense, idx) => (
                            <div key={expense.id} className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm text-slate-800'} ${auraStyles.cardHover} border rounded-2xl transition-all duration-300 gap-3`}>
                                <div className="flex items-center gap-3">
                                    <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${auraStyles.badge}`}>
                                        {idx + 1}
                                    </span>
                                    <div>
                                        <div className="flex flex-wrap items-center gap-2">
                                            <p className={`font-extrabold ${s.bodyText}`}>{expense.description}</p>
                                            {(() => {
                                                const cat = categoryStyles[expense.category] || categoryStyles['otros']
                                                return (
                                                    <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border ${cat.bgClass} flex items-center gap-1`}>
                                                        <span>{cat.emoji}</span>
                                                        <span>{cat.label}</span>
                                                    </span>
                                                )
                                            })()}
                                        </div>
                                        <p className={`text-[10px] font-bold ${s.bodyTextMuted} mt-1 uppercase tracking-wide`}>
                                            {format(parseISO(expense.date), 'dd MMMM yyyy', { locale: es })}
                                        </p>
                                    </div>
                                </div>
                                <div className="text-right">
                                    <span className="text-base font-black text-rose-400 bg-rose-400/10 border border-rose-400/20 px-3 py-1 rounded-xl">
                                        -${formatCLP(expense.amount)}
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

export default Analytics
