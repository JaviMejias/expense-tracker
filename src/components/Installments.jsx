import { useState } from 'react'
import { format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCreditCard, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { useThemeStyles } from '../hooks/useThemeStyles'
import { useAppAlert } from '../hooks/useAppAlert'
import EmptyState from './EmptyState'
import InstallmentItem from './InstallmentItem'
import InstallmentForm from './InstallmentForm'
import { useCategoryStyles } from '../hooks/useCategoryStyles'
import { useDataStore } from '../store/useDataStore'
import { useUIStore } from '../store/useUIStore'
import { useThemeStore } from '../store/useThemeStore'
import { appThemes } from '../utils/theme'
import { getPendingInstallments } from '../utils/installments'
import { motion, AnimatePresence } from 'framer-motion'

function Installments() {
    const {
        categories,
        installments, deleteInstallment, applyInstallmentToMonth, skipInstallmentMonth
    } = useDataStore()
    const { currentMonthDate } = useUIStore()
    const { themeMode, currentTheme } = useThemeStore()
    const activeTheme = appThemes[currentTheme] || appThemes.classic
    const { s, isDark, activeColor, textGradientClass, focusRingClass, aura } = useThemeStyles(themeMode, activeTheme)
    const { showToast, showConfirm } = useAppAlert(themeMode)

    const [showInstForm, setShowInstForm] = useState(false)

    const currentMonthKey = format(currentMonthDate, 'MM-yyyy')
    const categoryStyles = useCategoryStyles(categories)
    const pendingCount = getPendingInstallments(installments || [], currentMonthKey).length

    const handleDeleteInstallment = async (id) => {
        const inst = (installments || []).find(i => i.id === id)
        const confirmed = await showConfirm(
            '¿Eliminar cuota?',
            `¿Estás seguro de eliminar "${inst?.description || ''}"? Se perderá el historial de pagos.`
        )
        if (confirmed.isConfirmed) {
            deleteInstallment(id)
            showToast(`Cuota "${inst?.description}" eliminada`)
        }
    }

    const handleApplyInstallment = (id, monthKey) => {
        const inst = (installments || []).find(i => i.id === id)
        applyInstallmentToMonth(id, monthKey)
        showToast(`Cuota de "${inst?.description}" registrada como gasto ✅`, 'success', 2500)
    }

    const handleSkipInstallment = (id, monthKey) => {
        const inst = (installments || []).find(i => i.id === id)
        skipInstallmentMonth(id, monthKey)
        showToast(`Cuota de "${inst?.description}" saltada para este mes`, 'info', 2500)
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10 relative">
            <div>
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                    <h2 className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${textGradientClass} flex items-center gap-2`}>
                        <FontAwesomeIcon icon={faCreditCard} className={aura.icon} /> Compras en Cuotas
                        {pendingCount > 0 && (
                            <span className="ml-1 inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-black animate-pulse shadow-lg shadow-amber-500/30">
                                {pendingCount}
                            </span>
                        )}
                    </h2>
                    <button
                        type="button"
                        onClick={() => setShowInstForm(prev => !prev)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all cursor-pointer
                            ${showInstForm
                                ? (isDark ? 'bg-slate-700 border-slate-600 text-slate-300' : 'bg-slate-200 border-slate-300 text-slate-600')
                                : (isDark ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/30' : 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100')
                            }`}
                    >
                        <FontAwesomeIcon icon={showInstForm ? faChevronUp : faChevronDown} />
                        {showInstForm ? 'Cerrar' : 'Nueva cuota'}
                    </button>
                </div>

                <AnimatePresence>
                    {showInstForm && (
                        <InstallmentForm
                            categories={categories}
                            isDark={isDark}
                            activeTheme={activeTheme}
                            activeColor={activeColor}
                            s={s}
                            focusRingClass={focusRingClass}
                            aura={aura}
                            onCancel={() => setShowInstForm(false)}
                        />
                    )}
                </AnimatePresence>

                <div className="space-y-4">
                    {(!installments || installments.length === 0) ? (
                        <EmptyState icon={faCreditCard} message="No tienes compras en cuotas registradas." isDark={isDark} />
                    ) : (
                        installments.map(inst => (
                            <InstallmentItem
                                key={inst.id}
                                inst={inst}
                                currentMonthKey={currentMonthKey}
                                categoryStyle={categoryStyles[inst.category || 'otros']}
                                s={s}
                                aura={aura}
                                isDark={isDark}
                                onApply={handleApplyInstallment}
                                onSkip={handleSkipInstallment}
                                onDelete={handleDeleteInstallment}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default Installments