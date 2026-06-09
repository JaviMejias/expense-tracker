import { useState } from 'react'
import { parseISO, startOfMonth, endOfMonth, format } from 'date-fns'
import { es } from 'date-fns/locale'
import { motion, AnimatePresence } from 'framer-motion'
import { formatCLP } from '../utils/currency'
import { faSearchDollar, faGhost, faListUl, faList } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import SectionHeader from './SectionHeader'
import { useExpensesFilter } from '../hooks/useExpensesFilter'
import { useThemeStyles } from '../hooks/useThemeStyles'
import { useAppAlert } from '../hooks/useAppAlert'
import EmptyState from './EmptyState'
import ExpenseListItem from './ExpenseListItem'
import { useCategoryStyles } from '../hooks/useCategoryStyles'
import { appThemes } from '../utils/theme'
import { useNavigate } from 'react-router-dom'

import { useDataStore } from '../store/useDataStore'
import { useUIStore } from '../store/useUIStore'
import { useThemeStore } from '../store/useThemeStore'

import ExpenseListFilters from './ExpenseListFilters'
import ExpenseBulkActions from './ExpenseBulkActions'

function ExpenseList() {
    const { expenses, deleteExpense, duplicateExpenses, bulkUpdateExpenseCategory, categories, registerReimbursement, forgiveReimbursement } = useDataStore()
    const { currentMonthDate } = useUIStore()
    const navigate = useNavigate()
    const { themeMode, currentTheme } = useThemeStore()
    const activeTheme = appThemes[currentTheme] || appThemes.classic

    const { s, isDark, activeColor, textGradientClass, focusRingClass, aura } = useThemeStyles(themeMode, activeTheme)
    const [startDate, setStartDate] = useState(startOfMonth(currentMonthDate))
    const [endDate, setEndDate] = useState(endOfMonth(currentMonthDate))
    const [selectedIds, setSelectedIds] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState('date-desc')
    const [compactMode, setCompactMode] = useState(false)
    const { showToast, showConfirm, showPrompt } = useAppAlert(themeMode)

    const categoryStyles = useCategoryStyles(categories)

    const { filteredExpenses, sortedExpenses } = useExpensesFilter(expenses, startDate, endDate, searchQuery, sortBy, categoryStyles)

    const handleEdit = (expense) => {
        navigate('/registrar', { state: { editExpense: expense } })
    }

    const handleToggleSelect = (id) => {
        setSelectedIds(prev =>
            prev.includes(id) ? prev.filter(item => item !== id) : [...prev, id]
        )
    }

    const handleSelectAllToggle = () => {
        if (selectedIds.length === filteredExpenses.length) {
            setSelectedIds([])
        } else {
            setSelectedIds(filteredExpenses.map(exp => exp.id))
        }
    }

    const handleDeleteClick = async (expense) => {
        const result = await showConfirm(
            '¿Eliminar gasto?',
            `¿Estás seguro de que quieres eliminar "${expense.description}"? Esta acción no se puede deshacer.`
        )

        if (result.isConfirmed) {
            deleteExpense(expense.id)
            setSelectedIds(prev => prev.filter(id => id !== expense.id))
            showToast(`Gasto "${expense.description}" eliminado`)
        }
    }

    const handleBulkDeleteClick = async () => {
        if (selectedIds.length === 0) return

        const result = await showConfirm(
            '¿Eliminar gastos seleccionados?',
            `Estás a punto de eliminar ${selectedIds.length} ${selectedIds.length === 1 ? 'gasto' : 'gastos'}. Esta acción no se puede deshacer.`
        )

        if (result.isConfirmed) {
            const count = selectedIds.length
            deleteExpense(selectedIds)
            setSelectedIds([])
            showToast(`${count} ${count === 1 ? 'gasto eliminado' : 'gastos eliminados'} con éxito`)
        }
    }

    const handleBulkDuplicateClick = async () => {
        if (selectedIds.length === 0) return

        const result = await showConfirm(
            '¿Duplicar gastos seleccionados?',
            `Vas a duplicar ${selectedIds.length} ${selectedIds.length === 1 ? 'gasto' : 'gastos'} en este mismo mes gestionado.`,
            'Sí, duplicar',
            false
        )

        if (result.isConfirmed) {
            const count = selectedIds.length
            duplicateExpenses(selectedIds, currentMonthDate)
            setSelectedIds([])
            showToast(`${count} ${count === 1 ? 'gasto duplicado' : 'gastos duplicados'} con éxito`)
        }
    }

    const handleBulkAssignCategory = async () => {
        if (selectedIds.length === 0) return

        const inputOptions = {}
        categories.forEach(cat => {
            inputOptions[cat.id] = `${cat.emoji} ${cat.name}`
        })

        const result = await showPrompt({
            title: '🏷️ Asignar Categória',
            text: `Selecciona la categoría para ${selectedIds.length} ${selectedIds.length === 1 ? 'gasto seleccionado' : 'gastos seleccionados'}:`,
            input: 'select',
            inputOptions,
            inputValue: 'otros',
            showCancelButton: true,
            confirmButtonText: 'Asignar',
            cancelButtonText: 'Cancelar',
        })

        if (result.isConfirmed && result.value) {
            const count = selectedIds.length
            bulkUpdateExpenseCategory(selectedIds, result.value)
            const catName = categories.find(c => c.id === result.value)?.name || result.value
            setSelectedIds([])
            showToast(`${count} ${count === 1 ? 'gasto asignado' : 'gastos asignados'} a "${catName}" ✅`)
        }
    }

    const handleReimburseClick = async (expense) => {
        const remainingToReimburse = expense.amount - (expense.reimbursedAmount || 0)
        if (remainingToReimburse <= 0) return

        const result = await showPrompt({
            title: 'Recibir Pago',
            text: `El monto total del préstamo fue $${formatCLP(expense.amount)}. Hasta ahora han devuelto $${formatCLP(expense.reimbursedAmount || 0)}. Faltan $${formatCLP(remainingToReimburse)}. ¿Cuánto dinero recibiste hoy?`,
            input: 'text',
            inputValue: formatCLP(remainingToReimburse),
            showCancelButton: true,
            confirmButtonText: 'Registrar Pago',
            cancelButtonText: 'Cancelar',
            isAmountPrompt: true,
            inputValidator: (value) => {
                const numericVal = parseCLP(value)
                if (numericVal <= 0) return 'Por favor ingresa un monto válido mayor a cero.'
                if (numericVal > remainingToReimburse) return `No puedes registrar más del saldo pendiente ($${formatCLP(remainingToReimburse)}).`
            }
        })

        if (result.isConfirmed && result.value) {
            const amountReceived = parseCLP(result.value)
            registerReimbursement(expense.id, amountReceived)
            showToast(`¡$${formatCLP(amountReceived)} recuperados y sumados a tu sueldo! 🎉`, 'success', 3000)
        }
    }

    const handleForgiveClick = async (expense) => {
        const remainingToReimburse = expense.amount - (expense.reimbursedAmount || 0)
        const result = await showConfirm(
            '¿Perdonar deuda restante?',
            `Faltan $${formatCLP(remainingToReimburse)} por recuperar de este préstamo. Si perdonas la deuda, dejará de ser reembolsable y el monto restante se asumirá permanentemente como un gasto tuyo. Esta acción no se puede deshacer.`,
            'Sí, perdonar deuda',
            false
        )

        if (result.isConfirmed) {
            forgiveReimbursement(expense.id)
            showToast(`Deuda perdonada. El restante ha sido asumido como gasto.`, 'info')
        }
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <SectionHeader
                    title="Tus Movimientos"
                    icon={faSearchDollar}
                    gradientClass={textGradientClass}
                    iconClass={aura.icon}
                    className="!mb-0"
                />
                <button
                    onClick={() => setCompactMode(c => !c)}
                    title={compactMode ? 'Vista Normal' : 'Vista Compacta'}
                    className={`flex items-center gap-2 text-xs font-black uppercase tracking-widest px-3 py-2 rounded-xl border transition-all duration-300 ${
                        compactMode
                            ? (isDark ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-600')
                            : (isDark ? 'bg-slate-800/50 border-slate-700 text-slate-400 hover:text-slate-200' : 'bg-white border-slate-200 text-slate-500 hover:text-slate-700')
                    }`}
                >
                    <FontAwesomeIcon icon={compactMode ? faList : faListUl} />
                    {compactMode ? 'Compacto' : 'Normal'}
                </button>
            </div>

            <ExpenseListFilters
                startDate={startDate} setStartDate={setStartDate}
                endDate={endDate} setEndDate={setEndDate}
                searchQuery={searchQuery} setSearchQuery={setSearchQuery}
                sortBy={sortBy} setSortBy={setSortBy}
                setSelectedIds={setSelectedIds}
                activeColor={activeColor} activeTheme={activeTheme} isDark={isDark} s={s} focusRingClass={focusRingClass} aura={aura}
            />

            <ExpenseBulkActions
                filteredExpenses={filteredExpenses}
                selectedIds={selectedIds}
                handleSelectAllToggle={handleSelectAllToggle}
                handleBulkAssignCategory={handleBulkAssignCategory}
                handleBulkDuplicateClick={handleBulkDuplicateClick}
                handleBulkDeleteClick={handleBulkDeleteClick}
                isDark={isDark}
                aura={aura}
            />

            <div className={compactMode ? 'space-y-1' : 'space-y-4'}>
                <AnimatePresence mode="popLayout">
                    {filteredExpenses.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2 }}
                        >
                            <EmptyState
                                icon={faGhost}
                                message="Todo tranquilo, no hay gastos por aquí."
                                isDark={isDark}
                            />
                        </motion.div>
                    ) : compactMode ? (
                        <motion.div key="compact" layout className={`rounded-2xl border overflow-hidden ${isDark ? 'border-slate-700/50' : 'border-slate-200'}`}>
                            <AnimatePresence mode="popLayout">
                                {sortedExpenses.map((expense, index) => {
                                    const catStyle = categoryStyles[expense.category] || categoryStyles['otros']
                                    return (
                                        <motion.div
                                            key={expense.id}
                                            layout
                                            initial={{ opacity: 0, x: -20 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, scale: 0.95, backgroundColor: 'rgba(244, 63, 94, 0.1)' }}
                                            transition={{ type: 'spring', stiffness: 600, damping: 35, mass: 1, delay: Math.min(index * 0.02, 0.3) }}
                                            className={`flex items-center gap-3 px-4 py-2.5 border-b last:border-b-0 cursor-pointer ${
                                                isDark
                                                    ? 'border-slate-700/50 hover:bg-slate-800/50'
                                                    : 'border-slate-100 hover:bg-slate-50'
                                            }`}
                                            onClick={() => handleEdit(expense)}
                                        >
                                            <span className="text-base">{catStyle?.emoji || '🏷️'}</span>
                                            <span className={`flex-1 text-sm font-bold truncate ${s.bodyText}`}>{expense.description}</span>
                                            <span className={`text-[10px] font-bold ${s.bodyTextMuted} hidden sm:block`}>
                                                {format(parseISO(expense.date), 'dd MMM', { locale: es })}
                                            </span>
                                            <span className="text-sm font-black text-rose-400">-${formatCLP(expense.amount)}</span>
                                        </motion.div>
                                    )
                                })}
                            </AnimatePresence>
                        </motion.div>
                    ) : (
                        sortedExpenses.map((expense, index) => (
                            <ExpenseListItem
                                key={expense.id}
                                expense={expense}
                                index={index}
                                isSelected={selectedIds.includes(expense.id)}
                                onToggleSelect={handleToggleSelect}
                                onEdit={handleEdit}
                                onDelete={handleDeleteClick}
                                categoryStyle={categoryStyles[expense.category] || categoryStyles['otros']}
                                s={s}
                                aura={aura}
                                activeTheme={activeTheme}
                                isDark={isDark}
                                onReimburse={handleReimburseClick}
                                onForgive={handleForgiveClick}
                            />
                        ))
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}

export default ExpenseList