import { format, parse } from 'date-fns'
import { es } from 'date-fns/locale'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faCheck } from '@fortawesome/free-solid-svg-icons'
import { formatCLP } from '../utils/currency'
import { isMonthInRange, getInstallmentNum } from '../utils/installments'
import CategoryBadge from './CategoryBadge'
import ProgressBar from './ProgressBar'

function InstallmentItem({ inst, currentMonthKey, categoryStyle, s, aura, isDark, onApply, onSkip, onDelete }) {
    const appliedCount = (inst.appliedMonths || []).length
    const isCompleted = appliedCount >= inst.totalInstallments
    const isInRange = isMonthInRange(currentMonthKey, inst)
    const isApplied = (inst.appliedMonths || []).includes(currentMonthKey)
    const isSkipped = (inst.skippedMonths || []).includes(currentMonthKey)
    const isPending = isInRange && !isApplied && !isSkipped && !isCompleted
    const installmentNum = isInRange ? getInstallmentNum(currentMonthKey, inst) : null
    const progress = isCompleted ? 100 : (appliedCount / inst.totalInstallments) * 100

    const currentMonthName = (() => {
        try { return format(parse(currentMonthKey, 'MM-yyyy', new Date()), 'MMMM', { locale: es }) }
        catch { return '' }
    })()

    const firstPaymentName = (() => {
        try { return format(parse(inst.firstPaymentMonth, 'MM-yyyy', new Date()), 'MMMM yyyy', { locale: es }) }
        catch { return inst.firstPaymentMonth }
    })()

    return (
        <div className={`${s.itemBg} p-5 rounded-2xl border transition-all duration-300
            ${isCompleted
                ? (isDark ? 'border-emerald-500/20 opacity-70' : 'border-emerald-200 opacity-70')
                : isPending
                    ? (isDark ? 'border-amber-500/40 shadow-[0_0_20px_rgba(245,158,11,0.07)]' : 'border-amber-300')
                    : (isDark ? 'border-slate-700/40' : 'border-slate-200')
            }`}
        >
            {/* Header */}
            <div className="flex items-start justify-between gap-3 mb-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                    <span className="text-2xl select-none">💳</span>
                    <div className="flex-1 min-w-0">
                        <p className={`font-black text-sm truncate ${isDark ? 'text-slate-100' : 'text-slate-800'}`}>
                            {inst.description}
                        </p>
                        <div className="flex items-center gap-2 flex-wrap mt-1">
                            {categoryStyle && <CategoryBadge cat={categoryStyle} />}
                            {inst.hasInterest && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border
                                    ${isDark ? 'bg-amber-500/15 text-amber-300 border-amber-500/25' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                                    Con interés
                                </span>
                            )}
                            {isPending && (
                                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border animate-pulse
                                    ${isDark ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                                    ⚠️ Pendiente {currentMonthName}
                                </span>
                            )}
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => onDelete(inst.id)}
                    className={`transition-colors p-1.5 rounded-lg cursor-pointer flex-shrink-0
                        ${isDark ? 'text-slate-600 hover:text-rose-400 hover:bg-rose-500/10' : 'text-slate-300 hover:text-rose-500 hover:bg-rose-50'}`}
                    title="Eliminar cuota"
                >
                    <FontAwesomeIcon icon={faTrash} className="text-sm" />
                </button>
            </div>

            {/* Barra de progreso */}
            <div className="mb-3">
                <div className="flex justify-between items-center mb-1.5">
                    <span className={`text-xs font-bold ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                        {isCompleted
                            ? '🎉 ¡Completada!'
                            : `${appliedCount} de ${inst.totalInstallments} cuotas pagadas`}
                    </span>
                    <span className={`text-sm font-black ${isDark ? 'text-slate-200' : 'text-slate-700'}`}>
                        ${formatCLP(inst.monthlyAmount)}
                        <span className={`text-xs font-bold ml-0.5 ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>/mes</span>
                    </span>
                </div>
                <ProgressBar
                    percent={progress}
                    colorClass={isCompleted
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400'
                        : 'bg-gradient-to-r from-indigo-500 to-violet-500'}
                    trackClass={s.progressTrack}
                    glowClass=""
                />
            </div>

            {/* Acciones según estado del mes actual */}
            {isCompleted ? (
                <div className={`text-center text-xs font-bold py-2 rounded-xl
                    ${isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-600 border border-emerald-200'}`}>
                    🎉 Todas las cuotas han sido pagadas
                </div>
            ) : !isInRange ? (
                <div className={`text-center text-xs font-bold py-2 rounded-xl
                    ${isDark ? 'bg-slate-800/60 text-slate-500 border border-slate-700/40' : 'bg-slate-100 text-slate-400 border border-slate-200'}`}>
                    Primer pago: {firstPaymentName}
                </div>
            ) : isApplied ? (
                <div className={`text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2
                    ${isDark ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border border-emerald-200'}`}>
                    <FontAwesomeIcon icon={faCheck} />
                    Cuota {installmentNum}/{inst.totalInstallments} registrada en {currentMonthName}
                </div>
            ) : isSkipped ? (
                <div className="flex gap-2 flex-wrap">
                    <div className={`flex-1 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-2
                        ${isDark ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' : 'bg-amber-50 text-amber-600 border border-amber-200'}`}>
                        ⏭️ Saltada en {currentMonthName}
                    </div>
                    <button
                        onClick={() => onApply(inst.id, currentMonthKey)}
                        className={`text-xs font-bold px-3 py-2 rounded-xl border transition-all cursor-pointer
                            ${isDark ? 'border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/15' : 'border-indigo-300 text-indigo-600 hover:bg-indigo-50'}`}
                    >
                        Aplicar de todas formas
                    </button>
                </div>
            ) : (
                <div className="flex gap-2">
                    <button
                        onClick={() => onApply(inst.id, currentMonthKey)}
                        className={`flex-1 text-xs font-bold px-3 py-2.5 rounded-xl border transition-all cursor-pointer
                            ${isDark
                                ? 'bg-indigo-500/15 border-indigo-500/30 text-indigo-300 hover:bg-indigo-500/25'
                                : 'bg-indigo-50 border-indigo-200 text-indigo-700 hover:bg-indigo-100'}`}
                    >
                        ✅ Aplicar cuota {installmentNum}/{inst.totalInstallments}
                    </button>
                    <button
                        onClick={() => onSkip(inst.id, currentMonthKey)}
                        className={`flex-1 text-xs font-bold px-3 py-2.5 rounded-xl border transition-all cursor-pointer
                            ${isDark
                                ? 'border-slate-600/50 text-slate-400 hover:bg-slate-800 hover:text-slate-300'
                                : 'border-slate-300 text-slate-500 hover:bg-slate-100'}`}
                    >
                        ⏭️ Saltar mes
                    </button>
                </div>
            )}
        </div>
    )
}

export default InstallmentItem
