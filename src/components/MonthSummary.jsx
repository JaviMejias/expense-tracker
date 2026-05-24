import DatePicker from 'react-datepicker'
import { formatCLP } from '../utils/currency'

function MonthSummary({
    currentMonthDate,
    setCurrentMonthDate,
    displaySalary,
    handleSalaryChange,
    errors,
    totalExpenses,
    remainingSalary
}) {
    return (
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-slate-800 p-6 sm:p-8 hover:border-slate-700 transition-all duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="group">
                    <label className="block text-sm font-bold text-violet-300 mb-2 group-hover:text-fuchsia-400 transition-colors">
                        Mes a Gestionar:
                    </label>
                    <DatePicker
                        selected={currentMonthDate}
                        onChange={(date) => setCurrentMonthDate(date)}
                        dateFormat="MM-yyyy"
                        showMonthYearPicker
                        locale="es"
                        wrapperClassName="w-full"
                        className="block w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 font-bold focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500 transition-all cursor-pointer shadow-inner hover:border-slate-600"
                    />
                </div>
                <div className="group">
                    <label htmlFor="salaryInput" className="block text-sm font-bold text-violet-300 mb-2 group-hover:text-fuchsia-400 transition-colors">
                        Sueldo del Mes:
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <span className="text-fuchsia-500 font-extrabold text-lg">$</span>
                        </div>
                        <input
                            type="text"
                            id="salaryInput"
                            value={displaySalary}
                            onChange={handleSalaryChange}
                            placeholder="0"
                            className="block w-full pl-10 pr-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 font-bold text-lg focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500 transition-all shadow-inner hover:border-slate-600 placeholder-slate-600"
                        />
                    </div>
                    {errors.salary && <p className="mt-2 text-sm text-rose-400 font-bold animate-pulse">{errors.salary}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-slate-800 pt-8">
                <div className="relative overflow-hidden bg-gradient-to-br from-rose-950 to-pink-950 border border-rose-900 rounded-3xl p-6 text-center transform hover:-translate-y-1 hover:shadow-lg hover:shadow-rose-900/30 transition-all duration-300 group">
                    <div className="absolute inset-0 bg-white/5 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                    <p className="text-xs font-black text-rose-300 uppercase tracking-widest mb-2">Total Gastado</p>
                    <p className="text-3xl font-extrabold text-white drop-shadow-md">${formatCLP(totalExpenses)}</p>
                </div>
                <div className={`relative overflow-hidden rounded-3xl p-6 text-center transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group ${remainingSalary < 0 ? 'bg-gradient-to-br from-red-950 to-rose-950 border border-red-900 hover:shadow-red-900/30' : 'bg-gradient-to-br from-emerald-950 to-teal-950 border border-emerald-900 hover:shadow-emerald-900/30'}`}>
                    <div className="absolute inset-0 bg-white/5 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                    <p className="text-xs font-black text-slate-300 uppercase tracking-widest mb-2">Saldo Disponible</p>
                    <p className="text-3xl font-extrabold text-white drop-shadow-md">${formatCLP(remainingSalary)}</p>
                </div>
            </div>
        </div>
    )
}

export default MonthSummary