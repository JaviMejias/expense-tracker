function StatCard({ title, value, subtitle, icon, aura, s }) {
    return (
        <div className={`bg-gradient-to-br ${aura.gradient} p-6 border rounded-3xl flex items-center gap-4 transition-all`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl font-bold shadow-inner ${aura.boxBg}`}>
                {icon}
            </div>
            <div>
                <p className={`text-[10px] font-black ${aura.label} uppercase tracking-wider`}>{title}</p>
                <p className={`text-xl sm:text-2xl font-extrabold ${s.bodyText} mt-1 capitalize`}>{value}</p>
                {subtitle && <p className={`text-sm font-bold mt-0.5 ${aura.label}`}>{subtitle}</p>}
            </div>
        </div>
    )
}
export default StatCard