function ProgressBar({ percent, colorClass, trackClass, size = 'md', glowClass = '' }) {
    const heightClass = size === 'sm' ? 'h-2' : 'h-4'
    const baseTrack = `w-full ${heightClass} ${trackClass} rounded-full overflow-hidden p-0.5 shadow-inner`
    const baseBar = `h-full rounded-full transition-all duration-500 ${glowClass ? `shadow-[0_0_12px_var(--tw-shadow-color)] ${glowClass}` : ''} ${colorClass}`

    return (
        <div className={baseTrack}>
            <div
                style={{ width: `${Math.min(percent, 100)}%` }}
                className={baseBar}
            ></div>
        </div>
    )
}

export default ProgressBar