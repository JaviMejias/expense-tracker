import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function SummaryCard({ title, value, icon, isDark, className = '', titleClass = '', valueClass = '' }) {
    return (
        <div className={`relative overflow-hidden rounded-3xl p-6 text-center transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group ${className}`}>
            <div className="absolute inset-0 bg-white/5 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
            <p className={`flex items-center justify-center gap-2 text-xs font-black ${isDark ? 'text-slate-300' : 'text-slate-600'} uppercase tracking-widest mb-2 ${titleClass}`}>
                <FontAwesomeIcon icon={icon} /> {title}
            </p>
            <p className={`text-3xl font-extrabold ${isDark ? 'text-white' : 'text-slate-800'} drop-shadow-sm ${valueClass}`}>
                {value}
            </p>
        </div>
    )
}

export default SummaryCard