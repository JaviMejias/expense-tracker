import { formatCLP } from '../utils/currency'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCog } from '@fortawesome/free-solid-svg-icons'
import ProgressBar from './ProgressBar'

function BudgetCategoryItem({ cat, total, limit, catPercent, catPercentOfTotal, isExceeded, s, aura, isDark, onSetLimit }) {
    return (
        <div className={`${s.itemBg} p-4 rounded-2xl flex flex-col justify-between hover:border-indigo-500/20 transition-all duration-300`}>
            <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                    <span className="text-lg">{cat.emoji}</span>
                    <span className={`text-sm font-extrabold ${s.bodyText}`}>{cat.name}</span>
                </div>
                <div className="flex items-center gap-2">
                    {limit > 0 && (
                        <span className={`text-[9px] font-black px-2 py-0.5 rounded-md border ${isExceeded
                            ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 animate-pulse'
                            : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
                            }`}>
                            {isExceeded ? 'EXCEDIDO' : 'ACTIVO'}
                        </span>
                    )}
                    <span className={`text-xs font-bold px-2 py-0.5 rounded-lg select-none border ${aura.badge}`}>
                        {limit > 0 ? `${catPercent.toFixed(0)}%` : `${catPercentOfTotal.toFixed(0)}%`}
                    </span>
                    <button
                        type="button"
                        onClick={() => onSetLimit(cat.id, cat.name)}
                        className={`${isDark ? 'text-slate-500' : 'text-slate-400'} ${aura.hoverBorder} p-1 transition-all cursor-pointer select-none border border-transparent rounded-md`}
                        title="Definir límite de presupuesto"
                    >
                        <FontAwesomeIcon icon={faCog} className="text-xs" />
                    </button>
                </div>
            </div>
            <div className="flex items-end justify-between gap-4 mt-2">
                <div className="flex-1 mb-1">
                    <ProgressBar percent={catPercent} colorClass={isExceeded ? 'bg-gradient-to-r from-rose-500 to-red-600 animate-pulse' : `bg-gradient-to-r ${cat.color}`} trackClass={s.progressTrack} size="sm" />
                </div>
                <div className="text-right flex flex-col">
                    <span className="text-sm font-black text-rose-500">-${formatCLP(total)}</span>
                    {limit > 0 && <span className={`text-[9px] font-bold ${s.bodyTextMuted} mt-0.5`}>Límite: ${formatCLP(limit)}</span>}
                </div>
            </div>
        </div>
    )
}

export default BudgetCategoryItem