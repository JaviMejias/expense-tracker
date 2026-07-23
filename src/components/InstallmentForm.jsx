import { useState, useEffect } from 'react'
import { format, addMonths, differenceInMonths, startOfMonth } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faSave, faAlignLeft, faCoins, faTags } from '@fortawesome/free-solid-svg-icons'
import CustomDatePicker from './CustomDatePicker'
import CustomButton from './CustomButton'
import CustomInput from './CustomInput'
import CategorySelector from './CategorySelector'
import { parseCLP, formatCLP } from '../utils/currency'
import { useDataStore } from '../store/useDataStore'
import { useAppAlert } from '../hooks/useAppAlert'
import { motion } from 'framer-motion'

function InstallmentForm({ categories, isDark, activeTheme, activeColor, s, focusRingClass, aura, onCancel }) {
    const { addInstallment } = useDataStore()
    const { showToast } = useAppAlert(isDark ? 'dark' : 'light')

    const [instDescription, setInstDescription] = useState('')
    const [instHasInterest, setInstHasInterest] = useState(false)
    const [instTotalAmount, setInstTotalAmount] = useState('')
    const [instNInstallments, setInstNInstallments] = useState('')
    const [instAlreadyPaid, setInstAlreadyPaid] = useState('0')
    const [instMonthlyAmount, setInstMonthlyAmount] = useState('')
    const [instFirstPaymentDate, setInstFirstPaymentDate] = useState(addMonths(new Date(), 1))
    const [instCategory, setInstCategory] = useState('otros')
    const [instErrors, setInstErrors] = useState({})

    useEffect(() => {
        if (!instFirstPaymentDate) return
        const current = startOfMonth(new Date())
        const first = startOfMonth(instFirstPaymentDate)
        const diff = differenceInMonths(current, first)
        
        if (diff > 0) {
            const nInst = parseInt(instNInstallments) || 999
            const suggested = Math.min(diff, nInst - 1)
            setInstAlreadyPaid(suggested.toString())
        } else {
            setInstAlreadyPaid('0')
        }
    }, [instFirstPaymentDate, instNInstallments])

    const computedMonthly =
        !instHasInterest && parseCLP(instTotalAmount) > 0 && parseInt(instNInstallments) >= 2
            ? Math.round(parseCLP(instTotalAmount) / parseInt(instNInstallments))
            : null

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

        const dummyAppliedMonths = []
        for (let i = 0; i < alreadyPaid; i++) {
            dummyAppliedMonths.push(`paid-legacy-${i}`)
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

        setInstDescription('')
        setInstHasInterest(false)
        setInstTotalAmount('')
        setInstNInstallments('')
        setInstAlreadyPaid('0')
        setInstMonthlyAmount('')
        setInstFirstPaymentDate(addMonths(new Date(), 1))
        setInstCategory('otros')
        setInstErrors({})
        showToast('Cuota registrada correctamente 💳')
        
        if (onCancel) onCancel()
    }

    return (
        <motion.form
            initial={{ opacity: 0, height: 0, scale: 0.95, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', scale: 1, marginBottom: 32 }}
            exit={{ opacity: 0, height: 0, scale: 0.95, marginBottom: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onSubmit={handleSaveInstallment}
            className={`${s.itemBg} p-6 rounded-3xl space-y-5 overflow-hidden`}
        >
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
                    <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
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
                    <div className="flex flex-col sm:flex-row gap-3">
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

            <div className="flex flex-col sm:flex-row gap-3">
                <CustomButton type="submit" variant="primary" icon={faSave} className="flex-1 py-3" activeTheme={activeTheme} isDark={isDark}>
                    Guardar Cuota
                </CustomButton>
                <button type="button" onClick={onCancel}
                    className={`px-5 py-3 rounded-xl font-bold text-sm border transition-all cursor-pointer ${isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800' : 'border-slate-300 text-slate-500 hover:bg-slate-100'}`}>
                    Cancelar
                </button>
            </div>
        </motion.form>
    )
}

export default InstallmentForm
