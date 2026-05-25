import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet, faSun, faMoon } from '@fortawesome/free-solid-svg-icons'
import { appThemes } from '../utils/theme'
import { useThemeStyles } from '../hooks/useThemeStyles'

function Header({ currentTheme = 'classic', setCurrentTheme, themeMode = 'dark', setThemeMode }) {
    const activeTheme = appThemes[currentTheme] || appThemes.classic
    const { isDark, aura } = useThemeStyles(themeMode, activeTheme)

    return (
        <header className="relative flex flex-col items-center justify-center pt-4 sm:pt-10 pb-2 w-full">
            <div className={`relative sm:absolute mb-8 sm:mb-0 sm:top-0 sm:right-2 flex flex-wrap items-center justify-center gap-2 backdrop-blur-md px-3 py-1.5 rounded-2xl z-20 transition-all select-none border max-w-full ${aura.container}`}>

                <button
                    type="button"
                    onClick={() => setThemeMode(isDark ? 'light' : 'dark')}
                    className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer outline-none select-none border ${aura.button}`}
                    title={isDark ? 'Modo Claro ☀️' : 'Modo Oscuro 🌙'}
                >
                    <FontAwesomeIcon icon={isDark ? faSun : faMoon} className={`text-xs ${isDark ? 'text-yellow-400' : 'text-slate-500'}`} />
                </button>

                <div className={`h-4 w-px mx-0.5 transition-colors ${aura.divider}`}></div>

                <span className={`text-[9px] font-black uppercase tracking-widest mr-0.5 select-none transition-colors ${aura.text}`}>Aura:</span>
                {Object.keys(appThemes).map(themeKey => {
                    const theme = appThemes[themeKey]
                    const isSelected = currentTheme === themeKey

                    return (
                        <button
                            key={themeKey}
                            type="button"
                            onClick={() => setCurrentTheme(themeKey)}
                            className={`w-4 h-4 rounded-full ${theme.themeDot} cursor-pointer transform hover:scale-125 transition-all outline-none border ${isDark ? 'border-white/5' : 'border-slate-900/5'} ${isSelected ? `ring-2 ring-offset-2 ${isDark ? 'ring-offset-slate-900' : 'ring-offset-white'} scale-110` : 'opacity-40 hover:opacity-100'}`}
                            title={theme.label}
                        />
                    )
                })}
            </div>

            <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 max-w-md h-32 blur-[80px] rounded-full pointer-events-none transition-all duration-700 ${activeTheme.primaryGlow} ${isDark ? 'opacity-100' : 'opacity-40'}`}></div>

            <div className="flex flex-col sm:flex-row items-center gap-4 mb-4 transform hover:scale-105 transition-transform duration-500 cursor-default relative z-10">
                <div className={`w-16 h-16 ${activeTheme.accentBgColor} bg-gradient-to-br from-white/10 to-transparent rounded-2xl flex items-center justify-center shadow-lg border border-white/10 ring-4 ring-white/5 transition-all duration-500`}>
                    <FontAwesomeIcon icon={faWallet} className="text-3xl text-white drop-shadow-md" />
                </div>
                <div className="text-center sm:text-left">
                    <h1 className={`text-4xl sm:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r ${isDark ? activeTheme.textGradient : activeTheme.textGradientLight} tracking-tight drop-shadow-sm transition-all duration-500`}>
                        Gestor de Gastos
                    </h1>
                </div>
            </div>

            <div className="flex items-center gap-4 relative z-10 opacity-80">
                <div className="h-px w-10 sm:w-16 bg-gradient-to-r from-transparent to-slate-500"></div>
                <p className={`${isDark ? 'text-slate-300' : 'text-slate-600'} font-semibold tracking-widest uppercase text-xs sm:text-sm transition-colors duration-500`}>
                    Administra tu dinero con estilo
                </p>
                <div className="h-px w-10 sm:w-16 bg-gradient-to-l from-transparent to-slate-500"></div>
            </div>
        </header>
    )
}

export default Header
