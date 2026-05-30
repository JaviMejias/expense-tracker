import { useState, useEffect } from 'react'
import { format, addMonths, differenceInMonths, startOfMonth } from 'date-fns'
import { es } from 'date-fns/locale'
import { formatCLP, parseCLP } from '../utils/currency'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faStar, faSave, faAlignLeft, faCoins, faTags, faCreditCard, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import CustomDatePicker from './CustomDatePicker'
import CustomButton from './CustomButton'
import CustomInput from './CustomInput'
import CategorySelector from './CategorySelector'
import { useThemeStyles } from '../hooks/useThemeStyles'
import { useAppAlert } from '../hooks/useAppAlert'
import EmptyState from './EmptyState'
import InstallmentItem from './InstallmentItem'
import { useCategoryStyles } from '../hooks/useCategoryStyles'
import { useDataStore } from '../store/useDataStore'
import { useUIStore } from '../store/useUIStore'
import { useThemeStore } from '../store/useThemeStore'
import { appThemes } from '../utils/theme'
import { getPendingInstallments } from '../utils/installments'

const weekDays = [
    { id: 1, name: 'Lun' },
    { id: 2, name: 'Mar' },
    { id: 3, name: 'Mié' },
    { id: 4, name: 'Jue' },
    { id: 5, name: 'Vie' },
    { id: 6, name: 'Sáb' },
    { id: 0, name: 'Dom' }
]

