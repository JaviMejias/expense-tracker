import { useState, useRef, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChartPie, faWallet, faCreditCard, faCalendarCheck, faTags, faListUl, faPiggyBank, faChartLine } from '@fortawesome/free-solid-svg-icons'

const navItems = [
    { path: '/resumen', label: 'Resumen', icon: faChartPie },
    { path: '/categorias', label: 'Categorías', icon: faTags },
    { path: '/registrar', label: 'Registrar', icon: faWallet },
    { path: '/lista', label: 'Lista', icon: faListUl },
    { path: '/cuotas', label: 'Cuotas', icon: faCreditCard },
    { path: '/fijos', label: 'Fijos', icon: faCalendarCheck },
    { path: '/ahorros', label: 'Ahorros', icon: faPiggyBank },
    { path: '/estadisticas', label: 'Estadísticas', icon: faChartLine },
]

import { useThemeStore } from '../store/useThemeStore'
import { appThemes } from '../utils/theme'
import { useThemeStyles } from '../hooks/useThemeStyles'

function MobileNav() {
    const { themeMode, currentTheme } = useThemeStore()
    const activeTheme = appThemes[currentTheme] || appThemes.classic
    const { isDark, aura } = useThemeStyles(themeMode, activeTheme)
    const [isOpen, setIsOpen] = useState(false)
    const dropdownRef = useRef(null)
    const navigate = useNavigate()
    const location = useLocation()

    const activeItem = navItems.find(item => item.path === location.pathname) || navItems[0]

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false)
            }
        }
        document.addEventListener('mousedown', handleClickOutside)
        return () => document.removeEventListener('mousedown', handleClickOutside)
    }, [])

    const handleSelect = (path) => {
        navigate(path)
        setIsOpen(false)
    }

    return (
        <div className="relative w-full z-40" ref={dropdownRef}>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between p-4 rounded-2xl font-bold transition-all shadow-sm border
                    ${isDark 
                        ? 'bg-slate-800/80 border-slate-700 text-slate-200' 
                        : 'bg-white/80 border-slate-200 text-slate-700'
                    } backdrop-blur-md`}
            >
                <div className="flex items-center gap-3">
                    <FontAwesomeIcon icon={activeItem.icon} className={aura.icon} />
                    <span className="tracking-wide">{activeItem.label}</span>
                </div>
                <FontAwesomeIcon 
                    icon={faChevronDown} 
                    className={`transition-transform duration-300 ${isOpen ? 'rotate-180' : ''} ${isDark ? 'text-slate-400' : 'text-slate-400'}`} 
                />
            </button>

            {isOpen && (
                <div className={`absolute top-full left-0 right-0 mt-2 p-2 rounded-2xl shadow-xl border animate-in fade-in slide-in-from-top-2
                    ${isDark ? 'bg-slate-800/95 border-slate-700' : 'bg-white/95 border-slate-200'} backdrop-blur-xl`}>
                    <div className="flex flex-col gap-1 max-h-[60vh] overflow-y-auto hide-scrollbar">
                        {navItems.map((item) => {
                            const isActive = location.pathname === item.path
                            return (
                                <button
                                    key={item.path}
                                    onClick={() => handleSelect(item.path)}
                                    className={`w-full flex items-center gap-3 px-4 py-3.5 rounded-xl font-bold text-sm transition-all
                                        ${isActive 
                                            ? activeTheme.activeTab 
                                            : (isDark ? 'text-slate-300 hover:bg-slate-700/50' : 'text-slate-600 hover:bg-slate-100')
                                        }`}
                                >
                                    <FontAwesomeIcon icon={item.icon} className={isActive ? '' : 'opacity-70'} />
                                    {item.label}
                                </button>
                            )
                        })}
                    </div>
                </div>
            )}
        </div>
    )
}

export default MobileNav
