import { useState } from 'react'
import { startOfMonth, endOfMonth, startOfWeek, endOfWeek, addDays, isSameMonth, isSameDay, format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faChevronLeft, faChevronRight, faListUl } from '@fortawesome/free-solid-svg-icons'
import { useUIStore } from '../store/useUIStore'
import { useDataStore } from '../store/useDataStore'
import { useThemeStore } from '../store/useThemeStore'
import { appThemes } from '../utils/theme'
import { useThemeStyles } from '../hooks/useThemeStyles'
import { formatCLP } from '../utils/currency'
import { useDerivedData } from '../hooks/useDerivedData'
import { useNavigate } from 'react-router-dom'
import { useCategoryStyles } from '../hooks/useCategoryStyles'
import { useMonthTransition } from '../hooks/useMonthTransition'

function CalendarView() {
    const { currentMonthDate, setCurrentMonthDate } = useUIStore()
    const { expenses, categories } = useDataStore()
    const { themeMode, currentTheme } = useThemeStore()
    const activeTheme = appThemes[currentTheme] || appThemes.classic
    const { s, isDark, textGradientClass, aura, activeColor } = useThemeStyles(themeMode, activeTheme)
    const { handleMonthTransition } = useMonthTransition()
    const navigate = useNavigate()
    const categoryStyles = useCategoryStyles(categories)

    const [selectedDate, setSelectedDate] = useState(null)

    const nextMonth = async () => {
        const next = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1)
        const prevMonthKey = format(currentMonthDate, 'MM-yyyy')
        const newMonthKey = format(next, 'MM-yyyy')
        setCurrentMonthDate(next)
        await handleMonthTransition(prevMonthKey, newMonthKey)
    }

    const prevMonth = async () => {
        const prev = new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1)
        const prevMonthKey = format(currentMonthDate, 'MM-yyyy')
        const newMonthKey = format(prev, 'MM-yyyy')
        setCurrentMonthDate(prev)
        await handleMonthTransition(prevMonthKey, newMonthKey)
    }

    // Generate Calendar Grid
    const monthStart = startOfMonth(currentMonthDate)
    const monthEnd = endOfMonth(monthStart)
    const startDate = startOfWeek(monthStart, { weekStartsOn: 1 })
    const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 })

    const dateFormat = "d"
    const rows = []
    let days = []
    let day = startDate
    let formattedDate = ""

    const handleDayClick = (day) => {
        setSelectedDate(day)
    }

    const expensesForSelected = selectedDate 
        ? expenses.filter(e => isSameDay(parseISO(e.date), selectedDate))
        : []

    while (day <= endDate) {
        for (let i = 0; i < 7; i++) {
            formattedDate = format(day, dateFormat)
            const cloneDay = day

            const dayExpenses = expenses.filter(e => isSameDay(parseISO(e.date), cloneDay))
            const dayTotal = dayExpenses.reduce((sum, e) => sum + e.amount, 0)
            
            // Get unique category dots
            const catDots = [...new Set(dayExpenses.map(e => e.category))].slice(0, 3)

            days.push(
                <div
                    key={day}
                    onClick={() => handleDayClick(cloneDay)}
                    className={`min-h-[60px] sm:min-h-[80px] p-1 sm:p-2 border transition-all cursor-pointer relative flex flex-col items-center sm:items-start ${
                        !isSameMonth(day, monthStart)
                            ? (isDark ? 'bg-slate-900/20 text-slate-600 border-slate-800/50' : 'bg-slate-50 text-slate-300 border-slate-100')
                            : (isSameDay(day, selectedDate)
                                ? `${aura.primaryGlow} ${aura.accentBorder} text-[var(--aura-color)]`
                                : isSameDay(day, new Date()) 
                                    ? `bg-[var(--aura-bg-hover)] border-[var(--aura-color)] text-[var(--aura-color)] font-bold` 
                                    : (isDark ? 'bg-slate-800/50 text-slate-300 border-slate-700/50 hover:bg-slate-700/50' : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'))
                    }`}
                >
                    <div className="flex justify-between items-start w-full">
                        <span className={`text-xs sm:text-sm mx-auto sm:mx-0 ${isSameDay(day, new Date()) ? 'font-black' : 'font-bold'}`}>{formattedDate}</span>
                    </div>
                    {dayTotal > 0 && (
                        <div className="mt-2 text-center">
                            <span className="text-[10px] sm:text-xs font-black text-rose-400">
                                -${formatCLP(dayTotal)}
                            </span>
                            <div className="flex justify-center gap-0.5 mt-1">
                                {catDots.map(cat => {
                                    const style = categoryStyles[cat] || categoryStyles['otros']
                                    return <span key={cat} className="text-[6px] sm:text-[8px]">{style.emoji}</span>
                                })}
                                {dayExpenses.length > 3 && <span className="text-[6px] sm:text-[8px] text-slate-400">+{dayExpenses.length - 3}</span>}
                            </div>
                        </div>
                    )}
                </div>
            )
            day = addDays(day, 1)
        }
        rows.push(
            <div className="grid grid-cols-7 min-w-full flex-shrink-0 snap-center" key={day}>
                {days}
            </div>
        )
        days = []
    }

    const weekDays = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom']

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 relative z-10">
            <h2 className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${textGradientClass} mb-6 flex items-center gap-3`}>
                <FontAwesomeIcon icon={faCalendarAlt} className={aura.icon} /> Calendario Mensual
            </h2>

            <div className="flex flex-col lg:flex-row gap-6">
                <div className="flex-1">
                    <div className={`p-4 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'} shadow-xl mb-6`}>
                        {/* Header */}
                        <div className="flex justify-between items-center mb-6 px-1 sm:px-2">
                            <button onClick={prevMonth} className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}>
                                <FontAwesomeIcon icon={faChevronLeft} />
                            </button>
                            <h3 className="text-base sm:text-xl font-black capitalize" style={{ color: 'var(--aura-color)' }}>
                                {format(currentMonthDate, 'MMMM yyyy', { locale: es })}
                            </h3>
                            <button onClick={nextMonth} className={`w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-all ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-100 text-slate-600'}`}>
                                <FontAwesomeIcon icon={faChevronRight} />
                            </button>
                        </div>

                        {/* Days of week */}
                        <div className="grid grid-cols-7 mb-2">
                            {weekDays.map(day => (
                                <div key={day} className={`text-center text-[10px] sm:text-xs font-black uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>
                                    {day}
                                </div>
                            ))}
                        </div>

                        {/* Calendar Grid */}
                        <div className="border-t border-l rounded-xl overflow-hidden border-slate-200 dark:border-slate-800">
                            <div className="flex sm:flex-col overflow-x-auto snap-x snap-mandatory sm:snap-none hide-scrollbar w-full">
                                {rows}
                            </div>
                        </div>
                        
                        {/* Swipe Hint for Mobile */}
                        <div className="text-center sm:hidden mt-4 text-[10px] text-slate-400 font-bold uppercase tracking-widest flex items-center justify-center gap-3">
                            <FontAwesomeIcon icon={faChevronLeft} className="opacity-50" />
                            <span>Desliza para ver más semanas</span>
                            <FontAwesomeIcon icon={faChevronRight} className="opacity-50" />
                        </div>
                    </div>
                </div>

                {/* Details Panel */}
                <div className="w-full lg:w-80 flex-shrink-0">
                    <div className={`p-5 rounded-2xl border ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'} sticky top-24 shadow-xl`}>
                        <h3 className={`font-black text-lg mb-4 flex items-center gap-2 ${s.bodyText}`}>
                            <FontAwesomeIcon icon={faListUl} className="text-slate-400" /> 
                            {selectedDate ? format(selectedDate, 'dd MMM, yyyy', { locale: es }) : 'Selecciona un día'}
                        </h3>
                        
                        {!selectedDate ? (
                            <p className={`text-sm ${s.bodyTextMuted}`}>Toca un día en el calendario para ver los gastos específicos.</p>
                        ) : expensesForSelected.length === 0 ? (
                            <p className={`text-sm ${s.bodyTextMuted}`}>No hay gastos registrados en este día.</p>
                        ) : (
                            <div className="space-y-3">
                                {expensesForSelected.map(exp => {
                                    const style = categoryStyles[exp.category] || categoryStyles['otros']
                                    return (
                                        <div key={exp.id} onClick={() => navigate('/lista')} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer hover:-translate-y-0.5 transition-all ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-slate-600' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
                                            <span className="text-xl">{style.emoji}</span>
                                            <div className="flex-1 min-w-0">
                                                <p className={`text-sm font-bold truncate ${s.bodyText}`}>{exp.description}</p>
                                                <p className={`text-[10px] font-bold uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>{style.label}</p>
                                            </div>
                                            <span className="font-black text-rose-400 text-sm">-${formatCLP(exp.amount)}</span>
                                        </div>
                                    )
                                })}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default CalendarView
