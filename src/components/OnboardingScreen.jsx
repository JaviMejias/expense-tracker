import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet, faChartPie, faPiggyBank, faCreditCard, faArrowRight, faWandMagicSparkles } from '@fortawesome/free-solid-svg-icons'
import CustomButton from './CustomButton'
import { useThemeStyles } from '../hooks/useThemeStyles'
import { useThemeStore } from '../store/useThemeStore'
import { appThemes } from '../utils/theme'
import { useNavigate } from 'react-router-dom'

const features = [
    { icon: faWallet, title: 'Registra tus gastos', desc: 'Anota cada movimiento con categoría, monto y fecha. Soporta cuotas y gastos fijos.', delay: '100ms', path: '/registrar' },
    { icon: faChartPie, title: 'Visualiza tu mes', desc: 'Gráficos de torta por categoría, barra de progreso de presupuesto y resumen mensual.', delay: '200ms', path: '/calendario' },
    { icon: faPiggyBank, title: 'Metas de Ahorro', desc: 'Define objetivos con fecha límite y registra aportes. La IA te sugiere cuánto guardar por mes.', delay: '300ms', path: '/ahorros' },
    { icon: faWandMagicSparkles, title: 'Consejero con IA', desc: 'Conecta Gemini AI para recibir análisis personalizados de tus gastos anuales.', delay: '400ms', path: '/estadisticas' },
]

function OnboardingScreen({ isDark, s, aura, activeTheme }) {
    const navigate = useNavigate()

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh] py-10 px-4 animate-in fade-in slide-in-from-bottom-4 duration-700">
            {/* Header */}
            <div className="text-center mb-12">
                <div className={`w-20 h-20 mx-auto mb-6 rounded-3xl flex items-center justify-center text-4xl shadow-2xl bg-gradient-to-br ${aura.gradient} border ${isDark ? 'border-white/10' : 'border-black/5'}`}>
                    💰
                </div>
                <h1 className={`text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${aura.gradientText} mb-3`}>
                    Bienvenido a Aura
                </h1>
                <p className={`text-base font-bold ${s.bodyTextMuted} max-w-md mx-auto`}>
                    Tu asistente financiero personal. Empieza registrando tu primer gasto o configurando tu sueldo del mes.
                </p>
            </div>

            {/* Features grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full max-w-2xl mb-10">
                {features.map((feat, i) => (
                    <div
                        key={i}
                        onClick={() => navigate(feat.path)}
                        className={`group p-5 rounded-2xl border cursor-pointer transition-all duration-500 hover:-translate-y-1 hover:shadow-xl animate-slide-up ${isDark ? 'bg-slate-800/50 border-slate-700/50 hover:border-indigo-500/30' : 'bg-white border-slate-200 shadow-sm hover:border-indigo-300'}`}
                        style={{ animationDelay: feat.delay, animationFillMode: 'both' }}
                    >
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg mb-3 ${isDark ? 'bg-slate-900/60 border border-slate-700' : 'bg-slate-100 border border-slate-200'} transition-transform duration-300 group-hover:scale-110`}>
                            <FontAwesomeIcon icon={feat.icon} className={aura.icon} />
                        </div>
                        <h3 className={`font-black text-sm ${s.bodyText} mb-1`}>{feat.title}</h3>
                        <p className={`text-xs font-medium ${s.bodyTextMuted} leading-relaxed`}>{feat.desc}</p>
                    </div>
                ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md">
                <CustomButton
                    onClick={() => navigate('/registrar')}
                    variant="primary"
                    icon={faWallet}
                    className="flex-1 py-4 px-6 !rounded-2xl"
                    activeTheme={activeTheme}
                >
                    Registrar Primer Gasto
                </CustomButton>
                <CustomButton
                    onClick={() => navigate('/categorias')}
                    variant="secondary"
                    icon={faArrowRight}
                    className="flex-1 py-4 px-6 !rounded-2xl"
                    isDark={isDark}
                >
                    Personalizar Categorías
                </CustomButton>
            </div>
        </div>
    )
}

export default OnboardingScreen
