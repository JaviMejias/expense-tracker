import { useEffect, useRef, useState } from 'react'

function ProgressBar({ percent, colorClass, trackClass, glowClass }) {
    const [width, setWidth] = useState(0)
    const [hasAnimated, setHasAnimated] = useState(false)
    const barRef = useRef(null)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true)
                    // small delay so the bar is visible before animating
                    setTimeout(() => setWidth(Math.min(percent, 100)), 100)
                }
            },
            { threshold: 0.3 }
        )
        if (barRef.current) observer.observe(barRef.current)
        return () => observer.disconnect()
    }, [percent, hasAnimated])

    // re-trigger if percent changes
    useEffect(() => {
        if (hasAnimated) setWidth(Math.min(percent, 100))
    }, [percent, hasAnimated])

    return (
        <div ref={barRef} className={`w-full h-3 rounded-full overflow-hidden ${trackClass}`}>
            <div
                className={`h-full rounded-full ${colorClass} ${glowClass} transition-all duration-1000 ease-out`}
                style={{ width: `${width}%` }}
            />
        </div>
    )
}

export default ProgressBar