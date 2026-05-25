import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { es } from 'date-fns/locale'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faSave, faTimesCircle, faTags, faDollarSign, faCalendarDay } from '@fortawesome/free-solid-svg-icons'
import { formatCLP } from '../utils/currency'
import { getThemeClass } from '../utils/theme'

function ExpenseForm({
    editingId,
    expenseDate,
    setExpenseDate,
    description,
    setDescription,
    amount,
    handleAmountChange,
    setAmount,
    errors,
    handleSubmit,
    handleCancelEdit,
    category = 'otros',
    setCategory,
    categories = [],
    themeMode = 'dark',
    activeTheme
}) {
    const s = getThemeClass(themeMode)
    const isDark = themeMode === 'dark'

    const activeColor = activeTheme?.accentBgColor?.includes('rose') ? 'rose' : activeTheme?.accentBgColor?.includes('emerald') ? 'emerald' : 'indigo'
    const focusRingClass = { rose: 'focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500', emerald: 'focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500', indigo: 'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500' }[activeColor]
    const labelClass = { rose: `flex items-center gap-2 text-sm font-bold ${isDark ? 'text-rose-300 group-hover:text-rose-400' : 'text-rose-600 group-hover:text-rose-700'} transition-colors`, emerald: `flex items-center gap-2 text-sm font-bold ${isDark ? 'text-emerald-300 group-hover:text-emerald-400' : 'text-emerald-600 group-hover:text-emerald-700'} transition-colors`, indigo: `flex items-center gap-2 text-sm font-bold ${isDark ? 'text-indigo-300 group-hover:text-indigo-400' : 'text-indigo-600 group-hover:text-indigo-700'} transition-colors` }[activeColor]
    const categoryHoverClass = { rose: isDark ? 'hover:border-rose-500/50' : 'hover:border-rose-400', emerald: isDark ? 'hover:border-emerald-500/50' : 'hover:border-emerald-400', indigo: isDark ? 'hover:border-indigo-500/50' : 'hover:border-indigo-400' }[activeColor]
    const dollarSignClass = { rose: 'text-rose-500', emerald: 'text-emerald-500', indigo: 'text-indigo-500' }[activeColor]

    const evaluateExpression = (expr) => {
        if (!expr) return 0
        const hasOperators = /[+\-*/]/.test(expr)
        if (!hasOperators) {
            return parseInt(expr.toString().replace(/\D/g, ''), 10) || 0
        }

        const cleaned = expr.replace(/\./g, '').replace(/[^0-9+\-*/().]/g, '')
        try {
            const result = Function(`"use strict"; return (${cleaned})`)()
            return typeof result === 'number' && !isNaN(result) && isFinite(result) ? Math.round(result) : 0
        } catch {
            return 0
        }
    }

    const handleAmountBlur = () => {
        const evaluated = evaluateExpression(amount)
        if (evaluated > 0) {
            setAmount(formatCLP(evaluated))
        } else {
            setAmount('')
        }
    }

    // Default gradients for fallback if activeTheme is not provided fully
    const textGradientClass = activeTheme ? (isDark ? activeTheme.textGradient : activeTheme.textGradientLight) : (isDark ? 'from-indigo-400 to-purple-400' : 'from-indigo-600 to-purple-600')
    const primaryButtonClass = activeTheme ? `${activeTheme.accentBgColor} ${activeTheme.accentHoverBgColor}` : 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'
    const iconClass = activeTheme ? activeTheme.accentGlowText : 'text-indigo-400'

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${textGradientClass} mb-6 flex items-center gap-3 transition-colors duration-500`}>
                {editingId ? <FontAwesomeIcon icon={faSave} className={`${iconClass}`} /> : <FontAwesomeIcon icon={faPlusCircle} className={`${iconClass}`} />}
                {editingId ? 'Editar Movimiento' : 'Nuevo Movimiento'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="group">
                    <label className={`${labelClass} mb-2`}>
                        <FontAwesomeIcon icon={faCalendarDay} /> Fecha:
                    </label>
                    <DatePicker
                        selected={expenseDate}
                        onChange={(date) => setExpenseDate(date)}
                        dateFormat="dd 'de' MMMM, yyyy"
                        locale={es}
                        calendarClassName={`aura-datepicker-${activeColor}`}
                        wrapperClassName="w-full"
                        className={`block w-full px-5 py-4 ${s.input} ${focusRingClass} rounded-2xl font-bold capitalize transition-all cursor-pointer shadow-inner text-center sm:text-left ${activeTheme ? activeTheme.accentGlowText : (isDark ? 'text-indigo-400' : 'text-indigo-600')}`}
                    />
                    {errors.expenseDate && <p className="mt-2 text-sm text-rose-400 font-bold animate-pulse">{errors.expenseDate}</p>}
                </div>

                <div className="group">
                    <label htmlFor="descriptionInput" className={`${labelClass} mb-2`}>
                        <FontAwesomeIcon icon={faTags} /> Descripción:
                    </label>
                    <input
                        type="text"
                        id="descriptionInput"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Ej: Salida fin de semana"
                        className={`block w-full px-5 py-4 ${s.input} ${focusRingClass} rounded-2xl font-medium transition-all shadow-inner`}
                    />
                    {errors.description && <p className="mt-2 text-sm text-rose-400 font-bold animate-pulse">{errors.description}</p>}
                </div>

                <div className="group">
                    <label htmlFor="amountInput" className={`${labelClass} mb-2`}>
                        <FontAwesomeIcon icon={faDollarSign} /> Monto:
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <span className={`${dollarSignClass} font-extrabold text-lg transition-colors`}>$</span>
                        </div>
                        <input
                            type="text"
                            id="amountInput"
                            value={amount}
                            onChange={handleAmountChange}
                            onBlur={handleAmountBlur}
                            placeholder="0"
                            className={`block w-full pl-10 pr-5 py-4 ${s.input} ${focusRingClass} rounded-2xl font-bold text-lg transition-all shadow-inner`}
                        />
                    </div>
                    {errors.amount && <p className="mt-2 text-sm text-rose-400 font-bold animate-pulse">{errors.amount}</p>}
                </div>

                {/* Categoría Grid Selector */}
                <div className="group">
                    <label className={`${labelClass} mb-3`}>
                        <FontAwesomeIcon icon={faTags} /> Categoría del Gasto:
                    </label>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                        {categories.map(cat => {
                            const isActive = category === cat.id
                            return (
                                <button
                                    key={cat.id}
                                    type="button"
                                    onClick={() => setCategory(cat.id)}
                                    className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 transform select-none cursor-pointer focus:outline-none ${focusRingClass} ${isActive ? cat.activeClass : `${isDark ? 'border-slate-700' : 'border-slate-200'} ${categoryHoverClass} ${cat.colorClass}`
                                        }`}
                                >
                                    <span className="text-2xl mb-1.5">{cat.emoji}</span>
                                    <span className={`text-xs font-black tracking-wide uppercase ${isDark ? 'text-slate-100' : 'text-slate-700'}`}>{cat.name}</span>
                                </button>
                            )
                        })}
                    </div>
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        className={`flex-1 ${primaryButtonClass} text-white font-extrabold py-4 px-6 rounded-2xl focus:outline-none focus:ring-2 focus:ring-white/20 transition-all duration-300 transform hover:-translate-y-1 shadow-lg flex items-center justify-center gap-2 cursor-pointer select-none`}
                    >
                        {editingId ? <><FontAwesomeIcon icon={faSave} /> Guardar Cambios</> : <><FontAwesomeIcon icon={faPlusCircle} /> Agregar</>}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className={`flex-1 ${isDark ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'} font-extrabold py-4 px-6 rounded-2xl transition-all duration-300 transform hover:-translate-y-1 flex items-center justify-center gap-2 cursor-pointer select-none`}
                        >
                            <FontAwesomeIcon icon={faTimesCircle} /> Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}

export default ExpenseForm