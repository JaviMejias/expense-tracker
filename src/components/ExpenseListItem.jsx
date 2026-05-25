import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { formatCLP } from '../utils/currency'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import CustomButton from './CustomButton'
import CategoryBadge from './CategoryBadge'

function ExpenseListItem({ expense, isSelected, onToggleSelect, onEdit, onDelete, categoryStyle, s, aura, activeTheme, isDark }) {
    return (
        <div
            onClick={() => onToggleSelect(expense.id)}
            className={`group flex flex-row items-start sm:items-center p-5 border transition-all duration-300 hover:-translate-y-1 gap-4 rounded-2xl hover:shadow-lg cursor-pointer ${isSelected ? aura.listSelected : aura.listUnselected}`}
        >
            <div className="flex items-center self-stretch pr-1" onClick={(e) => e.stopPropagation()}>
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(expense.id)}
                    className={`w-5 h-5 rounded-md transition-all cursor-pointer ${aura.listCheckbox}`}
                />
            </div>

            <div className="flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className={`font-extrabold ${s.bodyText} text-lg transition-colors ${aura.listHoverText}`}>{expense.description}</p>
                        <CategoryBadge cat={categoryStyle} />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-2 sm:items-center">
                        <p className="text-base font-black text-rose-400 bg-rose-400/10 border border-rose-400/20 px-3 py-1 rounded-lg">-${formatCLP(expense.amount)}</p>
                        <span className={`text-sm font-bold capitalize ${activeTheme ? (isDark ? `${activeTheme.accentGlowText} bg-white/5 border-white/10` : `${activeTheme.accentGlowText} bg-black/5 border-black/10`) : (isDark ? 'text-indigo-300 bg-indigo-400/10 border-indigo-400/20' : 'text-indigo-700 bg-indigo-50 border-indigo-100')} px-3 py-1 rounded-lg`}>
                            {format(parseISO(expense.date), "dd MMMM yyyy", { locale: es })}
                        </span>
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300" onClick={(e) => e.stopPropagation()}>
                    <CustomButton onClick={() => onEdit(expense)} variant="warning" icon={faEdit} className="flex-1 sm:flex-none py-2 px-4 text-sm">
                        Editar
                    </CustomButton>
                    <CustomButton onClick={() => onDelete(expense)} variant="danger" icon={faTrash} className="flex-1 sm:flex-none py-2 px-4 text-sm">
                        Eliminar
                    </CustomButton>
                </div>
            </div>
        </div>
    )
}

export default ExpenseListItem