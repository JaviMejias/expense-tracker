import CustomDatePicker from './CustomDatePicker'
import CustomInput from './CustomInput'
import CustomSelect from './CustomSelect'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSearchDollar } from '@fortawesome/free-solid-svg-icons'

const sortOptions = [
    { value: 'date-desc', label: '📅 Fecha: Reciente primero' },
    { value: 'date-asc', label: '📅 Fecha: Antiguo primero' },
    { value: 'amount-desc', label: '💰 Monto: Mayor a menor' },
    { value: 'amount-asc', label: '💰 Monto: Menor a mayor' },
    { value: 'desc-az', label: '🔤 Nombre: A-Z' }
]

function ExpenseListFilters({
    startDate, setStartDate,
    endDate, setEndDate,
    searchQuery, setSearchQuery,
    sortBy, setSortBy,
    setSelectedIds,
    activeColor, activeTheme, isDark, s, focusRingClass, aura
}) {
    return (
        <>
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
        </>
    )
}

export default ExpenseListFilters
