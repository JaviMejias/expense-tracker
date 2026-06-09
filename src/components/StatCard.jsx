import CountUp from 'react-countup'

function StatCard({ title, value, subtitle, icon, aura, s }) {
    // Try to extract numeric part for countup
    const isMoneyValue = typeof value === 'string' && value.startsWith('$')
    const numericValue = isMoneyValue
        ? parseInt(value.replace(/\D/g, ''), 10) || 0
        : null

    return (
        <div className={`${s.itemBg} p-5 rounded-2xl flex items-center gap-4 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg group`}>
            <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${aura.gradient} border flex items-center justify-center text-base shrink-0 transition-transform duration-300 group-hover:scale-110`}>
                <span className={aura.icon}>{icon}</span>
            </div>
            <div>
                <p className={`text-[10px] font-black uppercase tracking-widest ${s.bodyTextMuted}`}>{title}</p>
                <p className={`text-xl font-black ${s.bodyText} mt-0.5 tabular-nums`}>
                    {isMoneyValue ? (
                        <>$<CountUp end={numericValue} duration={1.2} separator="." useEasing preserveValue /></>
                    ) : (
                        value
                    )}
                </p>
                {subtitle && (
                    <p className={`text-sm font-bold ${aura.icon} mt-0.5 tabular-nums`}>
                        {subtitle.startsWith('$') ? (
                            <>$<CountUp end={parseInt(subtitle.replace(/\D/g,''),10)||0} duration={1.2} separator="." useEasing preserveValue /></>
                        ) : subtitle}
                    </p>
                )}
            </div>
        </div>
    )
}

export default StatCard