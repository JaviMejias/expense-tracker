import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWandMagicSparkles, faKey, faSpinner } from '@fortawesome/free-solid-svg-icons'
import ReactMarkdown from 'react-markdown'
import CustomButton from './CustomButton'
import { getGeminiAdvice } from '../services/geminiService'
import { useSettingsStore } from '../store/useSettingsStore'
import { useDataStore } from '../store/useDataStore'

function GeminiAdvisorCard({ selectedYear, isDark, activeTheme, s, aura }) {
    const { geminiApiKey } = useSettingsStore()
    const { expenses, categories } = useDataStore()
    
    const [advice, setAdvice] = useState(null)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState(null)

    const handleGetAdvice = async () => {
        if (!geminiApiKey) {
            setError('Falta API Key. Configúrala en el menú de ajustes superior.')
            return
        }
        
        setIsLoading(true)
        setError(null)
        setAdvice(null)
        
        try {
            const yearExpenses = expenses.filter(exp => new Date(exp.date).getFullYear() === selectedYear)
            if (yearExpenses.length === 0) {
                setError(`No hay gastos en el año ${selectedYear} para analizar.`)
                setIsLoading(false)
                return
            }
            
            const response = await getGeminiAdvice(geminiApiKey, yearExpenses, categories, selectedYear)
            setAdvice(response)
        } catch (err) {
            setError(err.message)
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className={`p-6 sm:p-8 rounded-[2rem] flex flex-col gap-5 transition-all duration-500 relative overflow-hidden shadow-xl
            ${isDark ? 'bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30' : 'bg-gradient-to-br from-indigo-50 to-purple-50 border border-indigo-200/50'}`}>
            
            <div className={`absolute -right-20 -top-20 w-64 h-64 bg-purple-500/20 blur-[80px] rounded-full pointer-events-none`}></div>
            <div className={`absolute -left-20 -bottom-20 w-64 h-64 bg-indigo-500/20 blur-[80px] rounded-full pointer-events-none`}></div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative z-10">
                <div className="flex items-center gap-4">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl shadow-lg border
                        ${isDark ? 'bg-indigo-500/20 border-indigo-400/30 text-indigo-300' : 'bg-white border-indigo-200 text-indigo-600'}`}>
                        <FontAwesomeIcon icon={faWandMagicSparkles} className={isLoading ? "animate-spin" : "animate-bounce"} />
                    </div>
                    <div>
                        <h4 className={`font-black text-lg ${s.bodyText}`}>Consejero IA (Gemini)</h4>
                        <p className={`text-xs font-bold ${isDark ? 'text-indigo-300' : 'text-indigo-600'} tracking-wide uppercase`}>
                            Análisis personalizado del {selectedYear}
                        </p>
                    </div>
                </div>
                
                <CustomButton
                    onClick={handleGetAdvice}
                    disabled={isLoading}
                    variant="primary"
                    icon={isLoading ? faSpinner : faWandMagicSparkles}
                    className={`py-2.5 px-6 !rounded-xl shadow-lg shadow-indigo-500/30 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
                    activeTheme={activeTheme}
                    isDark={isDark}
                >
                    {isLoading ? 'Analizando...' : 'Generar Consejo'}
                </CustomButton>
            </div>

            {error && (
                <div className={`mt-2 p-4 rounded-xl border flex items-start gap-3 relative z-10
                    ${isDark ? 'bg-rose-500/10 border-rose-500/30 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-700'}`}>
                    <FontAwesomeIcon icon={faKey} className="mt-1" />
                    <p className="text-sm font-bold">{error}</p>
                </div>
            )}

            {advice && (
                <div className={`mt-2 p-5 sm:p-6 rounded-2xl border relative z-10 animate-in fade-in slide-in-from-bottom-4 duration-700
                    ${isDark ? 'bg-slate-900/60 border-indigo-500/20' : 'bg-white border-indigo-100 shadow-inner'}`}>
                    <div className={`prose prose-sm max-w-none ${isDark ? 'prose-invert prose-p:text-slate-300 prose-li:text-slate-300' : 'prose-p:text-slate-700 prose-li:text-slate-700'} prose-headings:font-black prose-strong:text-indigo-500`}>
                        <ReactMarkdown>{advice}</ReactMarkdown>
                    </div>
                </div>
            )}
        </div>
    )
}

export default GeminiAdvisorCard
