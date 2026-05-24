import { useState } from 'react'
import { format, parseISO, startOfMonth, endOfMonth, startOfDay, endOfDay } from 'date-fns'
import { es } from 'date-fns/locale'
import DatePicker from 'react-datepicker'
import { formatCLP } from '../utils/currency'

function ExpenseList({ expenses, handleEdit, handleDelete }) {
    const [startDate, setStartDate] = useState(startOfMonth(new Date()))
    const [endDate, setEndDate] = useState(endOfMonth(new Date()))

    const filteredExpenses = expenses.filter(expense => {
        const expenseDate = parseISO(expense.date)
        return expenseDate >= startOfDay(startDate) && expenseDate <= endOfDay(endDate)
    })

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
                <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                    Tus Movimientos
                </h2>
            </div>

            <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800 mb-6 flex flex-col sm:flex-row gap-4">
                <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Desde</label>
                    <DatePicker
                        selected={startDate}
                        onChange={(date) => setStartDate(date)}
                        dateFormat="dd-MM-yyyy"
                        locale="es"
                        wrapperClassName="w-full"
                        className="block w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 font-bold focus:bg-slate-800 focus:outline-none focus:border-fuchsia-500 transition-all cursor-pointer"
                    />
                </div>
                <div className="flex-1">
                    <label className="block text-xs font-bold text-slate-400 mb-1 uppercase tracking-wider">Hasta</label>
                    <DatePicker
                        selected={endDate}
                        onChange={(date) => setEndDate(date)}
                        dateFormat="dd-MM-yyyy"
                        locale="es"
                        wrapperClassName="w-full"
                        className="block w-full px-4 py-3 bg-slate-900 border border-slate-800 rounded-xl text-slate-100 font-bold focus:bg-slate-800 focus:outline-none focus:border-fuchsia-500 transition-all cursor-pointer"
                    />
                </div>
            </div>

            <div className="space-y-4">
                {filteredExpenses.length === 0 ? (
                    <div className="text-center py-16 bg-slate-900/50 border border-dashed border-slate-700 rounded-3xl animate-pulse">
                        <div className="text-5xl mb-4">👻</div>
                        <p className="text-slate-400 font-bold text-lg">No hay gastos en estas fechas.</p>
                    </div>
                ) : (
                    filteredExpenses.sort((a, b) => new Date(b.date) - new Date(a.date)).map(expense => (
                        <div key={expense.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-900 border border-slate-800 hover:border-fuchsia-500/30 shadow-sm rounded-2xl hover:shadow-lg hover:shadow-fuchsia-900/20 transition-all duration-300 hover:-translate-y-1 gap-4">
                            <div className="flex-1">
                                <p className="font-extrabold text-slate-100 text-lg group-hover:text-fuchsia-300 transition-colors">{expense.description}</p>
                                <div className="flex gap-3 mt-2 items-center">
                                    <p className="text-base font-black text-rose-400 bg-rose-400/10 border border-rose-400/20 px-3 py-1 rounded-lg">-${formatCLP(expense.amount)}</p>
                                    <span className="text-sm font-bold text-violet-300 bg-violet-400/10 border border-violet-400/20 px-3 py-1 rounded-lg">
                                        {format(parseISO(expense.date), 'dd-MM-yyyy')}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                    onClick={() => handleEdit(expense)}
                                    className="flex-1 sm:flex-none bg-amber-500/10 border border-amber-500/20 text-amber-400 font-black py-2 px-5 rounded-xl hover:bg-amber-500 hover:text-slate-950 transition-all duration-300 transform hover:scale-105"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(expense.id)}
                                    className="flex-1 sm:flex-none bg-rose-500/10 border border-rose-500/20 text-rose-400 font-black py-2 px-5 rounded-xl hover:bg-rose-500 hover:text-white transition-all duration-300 transform hover:scale-105"
                                >
                                    Eliminar
                                </button>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}

export default ExpenseList