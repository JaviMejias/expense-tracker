import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { formatCLP } from '../utils/currency'
import { faEdit, faTrash } from '@fortawesome/free-solid-svg-icons'
import CustomButton from './CustomButton'
import CategoryBadge from './CategoryBadge'
import { motion } from 'framer-motion'
import { faHandHoldingUsd, faBan, faHandshake } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function ExpenseListItem({ expense, index = 0, isSelected, onToggleSelect, onEdit, onDelete, onReimburse, onForgive, categoryStyle, s, aura, activeTheme, isDark }) {
    const isReimbursable = expense.isReimbursable && !expense.isForgiven
    const isFullyReimbursed = isReimbursable && (expense.reimbursedAmount || 0) >= expense.amount
    return (
        <motion.div
            layout
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
            transition={{ type: 'spring', stiffness: 600, damping: 35, mass: 1, delay: Math.min(index * 0.03, 0.5) }}
            onClick={() => onToggleSelect(expense.id)}
            className={`group flex flex-row items-start sm:items-center p-5 border hover:-translate-y-1 gap-4 rounded-2xl hover:shadow-lg cursor-pointer`}
        >
            <div className={`flex items-center self-stretch pr-1 ${isSelected ? aura.listSelected : aura.listUnselected} rounded-2xl border transition-all duration-300 hover:-translate-y-1 gap-4`}
                style={{ display: 'none' }} // hidden, just using parent styling
            />
            <div className="flex items-center self-stretch pr-1" onClick={(e) => e.stopPropagation()}>
                <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => onToggleSelect(expense.id)}
                    className={`w-5 h-5 rounded-md transition-all duration-200 cursor-pointer scale-100 ${isSelected ? 'scale-110' : ''} ${aura.listCheckbox}`}
                />
            </div>

            <div className={`flex-1 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${isSelected ? aura.listSelected : aura.listUnselected} rounded-2xl border p-3 -m-1 transition-all duration-300`}>
                <div className="flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                        <p className={`font-extrabold ${s.bodyText} text-lg transition-colors ${aura.listHoverText}`}>{expense.description}</p>
                        <CategoryBadge cat={categoryStyle} />
                    </div>
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 mt-2 sm:items-center">
                        <p className="text-base font-black text-rose-400 bg-rose-400/10 border border-rose-400/20 px-3 py-1 rounded-lg">
                            -${formatCLP(expense.amount)}
                        </p>
                        <span className={`text-sm font-bold capitalize ${activeTheme ? (isDark ? `${activeTheme.accentGlowText} bg-white/5 border-white/10` : `${activeTheme.accentGlowText} bg-black/5 border-black/10`) : (isDark ? 'text-indigo-300 bg-indigo-400/10 border-indigo-400/20' : 'text-indigo-700 bg-indigo-50 border-indigo-100')} px-3 py-1 rounded-lg border`}>
                            {format(parseISO(expense.date), "dd MMMM yyyy", { locale: es })}
                        </span>
                        {isReimbursable && (
                            <div className={`flex items-center gap-2 px-3 py-1 rounded-lg border text-sm font-bold ${isFullyReimbursed ? 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20' : 'text-amber-500 bg-amber-500/10 border-amber-500/20'}`}>
                                <FontAwesomeIcon icon={faHandshake} />
                                {isFullyReimbursed ? 'Pagado' : `Devuelto: $${formatCLP(expense.reimbursedAmount || 0)} / $${formatCLP(expense.amount)}`}
                            </div>
                        )}
                    </div>
                </div>
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all duration-300 sm:translate-x-2 sm:group-hover:translate-x-0" onClick={(e) => e.stopPropagation()}>
                    {isReimbursable && !isFullyReimbursed && (
                        <>
                            <CustomButton onClick={() => onReimburse(expense)} variant="primary" icon={faHandHoldingUsd} className="flex-1 sm:flex-none py-2 px-4 text-sm" activeTheme={activeTheme} isDark={isDark}>
                                Recibir Pago
                            </CustomButton>
                            <CustomButton onClick={() => onForgive(expense)} variant="secondary" icon={faBan} className="flex-1 sm:flex-none py-2 px-4 text-sm" isDark={isDark}>
                                Perdonar Deuda
                            </CustomButton>
                        </>
                    )}
                    <CustomButton onClick={() => onEdit(expense)} variant="warning" icon={faEdit} className="flex-1 sm:flex-none py-2 px-4 text-sm">
                        Editar
                    </CustomButton>
                    <CustomButton onClick={() => onDelete(expense)} variant="danger" icon={faTrash} className="flex-1 sm:flex-none py-2 px-4 text-sm">
                        Eliminar
                    </CustomButton>
                </div>
            </div>
        </motion.div>
    )
}

export default ExpenseListItem