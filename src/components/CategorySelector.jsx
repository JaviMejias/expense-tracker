function CategorySelector({ categories = [], selectedId, onSelect, isDark, focusRingClass, hoverClass }) {
    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {categories.map(cat => {
                const isActive = selectedId === cat.id
                return (
                    <button
                        key={cat.id}
                        type="button"
                        onClick={() => onSelect(cat.id)}
                        className={`flex flex-col items-center justify-center p-4 rounded-2xl border transition-all duration-300 transform select-none cursor-pointer focus:outline-none ${focusRingClass} ${isActive ? cat.activeClass : `${isDark ? 'border-slate-700' : 'border-slate-200'} ${hoverClass} ${cat.colorClass}`}`}
                    >
                        <span className="text-2xl mb-1.5">{cat.emoji}</span>
                        <span className={`text-xs font-black tracking-wide uppercase ${isDark ? 'text-slate-100' : 'text-slate-700'}`}>{cat.name}</span>
                    </button>
                )
            })}
        </div>
    )
}

export default CategorySelector