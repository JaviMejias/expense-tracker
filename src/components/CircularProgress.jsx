function CircularProgress({ percent, color, isDark }) {
    const radius = 32
    const circumference = 2 * Math.PI * radius
    const strokeDashoffset = circumference - (Math.min(percent, 100) / 100) * circumference

    const svgColors = {
        rose: '#f43f5e',
        blue: '#3b82f6',
        amber: '#f59e0b',
        emerald: '#10b981',
        pink: '#ec4899',
        violet: '#8b5cf6',
        sky: '#06b6d4',
        slate: '#64748b'
    }

    return (
        <div className="relative w-20 h-20 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90">
                <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke={isDark ? '#1e293b' : '#e2e8f0'}
                    strokeWidth="6"
                    fill="transparent"
                />
                <circle
                    cx="40"
                    cy="40"
                    r={radius}
                    stroke={svgColors[color] || '#6366f1'}
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000 ease-out"
                />
            </svg>
            <div className={`absolute inset-0 flex items-center justify-center text-xs font-black ${isDark ? 'text-slate-100' : 'text-slate-800'} select-none`}>
                {percent.toFixed(0)}%
            </div>
        </div>
    )
}

export default CircularProgress