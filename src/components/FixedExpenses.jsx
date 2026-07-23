import { useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import CustomDatePicker from './CustomDatePicker'
import { useThemeStyles } from '../hooks/useThemeStyles'
import { useAppAlert } from '../hooks/useAppAlert'
import EmptyState from './EmptyState'
import FixedExpenseItem from './FixedExpenseItem'
import FixedExpenseForm from './FixedExpenseForm'
import { useCategoryStyles } from '../hooks/useCategoryStyles'
import { useDataStore } from '../store/useDataStore'
import { useUIStore } from '../store/useUIStore'
import { useThemeStore } from '../store/useThemeStore'
import { appThemes } from '../utils/theme'
import { motion, AnimatePresence } from 'framer-motion'

const weekDays = [
    { id: 1, name: 'Lun' },
    { id: 2, name: 'Mar' },
    { id: 3, name: 'Mié' },
    { id: 4, name: 'Jue' },
    { id: 5, name: 'Vie' },
    { id: 6, name: 'Sáb' },
    { id: 0, name: 'Dom' }
]

function FixedExpenses() {
    const {
        fixedExpenses, setFixedExpenses, applyFixedExpenseToMonth, categories
    } = useDataStore()
    const { currentMonthDate, setCurrentMonthDate } = useUIStore()
    const { themeMode, currentTheme } = useThemeStore()
    const activeTheme = appThemes[currentTheme] || appThemes.classic
    const { s, isDark, activeColor, textGradientClass, focusRingClass, aura } = useThemeStyles(themeMode, activeTheme)
    const { showToast, showConfirm } = useAppAlert(themeMode)

    const [showForm, setShowForm] = useState(false)

    const currentMonthKey = format(currentMonthDate, 'MM-yyyy')
    const categoryStyles = useCategoryStyles(categories)

    const handleApplyToMonth = async (item) => {
        const applied = item.appliedMonths || []
        const forceDuplicate = applied.includes(currentMonthKey)
        if (applied.includes(currentMonthKey)) {
            const result = await showConfirm(
                '¿Plantilla duplicada?',
                `Ya aplicaste la plantilla "${item.description}" en este mes. ¿Estás seguro de querer añadirla nuevamente?`,
                'Sí, duplicar',
                false
            )
            if (!result.isConfirmed) return
        }
        applyFixedExpenseToMonth(item, currentMonthDate, { forceDuplicate })
        showToast(`¡"${item.description}" añadido a ${format(currentMonthDate, 'MMMM', { locale: es })}!`)
    }

    const handleDeleteFixedExpense = async (id) => {
        const item = fixedExpenses.find(f => f.id === id)
        const confirmed = await showConfirm('¿Eliminar plantilla?', `¿Estás seguro de eliminar "${item?.description || 'esta plantilla'}"?`)
        if (confirmed.isConfirmed) {
            setFixedExpenses(fixedExpenses.filter(f => f.id !== id))
            showToast(`Plantilla "${item?.description}" eliminada`)
        }
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10 relative">

            <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${textGradientClass} flex items-center gap-2`}>
                        <FontAwesomeIcon icon={faStar} className={aura.icon} /> Plantillas de Gastos
                    </h2>
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
                        {showForm ? 'Cerrar' : 'Nueva Plantilla'}
                    </button>
                </div>
                
                <AnimatePresence>
                    {showForm && (
                        <FixedExpenseForm
                            weekDays={weekDays}
                            isDark={isDark}
                            activeTheme={activeTheme}
                            aura={aura}
                            s={s}
                            focusRingClass={focusRingClass}
                            onCancel={() => setShowForm(false)}
                        />
                    )}
                </AnimatePresence>
            </div>

            <div>
                <div className="flex flex-col sm:flex-row justify-end mb-6">
                    <div className={`w-full sm:w-auto bg-gradient-to-br ${aura.monthBox} backdrop-blur-md px-5 py-3 rounded-2xl border flex flex-col sm:flex-row items-center gap-3 sm:gap-4 transition-all group shadow-sm`}>
                        <div className="flex items-center gap-2">
                            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
                            <span className={`text-xs font-black ${isDark ? 'text-slate-300 group-hover:text-indigo-300' : 'text-slate-500 group-hover:text-indigo-600'} transition-colors uppercase tracking-wider`}>Aplicar al mes de:</span>
                        </div>
                        <CustomDatePicker selected={currentMonthDate} onChange={(date) => setCurrentMonthDate(date)} type="month" activeColor={activeColor} activeTheme={activeTheme} isDark={isDark} s={s} focusRingClass={focusRingClass} wrapperClassName="w-full sm:w-auto" className="sm:w-44 px-4 py-2 rounded-xl font-extrabold text-xs uppercase tracking-wide" />
                    </div>
                </div>
                <div className="space-y-4">
                    {fixedExpenses.length === 0 ? (
                        <EmptyState icon={faStar} message="No has creado plantillas de gastos fijos." isDark={isDark} />
                    ) : (
                        fixedExpenses.map(item => (
                            <FixedExpenseItem key={item.id} item={item} categoryStyle={categoryStyles[item.category || 'otros']} weekDays={weekDays} currentMonthDate={currentMonthDate} s={s} aura={aura} isDark={isDark} onApplyToMonth={handleApplyToMonth} onDelete={handleDeleteFixedExpense} />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default FixedExpenses