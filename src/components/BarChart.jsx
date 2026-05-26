import { formatCLP } from '../utils/currency'
import { ResponsiveContainer, BarChart as RechartsBarChart, Bar, XAxis, Tooltip, Cell, YAxis } from 'recharts'

function CustomTooltip({ active, payload, label }) {
    if (active && payload && payload.length) {
        return (
            <div className="bg-slate-950/95 border border-indigo-500/30 px-3 py-2 rounded-xl shadow-xl">
                <p className="text-[10px] font-bold text-slate-400 capitalize">{label}</p>
                <p className="text-xs font-black text-rose-400 mt-0.5">${formatCLP(payload[0].value)}</p>
            </div>
        )
    }
    return null
}

function BarChart({ data, maxSpend, isDark, s, aura }) {
    // Recharts handles its own scales, but we'll use maxSpend for domain if needed.
    // data is an array of objects: { key, name, fullName, total }
    
    // We can extract a solid hex color from aura.chartBar or use a default
    // Since aura.chartBar contains tailwind classes (like from-indigo-500 to-indigo-600), 
    // it's tricky to pass to Recharts directly (it expects hex or url(#grad)).
    // I'll define an SVG gradient and use it.
    
    const isRose = aura.chartBar.includes('rose')
    const isEmerald = aura.chartBar.includes('emerald')
    
    const colorStart = isRose ? '#f43f5e' : isEmerald ? '#10b981' : '#6366f1'
    const colorEnd = isRose ? '#e11d48' : isEmerald ? '#059669' : '#4f46e5'

    return (
        <div className="mt-4 mb-2 w-full flex-1">
            <ResponsiveContainer width="100%" height={280}>
                <RechartsBarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <defs>
                        <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor={colorStart} stopOpacity={0.9} />
                            <stop offset="100%" stopColor={colorEnd} stopOpacity={0.9} />
                        </linearGradient>
                    </defs>
                    <XAxis 
                        dataKey="name" 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: isDark ? '#94a3b8' : '#64748b', fontSize: 10, fontWeight: 900, fontFamily: 'inherit' }}
                        dy={10}
                    />
                    <YAxis 
                        axisLine={false} 
                        tickLine={false} 
                        tick={{ fill: isDark ? '#64748b' : '#94a3b8', fontSize: 10, fontWeight: 700, fontFamily: 'inherit' }}
                        tickFormatter={(value) => `$${formatCLP(value)}`}
                    />
                    <Tooltip content={<CustomTooltip />} cursor={{ fill: isDark ? '#1e293b' : '#f1f5f9', opacity: 0.5 }} />
                    <Bar dataKey="total" radius={[6, 6, 0, 0]} animationDuration={1000}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill="url(#barGradient)" />
                        ))}
                    </Bar>
                </RechartsBarChart>
            </ResponsiveContainer>
        </div>
    )
}

export default BarChart