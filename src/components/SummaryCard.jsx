import CountUp from 'react-countup'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function SummaryCard({ title, value, icon, isDark, className = '', titleClass = '', valueClass = '' }) {
    // Extract numeric value from string like "$1.234.567"
    const numericValue = typeof value === 'string'
        ? parseInt(value.replace(/\D/g, ''), 10) || 0
        : value

    const isNegative = typeof value === 'string' && value.startsWith('-$')

    return (
        <div className={`group p-5 rounded-2xl border transition-all duration-300 hover:-translate-y-1 hover:shadow-xl ${className}`}>
            <div className="flex items-center gap-3 mb-3">
                {typeof icon === 'string' ? (
                    <span className={`text-lg font-black opacity-60 ${titleClass}`}>{icon}</span>
                ) : (
                    <FontAwesomeIcon icon={icon} className={`text-sm opacity-70 ${titleClass}`} />
                )}
                <p className={`text-xs font-black uppercase tracking-widest ${titleClass || (isDark ? 'text-slate-400' : 'text-slate-500')}`}>
                    {title}
                </p>
            </div>
            <p className={`text-2xl sm:text-3xl font-black tabular-nums ${valueClass}`}>
                {isNegative ? '-' : ''}$
                <CountUp
                    end={numericValue}
                    duration={1.2}
                    separator="."
                    useEasing={true}
                    preserveValue={true}
                />
            </p>
        </div>
    )
}

export default SummaryCard