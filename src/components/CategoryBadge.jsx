function CategoryBadge({ cat, className = 'text-[10px] px-2.5 py-0.5' }) {
    if (!cat) return null

    return (
        <span className={`font-black uppercase tracking-wider rounded-lg border ${cat.bgClass} flex items-center gap-1 select-none ${className}`}>
            <span>{cat.emoji}</span>
            <span>{cat.label}</span>
        </span>
    )
}

export default CategoryBadge