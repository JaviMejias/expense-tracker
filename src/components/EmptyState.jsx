import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function EmptyState({ icon, message, subtitle, isDark, className = '' }) {
    const bgClass = isDark ? 'bg-slate-800/30 border-slate-700' : 'bg-slate-100/50 border-slate-200'
    const textClass = isDark ? 'text-slate-400' : 'text-slate-500'
    const subTextClass = isDark ? 'text-slate-500' : 'text-slate-400'

    return (
        <div className={`text-center py-16 border border-dashed rounded-3xl ${bgClass} ${className}`}>
            {icon && <FontAwesomeIcon icon={icon} className={`text-5xl mb-4 animate-pulse ${subTextClass}`} />}
            <p className={`font-bold text-lg ${textClass}`}>{message}</p>
            {subtitle && <p className={`text-sm mt-1 ${subTextClass}`}>{subtitle}</p>}
        </div>
    )
}

export default EmptyState