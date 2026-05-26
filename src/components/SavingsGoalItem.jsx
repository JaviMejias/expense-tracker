import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { formatCLP } from '../utils/currency'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faCalendarAlt, faTrash, faLightbulb } from '@fortawesome/free-solid-svg-icons'
import CustomButton from './CustomButton'
import CircularProgress from './CircularProgress'

function SavingsGoalItem({ goal, theme, percent, s, isDark, aura, monthsLeft, monthlySuggestion, onContribute, onDelete }) {
    const isCompleted = goal.currentSaved >= goal.targetAmount

    return (
        <div className={`group p-6 ${isDark ? 'bg-slate-800/60 border-slate-700/50 hover:border-indigo-500/30' : 'bg-white border-slate-200 shadow-md shadow-slate-100/30 hover:border-indigo-500/50'} border rounded-3xl transition-all duration-300 flex flex-col gap-4 relative overflow-hidden`}>
            {/* Header row */}
            <div className="flex items-start gap-4">
                <div className="flex-1 space-y-2">
                    <div>
                        <span className={`text-[10px] font-black px-2 py-0.5 rounded-md border capitalize inline-block mb-1.5 transition-colors ${theme.bg}`}>
                            Meta {theme.label}
                        </span>
                        <h4 className={`text-xl font-extrabold ${s.bodyText} leading-snug`}>{goal.title}</h4>
                    </div>

                    <div className="flex flex-col gap-1">
                        <div className={`flex justify-between text-xs font-bold ${s.bodyTextMuted}`}>
                            <span>Ahorrado:</span>
                            <span className={`${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                                ${formatCLP(goal.currentSaved)} / ${formatCLP(goal.targetAmount)}
                            </span>
                        </div>

                        {goal.deadline && (
                            <div className={`flex items-center gap-1.5 text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'} font-bold mt-1`}>
                                <FontAwesomeIcon icon={faCalendarAlt} className="opacity-70" />
                                <span>Límite: {format(parseISO(goal.deadline), "d 'de' MMMM, yyyy", { locale: es })}</span>
                                {monthsLeft !== null && !isCompleted && (
                                    <span className={`ml-1 px-1.5 py-0.5 rounded-md text-[9px] font-black uppercase ${isDark ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
                                        {monthsLeft} {monthsLeft === 1 ? 'mes' : 'meses'} restantes
                                    </span>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                <CircularProgress percent={percent} color={goal.color} isDark={isDark} />
            </div>

            {/* Monthly suggestion pill */}
            {monthlySuggestion && !isCompleted && (
                <div className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border ${isDark ? 'bg-emerald-500/5 border-emerald-500/15' : 'bg-emerald-50 border-emerald-200'}`}>
                    <FontAwesomeIcon icon={faLightbulb} className={`text-sm ${isDark ? 'text-emerald-400' : 'text-emerald-600'} shrink-0`} />
                    <div className="min-w-0">
                        <p className={`text-[9px] font-black uppercase tracking-widest ${isDark ? 'text-emerald-500' : 'text-emerald-700'}`}>Sugerencia mensual</p>
                        <p className={`text-xs font-bold mt-0.5 ${isDark ? 'text-slate-300' : 'text-slate-600'} truncate`}>
                            Ahorra
                            <span className={`font-black ${isDark ? 'text-emerald-300' : 'text-emerald-600'}`}> ${formatCLP(monthlySuggestion)}/mes </span>
                            para cumplir tu meta a tiempo.
                        </p>
                    </div>
                </div>
            )}

            {/* Action */}
            {!isCompleted ? (
                <CustomButton onClick={() => onContribute(goal)} variant="custom" className={`${aura.btn} font-extrabold text-[10px] uppercase tracking-wider px-4 py-2 !rounded-xl shadow-md`}>
                    Aportar 💰
                </CustomButton>
            ) : (
                <span className="bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[10px] font-extrabold uppercase tracking-widest px-3 py-1 rounded-xl inline-block animate-pulse">
                    Meta Completada 🎉
                </span>
            )}

            <button type="button" onClick={() => onDelete(goal.id)} className={`absolute top-4 right-4 ${isDark ? 'bg-slate-900/50 border-slate-700/50 hover:bg-rose-500/20 hover:border-rose-500/50 text-slate-400 hover:text-rose-400' : 'bg-slate-100/80 border-slate-200 hover:bg-rose-500 hover:text-white text-slate-500'} border w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer opacity-100 sm:opacity-0 group-hover:opacity-100 select-none`} title="Eliminar meta">
                <FontAwesomeIcon icon={faTrash} className="text-[10px]" />
            </button>
        </div>
    )
}

export default SavingsGoalItem