import { formatCLP } from '../utils/currency'

function BarChart({ data, maxSpend, isDark, s, aura }) {
    return (
        <div className="relative h-72 mt-4 mb-2">
            <div className="absolute inset-0 pt-10 pb-8 flex flex-col justify-between pointer-events-none z-0">
                {[4, 3, 2, 1, 0].map((step, idx) => (
                    <div key={idx} className="flex items-center w-full h-0">
                        <span className={`text-[9px] sm:text-[10px] font-bold ${s.bodyTextMuted} w-10 sm:w-16 text-right pr-2 sm:pr-4 shrink-0 truncate`}>
                            ${formatCLP(maxSpend * (step / 4))}
                        </span>
                        <div className={`flex-1 border-t ${isDark ? 'border-slate-700/50' : 'border-slate-200'} border-dashed`}></div>
                    </div>
                ))}
            </div>

            <div className="absolute inset-0 left-10 sm:left-16 pt-10 flex flex-col justify-end z-10 overflow-x-auto pb-2" style={{ scrollbarWidth: 'thin' }}>
                <div className="min-w-[450px] w-full h-full flex flex-col justify-end">
                    <div className="flex-1 flex items-end justify-around pb-0 z-10 w-full relative">
                        {data.map(month => {
                            const heightPercent = maxSpend > 0 ? (month.total / maxSpend) * 100 : 0
                            return (
                                <div key={month.key} className="relative flex flex-col items-center group w-full h-full justify-end">
                                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-950/95 border border-indigo-500/30 px-3 py-2 rounded-xl absolute bottom-[calc(100%+8px)] text-center shadow-xl z-20 whitespace-nowrap pointer-events-none">
                                        <p className="text-[10px] font-bold text-slate-400 capitalize">{month.fullName}</p>
                                        <p className="text-xs font-black text-rose-400 mt-0.5">${formatCLP(month.total)}</p>
                                    </div>
                                    {month.total > 0 && <div style={{ height: `${heightPercent}%`, minHeight: '4px' }} className={`w-5 sm:w-8 rounded-t-md transition-all duration-700 ease-out bg-gradient-to-t group-hover:opacity-80 ${aura.chartBar}`}></div>}
                                </div>
                            )
                        })}
                    </div>
                    <div className={`flex justify-around w-full border-t ${isDark ? 'border-slate-700/80' : 'border-slate-300'} pt-2 h-6`}>
                        {data.map(month => <span key={month.key} className={`text-[9px] sm:text-[10px] font-black ${s.bodyTextMuted} uppercase tracking-wide text-center w-full truncate`}>{month.name}</span>)}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default BarChart