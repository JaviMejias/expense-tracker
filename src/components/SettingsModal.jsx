import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTimes, faKey, faSave } from '@fortawesome/free-solid-svg-icons'
import CustomInput from './CustomInput'
import CustomButton from './CustomButton'
import { useSettingsStore } from '../store/useSettingsStore'
import { useThemeStore } from '../store/useThemeStore'
import { useThemeStyles } from '../hooks/useThemeStyles'
import { appThemes } from '../utils/theme'

function SettingsModal({ isOpen, onClose }) {
    const { geminiApiKey, setGeminiApiKey } = useSettingsStore()
    const { themeMode, currentTheme } = useThemeStore()
    const activeTheme = appThemes[currentTheme] || appThemes.classic
    const { s, isDark, focusRingClass, aura } = useThemeStyles(themeMode, activeTheme)

    const [tempKey, setTempKey] = useState(geminiApiKey)

    if (!isOpen) return null

    const handleSave = () => {
        setGeminiApiKey(tempKey.trim())
        onClose()
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
            <div className={`relative w-full max-w-md ${s.mainBg} border ${isDark ? 'border-slate-700/50' : 'border-slate-200'} rounded-[2rem] shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200`}>
                <div className="flex justify-between items-center mb-6">
                    <h3 className={`text-xl font-black text-transparent bg-clip-text bg-gradient-to-r ${aura.gradientText} flex items-center gap-2`}>
                        <FontAwesomeIcon icon={faKey} className={aura.icon} />
                        Configuración de IA
                    </h3>
                    <button onClick={onClose} className={`w-8 h-8 flex items-center justify-center rounded-full transition-colors ${isDark ? 'hover:bg-slate-800 text-slate-400' : 'hover:bg-slate-200 text-slate-500'}`}>
                        <FontAwesomeIcon icon={faTimes} />
                    </button>
                </div>

                <div className="space-y-4">
                    <div>
                        <label className={`block text-xs font-bold ${aura.label} mb-2 uppercase tracking-wider`}>API Key de Google Gemini</label>
                        <CustomInput
                            value={tempKey}
                            onChange={(e) => setTempKey(e.target.value)}
                            placeholder="AIzaSy..."
                            type="password"
                            icon={faKey}
                            iconClass={aura.icon}
                            s={s}
                            focusRingClass={focusRingClass}
                            className="py-3 rounded-xl font-medium text-sm font-mono"
                        />
                        <p className={`mt-2 text-[10px] ${isDark ? 'text-slate-400' : 'text-slate-500'}`}>
                            Tu API Key se guardará localmente en tu navegador. Puedes obtener una gratis en <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-indigo-400 hover:underline font-bold">Google AI Studio</a>.
                        </p>
                    </div>

                    <CustomButton
                        onClick={handleSave}
                        variant="primary"
                        icon={faSave}
                        className="w-full py-3 mt-4"
                        activeTheme={activeTheme}
                        isDark={isDark}
                    >
                        Guardar Configuración
                    </CustomButton>
                </div>
            </div>
        </div>
    )
}

export default SettingsModal
