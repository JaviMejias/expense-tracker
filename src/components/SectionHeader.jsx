import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

function SectionHeader({ title, icon, gradientClass, iconClass, as: Component = 'h2', className = '' }) {
    const baseTextSize = Component === 'h2' ? 'text-2xl mb-6' : 'text-lg mb-6'

    return (
        <Component className={`${baseTextSize} font-black text-transparent bg-clip-text bg-gradient-to-r ${gradientClass} flex items-center gap-2 select-none ${className}`}>
            {icon && <FontAwesomeIcon icon={icon} className={iconClass} />}
            {title}
        </Component>
    )
}

export default SectionHeader