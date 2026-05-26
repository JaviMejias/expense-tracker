import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faExclamationTriangle, faRedo } from '@fortawesome/free-solid-svg-icons'
import CustomButton from './CustomButton'
import { useThemeStore } from '../store/useThemeStore'
import { useThemeStyles } from '../hooks/useThemeStyles'
import { appThemes } from '../utils/theme'

function ErrorFallback({ error, resetErrorBoundary }) {
    const { themeMode, currentTheme } = useThemeStore()
    const activeTheme = appThemes[currentTheme] || appThemes.classic
    const { isDark, s, aura } = useThemeStyles(themeMode, activeTheme)

    return (
        <div className={`p-8 rounded-[2rem] border transition-all shadow-xl max-w-xl mx-auto mt-10 ${isDark ? 'bg-slate-900 border-rose-900/50 shadow-rose-900/20' : 'bg-rose-50 border-rose-200 shadow-rose-100'}`}>
            <div className="flex flex-col items-center text-center space-y-5">
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl shadow-inner bg-gradient-to-br from-rose-400 to-rose-600 text-white ${isDark ? 'shadow-rose-950/50' : 'shadow-rose-200/50'} animate-bounce`}>
                    <FontAwesomeIcon icon={faExclamationTriangle} />
                </div>
                
                <div>
                    <h2 className="text-xl font-black text-rose-500 uppercase tracking-widest mb-2">¡Ups! Algo salió mal</h2>
                    <p className={`text-sm font-medium ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                        Tuvimos un problema inesperado al mostrar esta sección.
                    </p>
                </div>

                <div className={`w-full p-4 rounded-xl text-left overflow-auto max-h-32 text-xs font-mono border ${isDark ? 'bg-slate-950 border-slate-800 text-rose-300' : 'bg-white border-rose-100 text-rose-600'}`}>
                    {error?.message || 'Error desconocido'}
                </div>

                <CustomButton
                    onClick={resetErrorBoundary}
                    variant="primary"
                    icon={faRedo}
                    className="w-full sm:w-auto px-8 py-3 !rounded-xl"
                    activeTheme={activeTheme}
                    isDark={isDark}
                >
                    Intentar de Nuevo
                </CustomButton>
            </div>
        </div>
    )
}

export default ErrorFallback
