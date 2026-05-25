function CustomSelect({ value, onChange, options = [], s = {}, focusRingClass = '', className = '', isDark }) {
    return (
        <select
            value={value}
            onChange={onChange}
            className={`block w-full ${s.input || ''} ${focusRingClass} transition-all cursor-pointer ${className}`}
        >
            {options.map(opt => (
                <option key={opt.value} value={opt.value} className={isDark ? 'bg-slate-900 text-slate-100' : 'bg-white text-slate-800'}>
                    {opt.label}
                </option>
            ))}
        </select>
    )
}

export default CustomSelect