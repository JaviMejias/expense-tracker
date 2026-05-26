import { useState, useRef, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faCalendarAlt } from '@fortawesome/free-solid-svg-icons'

function AuraYearSelector({ value, onChange, years = [], isDark, aura }) {
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)

    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener("mousedown", handleClickOutside)
        return () => document.removeEventListener("mousedown", handleClickOutside)
    }, [])

    if (!years || years.length === 0) return null;

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    flex items-center gap-3 px-4 py-2 rounded-2xl font-black text-lg transition-all duration-300
                    ${isDark ? 'bg-slate-800/50 hover:bg-slate-800 text-slate-200' : 'bg-white hover:bg-slate-50 text-slate-700'}
                    ${isOpen ? 'ring-2 ring-opacity-50 ' + aura.radio : ''}
                    shadow-sm hover:shadow-md
                `}
            >
                <FontAwesomeIcon icon={faCalendarAlt} className={aura.icon} />
                <span>{value}</span>
                <FontAwesomeIcon 
                    icon={faChevronDown} 
                    className={`text-xs transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} ${isDark ? 'text-slate-500' : 'text-slate-400'}`} 
                />
            </button>

            {isOpen && (
                <div className={`
                    absolute top-full right-0 mt-2 w-full min-w-[140px] z-50 rounded-2xl overflow-hidden backdrop-blur-xl
                    ${isDark ? 'bg-slate-900/90 border border-slate-700/50 shadow-2xl shadow-black/50' : 'bg-white/90 border border-slate-200 shadow-xl shadow-slate-200/50'}
                    animate-in fade-in slide-in-from-top-2 duration-200
                `}>
                    <div className="py-2 max-h-60 overflow-y-auto scrollbar-hide">
                        {years.map(year => {
                            const isSelected = year === value;
                            return (
                                <button
                                    key={year}
                                    onClick={() => {
                                        onChange(year);
                                        setIsOpen(false);
                                    }}
                                    className={`
                                        w-full text-left px-5 py-3 text-sm font-bold transition-all duration-200
                                        ${isSelected 
                                            ? `border-l-4 ${aura.listSelected || 'border-indigo-500 bg-indigo-500/10 text-indigo-500'}` 
                                            : `border-l-4 border-transparent ${isDark ? 'text-slate-300 hover:bg-slate-800/80' : 'text-slate-600 hover:bg-slate-100'}`
                                        }
                                    `}
                                >
                                    {year}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default AuraYearSelector
