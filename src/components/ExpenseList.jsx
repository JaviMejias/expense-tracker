import { useState } from 'react'
import { format, parseISO, startOfMonth, endOfMonth } from 'date-fns'
import { es } from 'date-fns/locale'
import { formatCLP } from '../utils/currency'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faSearchDollar, faGhost, faCopy } from '@fortawesome/free-solid-svg-icons'
import SectionHeader from './SectionHeader'
import { useExpensesFilter } from '../hooks/useExpensesFilter'
import CustomDatePicker from './CustomDatePicker'
import CustomInput from './CustomInput'
import { useThemeStyles } from '../hooks/useThemeStyles'
import { useAppAlert } from '../hooks/useAppAlert'
import EmptyState from './EmptyState'
import CustomButton from './CustomButton'
import CategoryBadge from './CategoryBadge'
import ExpenseListItem from './ExpenseListItem'
import CustomSelect from './CustomSelect'
import { useCategoryStyles } from '../hooks/useCategoryStyles'
import { appThemes } from '../utils/theme'
import { useNavigate } from 'react-router-dom'

import { useDataStore } from '../store/useDataStore'
import { useUIStore } from '../store/useUIStore'
import { useThemeStore } from '../store/useThemeStore'

const sortOptions = [
    { value: 'date-desc', label: '📅 Fecha: Reciente primero' },
    { value: 'date-asc', label: '📅 Fecha: Antiguo primero' },
    { value: 'amount-desc', label: '💰 Monto: Mayor a menor' },
    { value: 'amount-asc', label: '💰 Monto: Menor a mayor' },
    { value: 'desc-az', label: '🔤 Nombre: A-Z' }
]

