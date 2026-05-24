import { format, parseISO } from 'date-fns'
import { formatCLP } from '../utils/currency'

function ExpenseList({ currentMonthExpenses, currentMonthKey, handleEdit, handleDelete }) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 to-fuchsia-600 mb-6">
                Movimientos de {currentMonthKey}
            </h2>
            <div className="space-y-4">
                {currentMonthExpenses.length === 0 ? (
                    <div className="text-center py-16 bg-white border-2 border-dashed border-purple-200 rounded-3xl animate-pulse">
                        <div className="text-5xl mb-4">👻</div>
                        <p className="text-purple-500 font-bold text-lg">No hay gastos en este mes.</p>
                    </div>
                ) : (
                    currentMonthExpenses.sort((a, b) => new Date(b.date) - new Date(a.date)).map(expense => (
                        <div key={expense.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-white border-2 border-transparent hover:border-fuchsia-200 shadow-sm rounded-2xl hover:shadow-xl hover:shadow-fuchsia-100/50 transition-all duration-300 hover:-translate-y-1 gap-4">
                            <div className="flex-1">
                                <p className="font-extrabold text-violet-900 text-lg group-hover:text-fuchsia-700 transition-colors">{expense.description}</p>
                                <div className="flex gap-3 mt-2 items-center">
                                    <p className="text-base font-black text-rose-500 bg-rose-50 px-3 py-1 rounded-lg">-${formatCLP(expense.amount)}</p>
                                    <span className="text-sm font-bold text-violet-500 bg-violet-50 px-3 py-1 rounded-lg">
                                        {format(parseISO(expense.date), 'dd-MM-yyyy')}
                                    </span>
                                </div>
                            </div>
                            <div className="flex gap-2 w-full sm:w-auto opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-opacity duration-300">
                                <button
                                    onClick={() => handleEdit(expense)}
                                    className="flex-1 sm:flex-none bg-amber-100 text-amber-700 font-black py-2 px-5 rounded-xl hover:bg-amber-400 hover:text-white transition-all duration-300 transform hover:scale-105"
                                >
                                    Editar
                                </button>
                                <button
                                    onClick={() => handleDelete(expense.id)}
                                    className="flex-1 sm:flex-none bg-rose-100 text-rose-700 font-black py-2 px-5 rounded-xl hover:bg-rose-500 hover:text-white transition-all duration-300 transform hover:scale-105"
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