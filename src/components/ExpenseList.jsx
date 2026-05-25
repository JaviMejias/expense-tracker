import { useState, useMemo } from 'react'
import { format, parseISO, startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns'
import { es } from 'date-fns/locale'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import Swal from 'sweetalert2'
import { formatCLP } from '../utils/currency'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faTrash, faSearchDollar, faGhost, faCopy } from '@fortawesome/free-solid-svg-icons'
import { colorThemes, getThemeClass } from '../utils/theme'

function ExpenseList({ expenses, handleEdit, handleDelete, handleDuplicateExpenses, currentMonthDate, categories = [], themeMode = 'dark', activeTheme }) {
    const s = getThemeClass(themeMode)
    const isDark = themeMode === 'dark'
    const [startDate, setStartDate] = useState(startOfMonth(currentMonthDate))
    const [endDate, setEndDate] = useState(endOfMonth(currentMonthDate))
    const [selectedIds, setSelectedIds] = useState([])
    const [searchQuery, setSearchQuery] = useState('')
    const [sortBy, setSortBy] = useState('date-desc')

    const textGradientClass = activeTheme ? (isDark ? activeTheme.textGradient : activeTheme.textGradientLight) : (isDark ? 'from-indigo-400 to-purple-400' : 'from-indigo-600 to-purple-600')
    const activeColor = activeTheme?.accentBgColor?.includes('rose') ? 'rose' : activeTheme?.accentBgColor?.includes('emerald') ? 'emerald' : 'indigo'

    const focusRingClass = { rose: 'focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500', emerald: 'focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500', indigo: 'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500' }[activeColor]

    const listStyles = {
        rose: {
            selected: isDark ? 'border-rose-500 bg-rose-950/20 shadow-md shadow-rose-950/30 text-rose-200' : 'border-rose-500 bg-rose-50/50 shadow-md shadow-rose-100/50 text-rose-950',
            unselected: isDark ? 'bg-slate-800/80 border-slate-700 hover:border-rose-500/50 hover:shadow-rose-900/20' : 'bg-white border-slate-200/80 hover:border-rose-500/50 hover:shadow-slate-200/50 text-slate-800',
            hoverText: isDark ? 'group-hover:text-rose-300' : 'group-hover:text-rose-600',
            checkbox: isDark ? 'border-slate-600 bg-slate-900 text-rose-500 focus:ring-rose-500 focus:ring-offset-slate-800' : 'border-slate-300 bg-white text-rose-600 focus:ring-rose-500 focus:ring-offset-white',
            badge: 'text-rose-300 bg-rose-500/10 border-rose-500/20',
            actionBtn: 'bg-rose-500/15 border-rose-500/30 text-rose-400 hover:bg-rose-600 hover:text-white',
            clearBtn: isDark ? 'text-rose-400 hover:text-rose-300' : 'text-rose-600 hover:text-rose-500',
            icon: 'text-rose-500',
            label: isDark ? 'text-rose-300' : 'text-rose-600'
        },
        emerald: {
            selected: isDark ? 'border-emerald-500 bg-emerald-950/20 shadow-md shadow-emerald-950/30 text-emerald-200' : 'border-emerald-500 bg-emerald-50/50 shadow-md shadow-emerald-100/50 text-emerald-950',
            unselected: isDark ? 'bg-slate-800/80 border-slate-700 hover:border-emerald-500/50 hover:shadow-emerald-900/20' : 'bg-white border-slate-200/80 hover:border-emerald-500/50 hover:shadow-slate-200/50 text-slate-800',
            hoverText: isDark ? 'group-hover:text-emerald-300' : 'group-hover:text-emerald-600',
            checkbox: isDark ? 'border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-800' : 'border-slate-300 bg-white text-emerald-600 focus:ring-emerald-500 focus:ring-offset-white',
            badge: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/20',
            actionBtn: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white',
            clearBtn: isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-500',
            icon: 'text-emerald-500',
            label: isDark ? 'text-emerald-300' : 'text-emerald-600'
        },
        indigo: {
            selected: isDark ? 'border-indigo-500 bg-indigo-950/20 shadow-md shadow-indigo-950/30 text-indigo-200' : 'border-indigo-500 bg-indigo-50/50 shadow-md shadow-indigo-100/50 text-indigo-950',
            unselected: isDark ? 'bg-slate-800/80 border-slate-700 hover:border-indigo-500/50 hover:shadow-indigo-900/20' : 'bg-white border-slate-200/80 hover:border-indigo-500/50 hover:shadow-slate-200/50 text-slate-800',
            hoverText: isDark ? 'group-hover:text-indigo-300' : 'group-hover:text-indigo-600',
            checkbox: isDark ? 'border-slate-600 bg-slate-900 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-800' : 'border-slate-300 bg-white text-indigo-600 focus:ring-indigo-500 focus:ring-offset-white',
            badge: 'text-indigo-300 bg-indigo-500/10 border-indigo-500/20',
            actionBtn: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400 hover:bg-indigo-600 hover:text-white',
            clearBtn: isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500',
            icon: 'text-indigo-500',
            label: isDark ? 'text-indigo-300' : 'text-indigo-600'
        }
    }[activeColor]

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

    const filteredExpenses = useMemo(() => {
        return expenses.filter(expense => {
            const expenseDate = parseISO(expense.date)
            const matchesDate = expenseDate >= startOfDay(startDate) && expenseDate <= endOfDay(endDate)

            const searchLower = searchQuery.toLowerCase().trim()
            const catObj = categoryStyles[expense.category] || categoryStyles['otros']
            const matchesSearch = !searchLower ||
                expense.description.toLowerCase().includes(searchLower) ||
                (expense.category && expense.category.toLowerCase().includes(searchLower)) ||
                (catObj && catObj.label.toLowerCase().includes(searchLower))

            return matchesDate && matchesSearch
        })
    }, [expenses, startDate, endDate, searchQuery, categoryStyles])

    const sortedExpenses = useMemo(() => {
        return [...filteredExpenses].sort((a, b) => {
            if (sortBy === 'date-desc') {
                return new Date(b.date).getTime() - new Date(a.date).getTime()
            } else if (sortBy === 'date-asc') {
                return new Date(a.date).getTime() - new Date(b.date).getTime()
            } else if (sortBy === 'amount-desc') {
                return b.amount - a.amount
            } else if (sortBy === 'amount-asc') {
                return a.amount - b.amount
            } else if (sortBy === 'desc-az') {
                return a.description.localeCompare(b.description)
            }
            return 0
        })
    }, [filteredExpenses, sortBy])

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
        const result = await Swal.fire({
            title: '¿Eliminar gasto?',
            text: `¿Estás seguro de que quieres eliminar "${expense.description}"? Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f43f5e',
            cancelButtonColor: s.swal.confirmButtonColor,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: s.swal.background,
            color: s.swal.color
        })

        if (result.isConfirmed) {
            handleDelete(expense.id)
            setSelectedIds(prev => prev.filter(id => id !== expense.id))

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: `Gasto "${expense.description}" eliminado`,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: s.swal.background,
                color: s.swal.color,
                iconColor: '#10b981'
            })
        }
    }

    const handleBulkDeleteClick = async () => {
        if (selectedIds.length === 0) return

        const result = await Swal.fire({
            title: '¿Eliminar gastos seleccionados?',
            text: `Estás a punto de eliminar ${selectedIds.length} ${selectedIds.length === 1 ? 'gasto' : 'gastos'}. Esta acción no se puede deshacer.`,
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#f43f5e',
            cancelButtonColor: s.swal.confirmButtonColor,
            confirmButtonText: 'Sí, eliminar',
            cancelButtonText: 'Cancelar',
            background: s.swal.background,
            color: s.swal.color
        })

        if (result.isConfirmed) {
            const count = selectedIds.length
            handleDelete(selectedIds)
            setSelectedIds([])

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: `${count} ${count === 1 ? 'gasto eliminado' : 'gastos eliminados'} con éxito`,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: s.swal.background,
                color: s.swal.color,
                iconColor: '#10b981'
            })
        }
    }

    const handleBulkDuplicateClick = async () => {
        if (selectedIds.length === 0) return

        const result = await Swal.fire({
            title: '¿Duplicar gastos seleccionados?',
            text: `Vas a duplicar ${selectedIds.length} ${selectedIds.length === 1 ? 'gasto' : 'gastos'} en este mismo mes gestionado.`,
            icon: 'question',
            showCancelButton: true,
            confirmButtonColor: s.swal.confirmButtonColor,
            cancelButtonColor: isDark ? '#475569' : '#e2e8f0',
            confirmButtonText: 'Sí, duplicar',
            cancelButtonText: 'Cancelar',
            background: s.swal.background,
            color: s.swal.color
        })

        if (result.isConfirmed) {
            const count = selectedIds.length
            handleDuplicateExpenses(selectedIds)
            setSelectedIds([])

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: `${count} ${count === 1 ? 'gasto duplicado' : 'gastos duplicados'} con éxito`,
                showConfirmButton: false,
                timer: 3000,
                timerProgressBar: true,
                background: s.swal.background,
                color: s.swal.color,
                iconColor: '#10b981'
            })
        }
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h2 className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${textGradientClass} flex items-center gap-2`}>
                    <FontAwesomeIcon icon={faSearchDollar} className={listStyles.icon} /> Tus Movimientos
                </h2>
            </div>

            <div className={`${s.itemBg} p-4 rounded-2xl mb-4 flex flex-col sm:flex-row gap-4`}>
                <div className="flex-1">
                    <label className={`block text-xs font-bold ${listStyles.label} mb-1 uppercase tracking-wider`}>Desde</label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => {
                            setStartDate(date)
                            setSelectedIds([])
                        }}
                        dateFormat="dd MMM yyyy"
                        locale={es}
                        calendarClassName={`aura-datepicker-${activeColor}`}
                        wrapperClassName="w-full"
                        className={`block w-full px-4 py-3 ${s.input} ${focusRingClass} rounded-xl font-bold capitalize transition-all cursor-pointer text-center sm:text-left ${activeTheme ? activeTheme.accentGlowText : (isDark ? 'text-indigo-400' : 'text-indigo-600')}`}
                    />
                </div>
                <div className="flex-1">
                    <label className={`block text-xs font-bold ${listStyles.label} mb-1 uppercase tracking-wider`}>Hasta</label>
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => {
                            setEndDate(date)
                            setSelectedIds([])
                        }}
                        dateFormat="dd MMM yyyy"
                        locale={es}
                        calendarClassName={`aura-datepicker-${activeColor}`}
                        wrapperClassName="w-full"
                        className={`block w-full px-4 py-3 ${s.input} ${focusRingClass} rounded-xl font-bold capitalize transition-all cursor-pointer text-center sm:text-left ${activeTheme ? activeTheme.accentGlowText : (isDark ? 'text-indigo-400' : 'text-indigo-600')}`}
                    />
                </div>
            </div>

            <div className={`${s.itemBg} p-4 rounded-2xl mb-6 flex flex-col md:flex-row items-center gap-4`}>
                <div className="relative w-full md:flex-1">
                    <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-500 pointer-events-none">
                        <FontAwesomeIcon icon={faSearchDollar} className={listStyles.icon} />
                    </span>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => {
                            setSearchQuery(e.target.value)
                            setSelectedIds([])
                        }}
                        placeholder="Buscar por descripción o categoría (Ej: Comida, Uber, Supermercado)..."
                        className={`block w-full pl-10 pr-12 py-3 ${s.input} ${focusRingClass} rounded-xl font-medium transition-all text-sm shadow-inner`}
                    />
                    {searchQuery && (
                        <button
                            onClick={() => {
                                setSearchQuery('')
                                setSelectedIds([])
                            }}
                            className={`absolute inset-y-0 right-0 pr-4 flex items-center transition-colors text-xs font-black uppercase tracking-wider select-none cursor-pointer ${listStyles.clearBtn}`}
                        >
                            Limpiar
                        </button>
                    )}
                </div>

                <div className="w-full md:w-64">
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className={`block w-full px-4 py-3 ${s.input} ${focusRingClass} rounded-xl font-bold transition-all cursor-pointer text-sm`}
                    >
                        <option value="date-desc">📅 Fecha: Reciente primero</option>
                        <option value="date-asc">📅 Fecha: Antiguo primero</option>
                        <option value="amount-desc">💰 Monto: Mayor a menor</option>
                        <option value="amount-asc">💰 Monto: Menor a mayor</option>
                        <option value="desc-az">🔤 Nombre: A-Z</option>
                    </select>
                </div>
            </div>

            {filteredExpenses.length > 0 && (
                <div className={`flex flex-col sm:flex-row sm:items-center justify-between ${isDark ? 'bg-slate-900/30 border-slate-700/50' : 'bg-slate-100/60 border-slate-200'} border p-4 rounded-2xl mb-6 gap-4 animate-in fade-in slide-in-from-top-2 duration-300`}>
                    <div className="flex items-center gap-3">
                        <label className={`flex items-center gap-3 cursor-pointer text-sm font-bold transition-colors select-none ${isDark ? 'text-slate-300' : 'text-slate-700'} ${listStyles.hoverText}`}>
                            <input
                                type="checkbox"
                                checked={filteredExpenses.length > 0 && selectedIds.length === filteredExpenses.length}
                                ref={(input) => {
                                    if (input) {
                                        input.indeterminate = selectedIds.length > 0 && selectedIds.length < filteredExpenses.length;
                                    }
                                }}
                                onChange={handleSelectAllToggle}
                                className={`w-5 h-5 rounded-md transition-all cursor-pointer ${listStyles.checkbox}`}
                            />
                            <span>Seleccionar todos ({filteredExpenses.length})</span>
                        </label>
                    </div>

                    {selectedIds.length > 0 && (
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto animate-in fade-in zoom-in-95 duration-200">
                            <span className={`text-sm font-black px-3 py-1.5 rounded-xl w-full sm:w-auto text-center border ${listStyles.badge}`}>
                                {selectedIds.length} {selectedIds.length === 1 ? 'seleccionado' : 'seleccionados'}
                            </span>
                            <div className="flex gap-2 w-full sm:w-auto">
                                <button
                                    onClick={handleBulkDuplicateClick}
                                    className={`flex-1 sm:flex-none font-black py-2.5 px-4 rounded-xl transition-all duration-300 transform hover:scale-102 flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer ${listStyles.actionBtn}`}
                                >
                                    <FontAwesomeIcon icon={faCopy} /> Duplicar
                                </button>
                                <button
                                    onClick={handleBulkDeleteClick}
                                    className="flex-1 sm:flex-none bg-rose-500/15 border border-rose-500/30 text-rose-400 font-black py-2.5 px-4 rounded-xl hover:bg-rose-600 hover:text-white transition-all duration-300 transform hover:scale-102 flex items-center justify-center gap-2 text-sm shadow-md cursor-pointer"
                                >
                                    <FontAwesomeIcon icon={faTrash} /> Eliminar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

            <div className="space-y-4">
                {filteredExpenses.length === 0 ? (
                    <div className={`text-center py-16 ${isDark ? 'bg-slate-800/30 border-slate-600' : 'bg-slate-100/50 border-slate-300'} border border-dashed rounded-3xl`}>
                        <FontAwesomeIcon icon={faGhost} className="text-5xl text-slate-500 mb-4 animate-pulse" />
                        <p className={`${s.bodyTextMuted} font-bold text-lg`}>Todo tranquilo, no hay gastos por aquí.</p>
                    </div>
                ) : (
                    sortedExpenses.map(expense => (
                        <div
                            key={expense.id}
                            onClick={() => handleToggleSelect(expense.id)}
                            className={`group flex flex-row items-start sm:items-center p-5 border transition-all duration-300 hover:-translate-y-1 gap-4 rounded-2xl hover:shadow-lg cursor-pointer ${selectedIds.includes(expense.id) ? listStyles.selected : listStyles.unselected}`}
                        >
                            <div className="flex items-center self-stretch pr-1" onClick={(e) => e.stopPropagation()}>
                                <input
                                    type="checkbox"
                                    checked={selectedIds.includes(expense.id)}
                                    onChange={() => handleToggleSelect(expense.id)}
                                    className={`w-5 h-5 rounded-md transition-all cursor-pointer ${listStyles.checkbox}`}
                                />
                            </div>

                            {/* Content */}
                            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex flex-wrap items-center gap-2">
                                        <p className={`font-extrabold ${s.bodyText} text-lg transition-colors ${listStyles.hoverText}`}>{expense.description}</p>

                                        {(() => {
                                            const cat = categoryStyles[expense.category] || categoryStyles['otros']
                                            return (
                                                <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-0.5 rounded-lg border ${cat.bgClass} flex items-center gap-1 select-none`}>
                                                    <span>{cat.emoji}</span>
                                                    <span>{cat.label}</span>
                                                </span>
                                            )
                                        })()}
                                    </div>
                                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-2 sm:items-center">
                                        <p className="text-base font-black text-rose-400 bg-rose-400/10 border border-rose-400/20 px-3 py-1 rounded-lg">-${formatCLP(expense.amount)}</p>
                                        <span className={`text-sm font-bold capitalize ${activeTheme ? (isDark ? `${activeTheme.accentGlowText} bg-white/5 border-white/10` : `${activeTheme.accentGlowText} bg-black/5 border-black/10`) : (isDark ? 'text-indigo-300 bg-indigo-400/10 border-indigo-400/20' : 'text-indigo-700 bg-indigo-50 border-indigo-100')} px-3 py-1 rounded-lg`}>
                                            {format(parseISO(expense.date), "dd MMM yyyy", { locale: es })}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300" onClick={(e) => e.stopPropagation()}>
                                    <button
                                        onClick={() => handleEdit(expense)}
                                        className="flex-1 sm:flex-none bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black py-2 px-4 rounded-xl hover:bg-amber-500 hover:text-slate-900 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <FontAwesomeIcon icon={faEdit} /> Editar
                                    </button>
                                    <button
                                        onClick={() => handleDeleteClick(expense)}
                                        className="flex-1 sm:flex-none bg-rose-500/10 border border-rose-500/20 text-rose-400 font-black py-2 px-4 rounded-xl hover:bg-rose-500 hover:text-white transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 cursor-pointer"
                                    >
                                        <FontAwesomeIcon icon={faTrash} /> Eliminar
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default ExpenseList