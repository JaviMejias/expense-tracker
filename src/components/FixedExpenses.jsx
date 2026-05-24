import { useState } from 'react'
import { format } from 'date-fns'
import { es } from 'date-fns/locale'
import Swal from 'sweetalert2'
import { formatCLP, parseCLP } from '../utils/currency'

function FixedExpenses({ fixedExpenses, setFixedExpenses, applyFixedExpenseToMonth, currentMonthDate }) {
    const [fixedDescription, setFixedDescription] = useState('')
    const [fixedAmount, setFixedAmount] = useState('')
    const [fixedType, setFixedType] = useState('single')
    const [fixedDays, setFixedDays] = useState([])
    const [fixedErrors, setFixedErrors] = useState({})

    const currentMonthKey = format(currentMonthDate, 'MM-yyyy')

    const weekDays = [
        { id: 1, name: 'Lun' },
        { id: 2, name: 'Mar' },
        { id: 3, name: 'Mié' },
        { id: 4, name: 'Jue' },
        { id: 5, name: 'Vie' },
        { id: 6, name: 'Sáb' },
        { id: 0, name: 'Dom' }
    ]

    const handleFixedAmountChange = (e) => setFixedAmount(formatCLP(e.target.value))

    const toggleFixedDay = (dayId) => {
        setFixedDays(prev =>
            prev.includes(dayId) ? prev.filter(d => d !== dayId) : [...prev, dayId]
        )
    }

    const handleApplyToMonth = async (item) => {
        const applied = item.appliedMonths || []
        if (applied.includes(currentMonthKey)) {
            const result = await Swal.fire({
                title: '¿Plantilla duplicada?',
                text: `Ya aplicaste la plantilla "${item.description}" en este mes. ¿Estás seguro de querer añadirla nuevamente?`,
                icon: 'warning',
                showCancelButton: true,
                confirmButtonColor: '#8b5cf6',
                cancelButtonColor: '#f43f5e',
                confirmButtonText: 'Sí, duplicar',
                cancelButtonText: 'Cancelar',
                background: '#0f172a',
                color: '#f1f5f9'
            })
            if (!result.isConfirmed) return
        }

        applyFixedExpenseToMonth(item)

        Swal.fire({
            toast: true,
            position: 'top-end',
            icon: 'success',
            title: `¡"${item.description}" añadido a ${format(currentMonthDate, 'MMMM', { locale: es })}!`,
            showConfirmButton: false,
            timer: 3000,
            timerProgressBar: true,
            background: '#0f172a',
            color: '#f1f5f9',
            iconColor: '#10b981'
        })
    }

    const handleSaveFixedExpense = (e) => {
        e.preventDefault()
        let currentErrors = {}
        let isValid = true

        if (!fixedDescription.trim()) {
            currentErrors.description = 'La descripción es requerida.'
            isValid = false
        }

        const numericAmount = parseCLP(fixedAmount)
        if (numericAmount <= 0) {
            currentErrors.amount = 'El monto debe ser mayor a cero.'
            isValid = false
        }

        if (fixedType === 'weekly' && fixedDays.length === 0) {
            currentErrors.days = 'Debes seleccionar al menos un día de la semana.'
            isValid = false
        }

        setFixedErrors(currentErrors)

        if (isValid) {
            const newFixed = {
                id: Date.now(),
                description: fixedDescription,
                amount: numericAmount,
                type: fixedType,
                days: fixedType === 'weekly' ? fixedDays : [],
                appliedMonths: []
            }
            setFixedExpenses([...fixedExpenses, newFixed])
            setFixedDescription('')
            setFixedAmount('')
            setFixedDays([])
            setFixedType('single')

            Swal.fire({
                toast: true,
                position: 'top-end',
                icon: 'success',
                title: 'Plantilla guardada',
                showConfirmButton: false,
                timer: 2000,
                background: '#0f172a',
                color: '#f1f5f9',
                iconColor: '#10b981'
            })
        }
    }

    const handleDeleteFixedExpense = (id) => {
        setFixedExpenses(fixedExpenses.filter(f => f.id !== id))
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 space-y-10 relative">
            <div>
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-6">
                    Plantillas de Gastos Fijos
                </h2>
                <form onSubmit={handleSaveFixedExpense} className="space-y-5 bg-slate-900/50 p-6 rounded-3xl border border-slate-800">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                        <div>
                            <label htmlFor="fixedDescription" className="block text-sm font-bold text-violet-300 mb-2">Nombre (Ej: Gym, Pasajes):</label>
                            <input
                                type="text"
                                id="fixedDescription"
                                value={fixedDescription}
                                onChange={(e) => setFixedDescription(e.target.value)}
                                className="block w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-medium focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500 transition-all outline-none placeholder-slate-700"
                            />
                            {fixedErrors.description && <p className="mt-1 text-sm text-rose-400 font-bold">{fixedErrors.description}</p>}
                        </div>
                        <div>
                            <label htmlFor="fixedAmount" className="block text-sm font-bold text-violet-300 mb-2">Monto Total Diario/Único:</label>
                            <div className="relative">
                                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-fuchsia-500 font-bold">$</span>
                                <input
                                    type="text"
                                    id="fixedAmount"
                                    value={fixedAmount}
                                    onChange={handleFixedAmountChange}
                                    className="block w-full pl-8 pr-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-slate-100 font-bold focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500 transition-all outline-none placeholder-slate-700"
                                />
                            </div>
                            {fixedErrors.amount && <p className="mt-1 text-sm text-rose-400 font-bold">{fixedErrors.amount}</p>}
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-violet-300 mb-2">Tipo de Gasto:</label>
                        <div className="flex gap-4">
                            <label className="flex items-center gap-2 cursor-pointer bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex-1">
                                <input
                                    type="radio"
                                    checked={fixedType === 'single'}
                                    onChange={() => setFixedType('single')}
                                    className="text-fuchsia-600 focus:ring-fuchsia-500 w-5 h-5 bg-slate-900 border-slate-700"
                                />
                                <span className="font-bold text-slate-200">Mensual Único</span>
                            </label>
                            <label className="flex items-center gap-2 cursor-pointer bg-slate-950 px-4 py-3 rounded-xl border border-slate-800 hover:border-slate-700 transition-all flex-1">
                                <input
                                    type="radio"
                                    checked={fixedType === 'weekly'}
                                    onChange={() => setFixedType('weekly')}
                                    className="text-fuchsia-600 focus:ring-fuchsia-500 w-5 h-5 bg-slate-900 border-slate-700"
                                />
                                <span className="font-bold text-slate-200">Repetir por Días</span>
                            </label>
                        </div>
                    </div>

                    {fixedType === 'weekly' && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                            <label className="block text-sm font-bold text-violet-300 mb-3">Selecciona los días (Ej: Lunes a Viernes):</label>
                            <div className="flex flex-wrap gap-2">
                                {weekDays.map(day => (
                                    <button
                                        key={day.id}
                                        type="button"
                                        onClick={() => toggleFixedDay(day.id)}
                                        className={`px-4 py-2 rounded-xl font-bold transition-all transform hover:scale-105 ${fixedDays.includes(day.id) ? 'bg-fuchsia-600 text-white shadow-md shadow-fuchsia-900/50 border border-fuchsia-500' : 'bg-slate-950 text-slate-400 border border-slate-800 hover:border-slate-700 hover:text-slate-300'}`}
                                    >
                                        {day.name}
                                    </button>
                                ))}
                            </div>
                            {fixedErrors.days && <p className="mt-2 text-sm text-rose-400 font-bold">{fixedErrors.days}</p>}
                        </div>
                    )}

                    <button type="submit" className="w-full bg-violet-600 text-white font-extrabold py-4 rounded-xl hover:bg-violet-500 transition-colors mt-4">
                        Guardar Plantilla
                    </button>
                </form>
            </div>

            <div>
                <h3 className="text-xl font-bold text-violet-300 mb-4 border-b border-slate-800 pb-2">Mis Plantillas</h3>
                <div className="space-y-4">
                    {fixedExpenses.length === 0 ? (
                        <p className="text-slate-500 font-medium italic text-center">No has creado plantillas de gastos fijos.</p>
                    ) : (
                        fixedExpenses.map(item => (
                            <div key={item.id} className="flex flex-col sm:flex-row justify-between items-center bg-slate-900 p-5 rounded-2xl border border-slate-800 shadow-sm gap-4">
                                <div className="flex-1 w-full">
                                    <p className="font-extrabold text-slate-100">{item.description}</p>
                                    <p className="text-sm font-bold text-rose-400 mt-1">${formatCLP(item.amount)} {item.type === 'weekly' && 'por día'}</p>
                                    {item.type === 'weekly' && (
                                        <div className="flex gap-1 mt-2">
                                            {item.days.map(d => {
                                                const dayName = weekDays.find(w => w.id === d)?.name;
                                                return <span key={d} className="text-xs font-bold bg-fuchsia-500/10 text-fuchsia-300 border border-fuchsia-500/20 px-2 py-1 rounded-md">{dayName}</span>
                                            })}
                                        </div>
                                    )}
                                </div>
                                <div className="flex gap-2 w-full sm:w-auto">
                                    <button
                                        onClick={() => handleApplyToMonth(item)}
                                        className="flex-1 sm:flex-none bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-bold py-3 px-5 rounded-xl hover:shadow-lg hover:shadow-emerald-900/50 transition-all transform hover:-translate-y-1 capitalize"
                                    >
                                        Añadir a {format(currentMonthDate, 'MMMM', { locale: es })}
                                    </button>
                                    <button
                                        onClick={() => handleDeleteFixedExpense(item.id)}
                                        className="bg-rose-500/10 text-rose-400 border border-rose-500/20 font-bold py-3 px-4 rounded-xl hover:bg-rose-500 hover:text-white transition-colors"
                                    >
                                        X
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    )
}

export default FixedExpenses