import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import { formatCLP } from '../utils/currency'
import { faCheckCircle, faTimes } from '@fortawesome/free-solid-svg-icons'
import CustomButton from './CustomButton'
import CategoryBadge from './CategoryBadge'

function FixedExpenseItem({ item, categoryStyle, weekDays, currentMonthDate, s, aura, isDark, onApplyToMonth, onDelete }) {
    return (
        <div className={`flex flex-col sm:flex-row justify-between items-center ${isDark ? 'bg-slate-800/80 border-slate-700' : 'bg-white border-slate-200/80 shadow-md shadow-slate-100/50'} ${aura.hoverItem} p-5 rounded-2xl border gap-4 transition-all hover:-translate-y-1`}>
            <div className="flex-1 w-full">
                <div className="flex flex-wrap items-center gap-2">
                    <p className={`font-extrabold ${s.bodyText}`}>{item.description}</p>
                    <CategoryBadge cat={categoryStyle} />
                </div>
                <p className="text-sm font-bold text-rose-400 mt-1">${formatCLP(item.amount)} {item.type === 'weekly' && 'por día'}</p>
                {item.type === 'weekly' && (
                    <div className="flex gap-1 mt-2">
                        {item.days.map(d => {
                            const dayName = weekDays.find(w => w.id === d)?.name
                            return <span key={d} className={`text-xs font-bold px-2 py-1 rounded-md border ${aura.dayBadge}`}>{dayName}</span>
                        })}
                    </div>
                )}
            </div>
            <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                <CustomButton onClick={() => onApplyToMonth(item)} variant="custom" icon={faCheckCircle} className={`flex-1 sm:flex-none py-3 px-5 capitalize ${aura.applyBtn}`}>
                    Añadir a {format(currentMonthDate, 'MMMM', { locale: es })}
                </CustomButton>
                <CustomButton onClick={() => onDelete(item.id)} variant="danger" icon={faTimes} className="py-3 px-4" />
            </div>
        </div>
    )
}

export default FixedExpenseItem