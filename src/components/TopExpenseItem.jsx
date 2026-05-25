import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { formatCLP } from '../utils/currency'
import CategoryBadge from './CategoryBadge'

function TopExpenseItem({ expense, idx, categoryStyle, s, aura, isDark }) {
    return (
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between p-4 ${isDark ? 'bg-slate-900/40 border-slate-800' : 'bg-white border-slate-200 shadow-sm text-slate-800'} ${aura.cardHover} border rounded-2xl transition-all duration-300 gap-3`}>
            <div className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black ${aura.badge}`}>
                    {idx + 1}
                </span>
                <div>
                    <div className="flex flex-wrap items-center gap-2">
                        <p className={`font-extrabold ${s.bodyText}`}>{expense.description}</p>
                        <CategoryBadge cat={categoryStyle} className="text-[9px] px-2 py-0.5" />
                    </div>
                    <p className={`text-[10px] font-bold ${s.bodyTextMuted} mt-1 uppercase tracking-wide`}>{format(parseISO(expense.date), 'dd MMMM yyyy', { locale: es })}</p>
                </div>
            </div>
            <div className="text-right">
                <span className="text-base font-black text-rose-400 bg-rose-400/10 border border-rose-400/20 px-3 py-1 rounded-xl">-${formatCLP(expense.amount)}</span>
            </div>
        </div>
    )
}

export default TopExpenseItem