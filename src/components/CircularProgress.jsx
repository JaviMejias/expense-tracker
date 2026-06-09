import { useEffect, useRef, useState } from 'react'

function CircularProgress({ percent, color, isDark }) {
    const radius = 32
    const circumference = 2 * Math.PI * radius
    const targetOffset = circumference - (Math.min(percent, 100) / 100) * circumference

    const [strokeDashoffset, setStrokeDashoffset] = useState(circumference)
    const [displayPercent, setDisplayPercent] = useState(0)
    const circleRef = useRef(null)
    const [hasAnimated, setHasAnimated] = useState(false)

    const svgColors = {
        rose: '#f43f5e',
        blue: '#3b82f6',
        amber: '#f59e0b',
        emerald: '#10b981',
        pink: '#ec4899',
        violet: '#8b5cf6',
        indigo: '#6366f1',
        sky: '#06b6d4',
        slate: '#64748b'
    }

    const strokeColor = svgColors[color] || '#6366f1'

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true)
                    setTimeout(() => {
                        setStrokeDashoffset(targetOffset)
                        // Animate displayed percentage
                        const duration = 900
                        const start = performance.now()
                        const animate = (now) => {
                            const elapsed = now - start
                            const progress = Math.min(elapsed / duration, 1)
                            const eased = 1 - Math.pow(1 - progress, 3)
                            setDisplayPercent(Math.round(percent * eased))
                            if (progress < 1) requestAnimationFrame(animate)
                        }
                        requestAnimationFrame(animate)
                    }, 150)
                }
            },
            { threshold: 0.3 }
        )
        if (circleRef.current) observer.observe(circleRef.current)
        return () => observer.disconnect()
    }, [percent, hasAnimated, targetOffset])

    // Re-trigger when percent changes after first animation
    useEffect(() => {
        if (hasAnimated) {
            setStrokeDashoffset(targetOffset)
            setDisplayPercent(Math.round(percent))
        }
    }, [percent, hasAnimated, targetOffset])

    return (
        <div ref={circleRef} className="relative w-20 h-20 flex-shrink-0">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 80 80">
                {/* Glow filter */}
                <defs>
                    <filter id={`glow-${color}`}>
                        <feGaussianBlur stdDeviation="2" result="coloredBlur" />
                        <feMerge>
                            <feMergeNode in="coloredBlur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>
                {/* Track */}
                <circle
                    cx="40" cy="40" r={radius}
                    stroke={isDark ? '#1e293b' : '#e2e8f0'}
                    strokeWidth="6"
                    fill="transparent"
                />
                {/* Progress */}
                <circle
                    cx="40" cy="40" r={radius}
                    stroke={strokeColor}
                    strokeWidth="6"
                    fill="transparent"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    filter={percent > 0 ? `url(#glow-${color})` : undefined}
                    style={{ transition: 'stroke-dashoffset 0.9s cubic-bezier(0.4, 0, 0.2, 1)' }}
                />
            </svg>
            <div className={`absolute inset-0 flex items-center justify-center text-xs font-black ${isDark ? 'text-slate-100' : 'text-slate-800'} select-none`}>
                {displayPercent}%
            </div>
        </div>
    )
}

export default CircularProgress