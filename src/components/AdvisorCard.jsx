import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function AdvisorCard({ title, text, icon, colorClass, iconColorClass = '', isDark, s }) {
    return (
        <div className={`p-5 rounded-2xl flex items-start gap-4 transition-all hover:scale-102 duration-300 ${colorClass}`}>
            <div className="w-10 h-10 rounded-xl bg-slate-900/50 flex items-center justify-center text-lg shrink-0 mt-1">
                <FontAwesomeIcon icon={icon} className={iconColorClass} />
            </div>
            <div className="space-y-1">
                <h4 className={`font-extrabold text-sm sm:text-base ${s.bodyText}`}>{title}</h4>
                <p className={`text-xs ${isDark ? 'text-slate-300' : 'text-slate-600'} leading-relaxed`}>{text}</p>
            </div>
        </div>
    )
}

export default AdvisorCard