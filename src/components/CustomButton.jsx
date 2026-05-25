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
    ...props
}) {
    const baseClasses = 'flex items-center justify-center gap-2 font-extrabold transition-all duration-300 transform cursor-pointer select-none rounded-xl'
    let variantClasses = ''

    if (variant === 'primary') {
        const defaultPrimary = 'bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500'
        const primaryBg = activeTheme ? `${activeTheme.accentBgColor} ${activeTheme.accentHoverBgColor}` : defaultPrimary
        variantClasses = `${primaryBg} text-white shadow-lg hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-white/20 border border-transparent`
    } else if (variant === 'secondary') {
        variantClasses = `${isDark ? 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700' : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200'} border hover:-translate-y-1`
    } else if (variant === 'danger') {
        variantClasses = 'bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500 hover:text-white hover:-translate-y-1 shadow-md'
    } else if (variant === 'warning') {
        variantClasses = 'bg-amber-500/10 border border-amber-500/20 text-amber-400 hover:bg-amber-500 hover:text-slate-900 hover:-translate-y-1 shadow-md'
    } else if (variant === 'custom') {
        variantClasses = ''
    }

    return (
        <button type={type} onClick={onClick} className={`${baseClasses} ${variantClasses} ${className}`} {...props}>
            {icon && <FontAwesomeIcon icon={icon} />}
            {children}
        </button>
    )
}

export default CustomButton