function Installments() {
    const {
        categories,
        installments, addInstallment, deleteInstallment, applyInstallmentToMonth, skipInstallmentMonth
    } = useDataStore()
    const { currentMonthDate, setCurrentMonthDate } = useUIStore()
    const { themeMode, currentTheme } = useThemeStore()
    const activeTheme = appThemes[currentTheme] || appThemes.classic
    const { s, isDark, activeColor, textGradientClass, focusRingClass, aura } = useThemeStyles(themeMode, activeTheme)
    const { showToast, showConfirm } = useAppAlert(themeMode)

    // --- Estado: formulario cuotas ---
    const [showInstForm, setShowInstForm] = useState(false)
    const [instDescription, setInstDescription] = useState('')
    const [instHasInterest, setInstHasInterest] = useState(false)
    const [instTotalAmount, setInstTotalAmount] = useState('')
    const [instNInstallments, setInstNInstallments] = useState('')
    const [instAlreadyPaid, setInstAlreadyPaid] = useState('0')
    const [instMonthlyAmount, setInstMonthlyAmount] = useState('')
    const [instFirstPaymentDate, setInstFirstPaymentDate] = useState(addMonths(new Date(), 1))
    const [instCategory, setInstCategory] = useState('otros')
    const [instErrors, setInstErrors] = useState({})

    const currentMonthKey = format(currentMonthDate, 'MM-yyyy')
    const categoryStyles = useCategoryStyles(categories)

    // Cuotas pendientes para el badge de notificación
    const pendingCount = getPendingInstallments(installments || [], currentMonthKey).length

    // Efecto para auto-calcular las cuotas ya pagadas según el mes de primer pago
    useEffect(() => {
        if (!instFirstPaymentDate) return
        
        // Asume que la fecha actual es el "mes presente" desde la perspectiva de creación.
        // Se puede usar `currentMonthDate` si se prefiere alinear con el mes visualizado.
        // Pero para la fecha de creación, la fecha real actual suele ser mejor.
        const current = startOfMonth(new Date())
        const first = startOfMonth(instFirstPaymentDate)
        
        const diff = differenceInMonths(current, first)
        
        // Si el primer pago es en el pasado, diff > 0.
        // Automáticamente sugerimos esa cantidad, limitada por las cuotas totales (si ya las ingresó).
        if (diff > 0) {
            const nInst = parseInt(instNInstallments) || 999
            const suggested = Math.min(diff, nInst - 1)
            setInstAlreadyPaid(suggested.toString())
        } else {
            setInstAlreadyPaid('0')
        }
    }, [instFirstPaymentDate, instNInstallments])

    // Cuota mensual calculada automáticamente (solo si no tiene interés)
    const computedMonthly =
        !instHasInterest && parseCLP(instTotalAmount) > 0 && parseInt(instNInstallments) >= 2
            ? Math.round(parseCLP(instTotalAmount) / parseInt(instNInstallments))
            : null

    // --- Handlers: cuotas ---
    const handleSaveInstallment = (e) => {
        e.preventDefault()
        const errors = {}
        if (!instDescription.trim()) errors.description = 'La descripción es requerida.'
        const totalAmt = parseCLP(instTotalAmount)
        if (totalAmt <= 0) errors.totalAmount = 'El monto total debe ser mayor a cero.'
        const nInst = parseInt(instNInstallments)
        if (!nInst || nInst < 2) errors.nInstallments = 'Debe tener al menos 2 cuotas.'
        
        const alreadyPaid = parseInt(instAlreadyPaid) || 0
        if (alreadyPaid >= nInst) errors.alreadyPaid = 'Debe ser menor al total de cuotas.'
        
        const monthlyAmt = instHasInterest ? parseCLP(instMonthlyAmount) : computedMonthly
        if (instHasInterest && (!monthlyAmt || monthlyAmt <= 0)) errors.monthlyAmount = 'Ingresa el valor de la cuota mensual con interés.'

        setInstErrors(errors)
        if (Object.keys(errors).length > 0) return

        // Generar un historial de "meses simulados" si ya ha pagado cuotas antes
        const dummyAppliedMonths = []
        for (let i = 0; i < alreadyPaid; i++) {
            dummyAppliedMonths.push(`paid-${Date.now()}-${i}`)
        }

        addInstallment({
            description: instDescription.trim(),
            totalAmount: totalAmt,
            hasInterest: instHasInterest,
            monthlyAmount: monthlyAmt,
            totalInstallments: nInst,
            purchaseDate: new Date().toISOString(),
            firstPaymentMonth: format(instFirstPaymentDate, 'MM-yyyy'),
            category: instCategory,
            appliedMonths: dummyAppliedMonths
        })

        setInstDescription(''); setInstHasInterest(false); setInstTotalAmount(''); setInstNInstallments('')
        setInstAlreadyPaid('0'); setInstMonthlyAmount(''); setInstFirstPaymentDate(addMonths(new Date(), 1)); setInstCategory('otros')
        setInstErrors({}); setShowInstForm(false)
        showToast('Cuota registrada correctamente 💳')
    }

    const handleDeleteInstallment = async (id) => {
        const inst = (installments || []).find(i => i.id === id)
        const confirmed = await showConfirm(
            '¿Eliminar cuota?',
            `¿Estás seguro de eliminar "${inst?.description || ''}"? Se perderá el historial de pagos.`
        )
        if (confirmed.isConfirmed) {
            deleteInstallment(id)
            showToast(`Cuota "${inst?.description}" eliminada`)
        }
    }

    const handleApplyInstallment = (id, monthKey) => {
        const inst = (installments || []).find(i => i.id === id)
        applyInstallmentToMonth(id, monthKey)
        showToast(`Cuota de "${inst?.description}" registrada como gasto ✅`, 'success', 2500)
    }

    const handleSkipInstallment = (id, monthKey) => {
        const inst = (installments || []).find(i => i.id === id)
        skipInstallmentMonth(id, monthKey)
        showToast(`Cuota de "${inst?.description}" saltada para este mes`, 'info', 2500)
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10 relative">

            {/* === Compras en Cuotas === */}
            <div>
                <div className="flex items-center justify-between mb-6">
                    <h2 className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${textGradientClass} flex items-center gap-2`}>
                        <FontAwesomeIcon icon={faCreditCard} className={aura.icon} /> Compras en Cuotas
                        {pendingCount > 0 && (
                            <span className="ml-1 inline-flex items-center justify-center w-6 h-6 rounded-full bg-amber-500 text-white text-xs font-black animate-pulse shadow-lg shadow-amber-500/30">
                                {pendingCount}
                            </span>
                        )}
                    </h2>
                    <button
                        type="button"
                        onClick={() => setShowInstForm(prev => !prev)}
                        className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all cursor-pointer
                            ${showInstForm
                                ? (isDark ? 'bg-slate-700 border-slate-600 text-slate-300' : 'bg-slate-200 border-slate-300 text-slate-600')
                                : (isDark ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/30' : 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100')
                            }`}
                    >
                        <FontAwesomeIcon icon={showInstForm ? faChevronUp : faChevronDown} />
                        {showInstForm ? 'Cerrar' : 'Nueva cuota'}
                    </button>
                </div>

                {/* Formulario nueva cuota */}
                {showInstForm && (
                    <form onSubmit={handleSaveInstallment} className={`${s.itemBg} p-6 rounded-3xl space-y-5 mb-8 animate-in fade-in slide-in-from-top-2 duration-300`}>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className={`flex items-center gap-2 text-sm font-bold ${aura.label} mb-2`}>
                                    <FontAwesomeIcon icon={faAlignLeft} /> Descripción (Ej: TV Samsung, Reloj):
                                </label>
                                <CustomInput value={instDescription} onChange={(e) => setInstDescription(e.target.value)} placeholder="¿Qué compraste?" s={s} focusRingClass={focusRingClass} className="py-3 rounded-xl font-medium" />
                                {instErrors.description && <p className="mt-1 text-sm text-rose-400 font-bold">{instErrors.description}</p>}
                            </div>

                            <div>
                                <label className={`block text-sm font-bold ${aura.label} mb-2`}>¿La cuota tiene interés?</label>
                                <div className="flex gap-3">
                                    <label className={`flex items-center gap-2 cursor-pointer px-4 py-3 rounded-xl border transition-all flex-1 select-none
                                        ${!instHasInterest
                                            ? (isDark ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' : 'bg-indigo-50 border-indigo-300 text-indigo-700')
                                            : (isDark ? 'bg-slate-900 border-slate-700 text-slate-400' : 'bg-white border-slate-300 text-slate-500')}`}>
                                        <input type="radio" checked={!instHasInterest} onChange={() => setInstHasInterest(false)} className={`w-4 h-4 cursor-pointer ${aura.radio}`} />
                                        <span className="font-bold text-sm">Sin interés</span>
                                    </label>
                                    <label className={`flex items-center gap-2 cursor-pointer px-4 py-3 rounded-xl border transition-all flex-1 select-none
                                        ${instHasInterest
                                            ? (isDark ? 'bg-amber-500/20 border-amber-500/40 text-amber-300' : 'bg-amber-50 border-amber-300 text-amber-700')
                                            : (isDark ? 'bg-slate-900 border-slate-700 text-slate-400' : 'bg-white border-slate-300 text-slate-500')}`}>
                                        <input type="radio" checked={instHasInterest} onChange={() => setInstHasInterest(true)} className={`w-4 h-4 cursor-pointer ${aura.radio}`} />
                                        <span className="font-bold text-sm">Con interés</span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className={`flex items-center gap-2 text-sm font-bold ${aura.label} mb-2`}>
                                    <FontAwesomeIcon icon={faCoins} /> Monto total de la compra:
                                </label>
                                <CustomInput value={instTotalAmount} onChange={(e) => setInstTotalAmount(e.target.value)} isAmount={true} setEvaluatedAmount={setInstTotalAmount} iconClass={aura.icon} s={s} focusRingClass={focusRingClass} className="py-3 rounded-xl font-bold" placeholder="Ej: 279.990" />
                                {instErrors.totalAmount && <p className="mt-1 text-sm text-rose-400 font-bold">{instErrors.totalAmount}</p>}
                            </div>

                            <div>
                                <label className={`block text-sm font-bold ${aura.label} mb-2`}>Mes del primer pago:</label>
                                <CustomDatePicker selected={instFirstPaymentDate} onChange={(date) => setInstFirstPaymentDate(date)} type="month" activeColor={activeColor} activeTheme={activeTheme} isDark={isDark} s={s} focusRingClass={focusRingClass} className="w-full px-4 py-3 rounded-xl font-bold capitalize" />
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                            <div>
                                <label className={`block text-sm font-bold ${aura.label} mb-2`}>Número de cuotas:</label>
                                <div className="flex gap-2">
                                    <div className="flex-1 relative">
                                        <CustomInput value={instNInstallments} onChange={(e) => setInstNInstallments(e.target.value.replace(/\D/g, ''))} placeholder="Totales (Ej: 6)" s={s} focusRingClass={focusRingClass} className="py-3 rounded-xl font-bold" />
                                        <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Total</span>
                                    </div>
                                    <div className="flex-1 relative">
                                        <CustomInput value={instAlreadyPaid} onChange={(e) => setInstAlreadyPaid(e.target.value.replace(/\D/g, ''))} placeholder="Pagadas" s={s} focusRingClass={focusRingClass} className="py-3 rounded-xl font-bold" />
                                        <span className={`absolute right-3 top-1/2 -translate-y-1/2 text-[10px] font-black uppercase tracking-wider ${isDark ? 'text-slate-500' : 'text-slate-400'}`}>Ya pagadas</span>
                                    </div>
                                </div>
                                {instErrors.nInstallments && <p className="mt-1 text-sm text-rose-400 font-bold">{instErrors.nInstallments}</p>}
                                {instErrors.alreadyPaid && <p className="mt-1 text-sm text-rose-400 font-bold">{instErrors.alreadyPaid}</p>}
                                {!instHasInterest && computedMonthly && (
                                    <p className={`mt-2 text-sm font-bold ${aura.label}`}>
                                        💡 Cuota mensual: <span className="text-emerald-400">${formatCLP(computedMonthly)}</span>/mes
                                    </p>
                                )}
                            </div>

                            {instHasInterest ? (
                                <div className="animate-in fade-in slide-in-from-top-1 duration-200">
                                    <label className={`flex items-center gap-2 text-sm font-bold ${aura.label} mb-2`}>
                                        <FontAwesomeIcon icon={faCoins} /> Valor cuota mensual (con interés ya incluido):
                                    </label>
                                    <CustomInput value={instMonthlyAmount} onChange={(e) => setInstMonthlyAmount(e.target.value)} isAmount={true} setEvaluatedAmount={setInstMonthlyAmount} iconClass={aura.icon} s={s} focusRingClass={focusRingClass} className="py-3 rounded-xl font-bold" placeholder="Valor exacto de tu estado de cuenta" />
                                    {instErrors.monthlyAmount && <p className="mt-1 text-sm text-rose-400 font-bold">{instErrors.monthlyAmount}</p>}
                                </div>
                            ) : <div className="hidden sm:block"></div>}
                        </div>

                        <div>
                            <label className={`flex items-center gap-2 text-sm font-bold ${aura.label} mb-2`}>
                                <FontAwesomeIcon icon={faTags} /> Categoría:
                            </label>
                            <CategorySelector categories={categories} selectedId={instCategory} onSelect={setInstCategory} isDark={isDark} focusRingClass={focusRingClass} hoverClass={aura.hoverItem} />
                        </div>

                        <div className="flex gap-3">
                            <CustomButton type="submit" variant="primary" icon={faSave} className="flex-1 py-3" activeTheme={activeTheme} isDark={isDark}>
                                Guardar Cuota
                            </CustomButton>
                            <button type="button" onClick={() => setShowInstForm(false)}
                                className={`px-5 py-3 rounded-xl font-bold text-sm border transition-all cursor-pointer ${isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-300 text-slate-500 hover:bg-slate-100'}`}>
                                Cancelar
                            </button>
                        </div>
                    </form>
                )}

                {/* Lista de cuotas activas */}
                <div className="space-y-4">
                    {(!installments || installments.length === 0) ? (
                        <EmptyState icon={faCreditCard} message="No tienes compras en cuotas registradas." isDark={isDark} />
                    ) : (
                        installments.map(inst => (
                            <InstallmentItem
                                key={inst.id}
                                inst={inst}
                                currentMonthKey={currentMonthKey}
                                categoryStyle={categoryStyles[inst.category || 'otros']}
                                s={s}
                                aura={aura}
                                isDark={isDark}
                                onApply={handleApplyInstallment}
                                onSkip={handleSkipInstallment}
                                onDelete={handleDeleteInstallment}
                            />
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default Installments