function ExpenseList() {
    const { expenses, deleteExpense, duplicateExpenses, categories } = useDataStore()
    const { currentMonthDate, setEditingId, setExpenseDate, setDescription, setAmount, setCategory } = useUIStore()
    const navigate = useNavigate()
    const { themeMode, currentTheme } = useThemeStore()
    const activeTheme = appThemes[currentTheme] || appThemes.classic

    const { s, isDark, activeColor, textGradientClass, focusRingClass, aura } = useThemeStyles(themeMode, activeTheme)
    const [startDate, setStartDate] = useState(startOfMonth(currentMonthDate))
    const [endDate, setEndDate] = useState(endOfMonth(currentMonthDate))
    const [selectedIds, setSelectedIds] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState('date-desc')
    const { showToast, showConfirm } = useAppAlert(themeMode)

    const categoryStyles = useCategoryStyles(categories)

    const { filteredExpenses, sortedExpenses } = useExpensesFilter(expenses, startDate, endDate, searchQuery, sortBy, categoryStyles)

    const handleEdit = (expense) => {
        navigate('/registrar')
        setEditingId(expense.id)
        setExpenseDate(parseISO(expense.date))
        setDescription(expense.description)
        setAmount(formatCLP(expense.amount))
        setCategory(expense.category || 'otros')
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
            </div>

            <div className={`${s.itemBg} p-4 rounded-2xl mb-4 flex flex-col sm:flex-row gap-4`}>
                <div className="flex-1">
                    <label className={`block text-xs font-bold ${aura.label} mb-1 uppercase tracking-wider`}>Desde</label>
                    <CustomDatePicker
                        selected={startDate}
                        onChange={(date) => {
                            setStartDate(date)
                            setSelectedIds([])
                        }}
                        activeColor={activeColor}
                        activeTheme={activeTheme}
                        isDark={isDark}
                        s={s}
                        focusRingClass={focusRingClass}
                        className="px-4 py-3 rounded-xl font-bold capitalize"
                    />
                </div>
                <div className="flex-1">
                    <label className={`block text-xs font-bold ${aura.label} mb-1 uppercase tracking-wider`}>Hasta</label>
                    <CustomDatePicker
                        selected={endDate}
                        onChange={(date) => {
                            setEndDate(date)
                            setSelectedIds([])
                        }}
                        activeColor={activeColor}
                        activeTheme={activeTheme}
                        isDark={isDark}
                        s={s}
                        focusRingClass={focusRingClass}
                        className="px-4 py-3 rounded-xl font-bold capitalize"
                    />
                </div>
            </div>

            <div className={`${s.itemBg} p-4 rounded-2xl mb-6 flex flex-col md:flex-row items-center gap-4`}>
                <div className="w-full md:flex-1">
                    <CustomInput
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                            setSelectedIds([])
                        }}
                        placeholder="Buscar por descripción o categoría (Ej: Comida, Uber, Supermercado)..."
                        icon={faSearchDollar}
                        iconClass={aura.icon}
                        s={s}
                        focusRingClass={focusRingClass}
                        className="py-3 rounded-xl font-medium text-sm"
                        rightElement={
                            searchQuery && (
                                <button onClick={() => { setSearchQuery(''); setSelectedIds([]) }} className={`transition-colors text-xs font-black uppercase tracking-wider select-none cursor-pointer ${aura.listClearBtn}`}>
                                    Limpiar
                                </button>
                            )
                        }
                    />
                </div>

                <div className="w-full md:w-64">
                    <CustomSelect
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        options={sortOptions}
                        s={s}
                        focusRingClass={focusRingClass}
                        isDark={isDark}
                        className="px-4 py-3 rounded-xl font-bold text-sm"
                    />
                </div>
            </div>

            {filteredExpenses.length > 0 && (
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between ${isDark ? 'bg-slate-900/30 border-slate-700/50' : 'bg-slate-100/60 border-slate-200'} border p-4 rounded-2xl mb-6 gap-4 animate-in fade-in slide-in-from-top-2 duration-300`}>
                    <div className="flex items-center gap-3">
                        <label className={`flex items-center gap-3 cursor-pointer text-sm font-bold transition-colors select-none ${isDark ? 'text-slate-300' : 'text-slate-700'} ${aura.listHoverText}`}>
                            <input
                                type="checkbox"
                                checked={filteredExpenses.length > 0 && selectedIds.length === filteredExpenses.length}
                                ref={(input) => {
                                    if (input) {
                                        input.indeterminate = selectedIds.length > 0 && selectedIds.length < filteredExpenses.length;
                                    }
                                }}
                                onChange={handleSelectAllToggle}
                                className={`w-5 h-5 rounded-md transition-all cursor-pointer ${aura.listCheckbox}`}
                            />
                            <span>Seleccionar todos ({filteredExpenses.length})</span>
                        </label>
                    </div>

                    {selectedIds.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto animate-in fade-in zoom-in-95 duration-200">
                            <span className={`text-sm font-black px-3 py-1.5 rounded-xl w-full sm:w-auto text-center border ${aura.badge}`}>
                                {selectedIds.length} {selectedIds.length === 1 ? 'seleccionado' : 'seleccionados'}
                            </span>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <CustomButton
                                    onClick={handleBulkDuplicateClick}
                                    variant="custom"
                                    icon={faCopy}
                                    className={`flex-1 sm:flex-none py-2.5 px-4 text-sm shadow-md ${aura.listActionBtn}`}
                                >
                                    Duplicar
                                </CustomButton>
                                <CustomButton
                                    onClick={handleBulkDeleteClick}
                                    variant="danger"
                                    icon={faTrash}
                                    className="flex-1 sm:flex-none py-2.5 px-4 text-sm"
                                >
                                    Eliminar
                                </CustomButton>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="space-y-4">
                {filteredExpenses.length === 0 ? (
                    <EmptyState
                        icon={faGhost}
                        message="Todo tranquilo, no hay gastos por aquí."
                        isDark={isDark}
                    />
                ) : (
                    sortedExpenses.map(expense => (
                        <ExpenseListItem
                            key={expense.id}
                            expense={expense}
                            isSelected={selectedIds.includes(expense.id)}
                            onToggleSelect={handleToggleSelect}
                            onEdit={handleEdit}
                            onDelete={handleDeleteClick}
                            categoryStyle={categoryStyles[expense.category] || categoryStyles['otros']}
                            s={s}
                            aura={aura}
                            activeTheme={activeTheme}
                            isDark={isDark}
                        />
                    ))
                )}
            </div>
        </div>
    )
}

export default ExpenseList