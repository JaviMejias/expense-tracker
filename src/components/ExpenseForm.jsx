import { es } from 'date-fns/locale'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlusCircle, faSave, faTimesCircle, faTags, faDollarSign, faCalendarDay } from '@fortawesome/free-solid-svg-icons'
import { formatCLP } from '../utils/currency'
import CustomDatePicker from './CustomDatePicker'
import CustomButton from './CustomButton'
import CustomInput from './CustomInput'
import { useThemeStyles } from '../hooks/useThemeStyles'
import CategorySelector from './CategorySelector'

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
    const { s, isDark, activeColor, textGradientClass, focusRingClass, aura } = useThemeStyles(themeMode, activeTheme)

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${textGradientClass} mb-6 flex items-center gap-3 transition-colors duration-500`}>
                {editingId ? <FontAwesomeIcon icon={faSave} className={aura.icon} /> : <FontAwesomeIcon icon={faPlusCircle} className={aura.icon} />}
                {editingId ? 'Editar Movimiento' : 'Nuevo Movimiento'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="group">
                    <label className={`flex items-center gap-2 text-sm font-bold ${aura.label} transition-colors mb-2`}>
                        <FontAwesomeIcon icon={faCalendarDay} /> Fecha:
                    </label>
                    <CustomDatePicker
                        selected={expenseDate}
                        onChange={(date) => setExpenseDate(date)}
                        dateFormat="dd 'de' MMMM, yyyy"
                        activeColor={activeColor}
                        activeTheme={activeTheme}
                        isDark={isDark}
                        s={s}
                        focusRingClass={focusRingClass}
                        className="px-5 py-4 rounded-2xl font-bold capitalize"
                    />
                    {errors.expenseDate && <p className="mt-2 text-sm text-rose-400 font-bold animate-pulse">{errors.expenseDate}</p>}
                </div>

                <div className="group">
                    <label htmlFor="descriptionInput" className={`flex items-center gap-2 text-sm font-bold ${aura.label} transition-colors mb-2`}>
                        <FontAwesomeIcon icon={faTags} /> Descripción:
                    </label>
                    <CustomInput
                        id="descriptionInput"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Ej: Salida fin de semana"
                        s={s}
                        focusRingClass={focusRingClass}
                        className="py-4 rounded-2xl font-medium"
                    />
                    {errors.description && <p className="mt-2 text-sm text-rose-400 font-bold animate-pulse">{errors.description}</p>}
                </div>

                <div className="group">
                    <label htmlFor="amountInput" className={`flex items-center gap-2 text-sm font-bold ${aura.label} transition-colors mb-2`}>
                        <FontAwesomeIcon icon={faDollarSign} /> Monto:
                    </label>
                    <CustomInput
                        id="amountInput"
                        value={amount}
                        onChange={handleAmountChange}
                        isAmount={true}
                        setEvaluatedAmount={setAmount}
                        iconClass={aura.icon}
                        placeholder="0"
                        s={s}
                        focusRingClass={focusRingClass}
                        className="py-4 rounded-2xl font-bold text-lg"
                    />
                    {errors.amount && <p className="mt-2 text-sm text-rose-400 font-bold animate-pulse">{errors.amount}</p>}
                </div>

                <div className="group">
                    <label className={`flex items-center gap-2 text-sm font-bold ${aura.label} transition-colors mb-3`}>
                        <FontAwesomeIcon icon={faTags} /> Categoría del Gasto:
                    </label>
                    <CategorySelector
                        categories={categories}
                        selectedId={category}
                        onSelect={setCategory}
                        isDark={isDark}
                        focusRingClass={focusRingClass}
                        hoverClass={aura.hoverItem}
                    />
                </div>

                <div className="flex gap-4 pt-4">
                    <CustomButton
                        type="submit"
                        variant="primary"
                        icon={editingId ? faSave : faPlusCircle}
                        className="flex-1 py-4 px-6 !rounded-2xl"
                        activeTheme={activeTheme}
                        isDark={isDark}
                    >
                        {editingId ? 'Guardar Cambios' : 'Agregar'}
                    </CustomButton>
                    {editingId && (
                        <CustomButton
                            type="button"
                            onClick={handleCancelEdit}
                            variant="secondary"
                            icon={faTimesCircle}
                            className="flex-1 py-4 px-6 !rounded-2xl"
                            isDark={isDark}
                        >
                            Cancelar
                        </CustomButton>
                    )}
                </div>
            </form>
        </div>
    )
}

export default ExpenseForm