import { useState, useRef, useCallback } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function CustomButton({
    children,
    onClick,
    type = 'button',
    icon,
    variant = 'primary',
    className = '',
    activeTheme,
    isDark,
    disabled = false,
    ...props
}) {
    const [ripples, setRipples] = useState([])
    const buttonRef = useRef(null)

    const createRipple = useCallback((e) => {
        const button = buttonRef.current
        if (!button) return
        const rect = button.getBoundingClientRect()
        const size = Math.max(rect.width, rect.height)
        const x = e.clientX - rect.left - size / 2
        const y = e.clientY - rect.top - size / 2
        const id = Date.now()
        setRipples(prev => [...prev, { id, x, y, size }])
        setTimeout(() => setRipples(prev => prev.filter(r => r.id !== id)), 620)
    }, [])

    const handleClick = useCallback((e) => {
        createRipple(e)
        onClick?.(e)
    }, [createRipple, onClick])

    const baseClasses = 'relative overflow-hidden flex items-center justify-center gap-2 font-extrabold transition-all duration-300 transform cursor-pointer select-none rounded-xl'
    let variantClasses = ''

    if (variant === 'primary') {
        const defaultPrimary = 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'
        const primaryBg = activeTheme ? `${activeTheme.accentBgColor} ${activeTheme.accentHoverBgColor}` : defaultPrimary
        variantClasses = `${primaryBg} text-white shadow-lg hover:-translate-y-0.5 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-white/20 border border-transparent active:scale-95`
    } else if (variant === 'secondary') {
        variantClasses = `${isDark ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'} border hover:-translate-y-0.5 active:scale-95`
    } else if (variant === 'danger') {
        variantClasses = 'bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white hover:-translate-y-0.5 shadow-md active:scale-95'
    } else if (variant === 'warning') {
        variantClasses = 'bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-slate-900 hover:-translate-y-0.5 shadow-md active:scale-95'
    } else if (variant === 'custom') {
        variantClasses = 'active:scale-95'
    }

    const disabledClasses = disabled ? 'opacity-60 cursor-not-allowed !transform-none' : ''

    return (
        <button
            ref={buttonRef}
            type={type}
            onClick={disabled ? undefined : handleClick}
            disabled={disabled}
            className={`${baseClasses} ${variantClasses} ${disabledClasses} ${className}`}
            {...props}
        >
            {ripples.map(ripple => (
                <span
                    key={ripple.id}
                    className="absolute rounded-full bg-white/30 pointer-events-none animate-ripple"
                    style={{
                        left: ripple.x,
                        top: ripple.y,
                        width: ripple.size,
                        height: ripple.size,
                    }}
                />
            ))}
            {icon && <FontAwesomeIcon icon={icon} />}
            {children}
        </button>
    )
}

export default CustomButton