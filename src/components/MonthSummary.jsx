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
        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-purple-200/50 border border-white p-6 sm:p-8 hover:shadow-2xl hover:shadow-purple-200/60 transition-all duration-500">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                <div className="group">
                    <label className="block text-sm font-bold text-violet-900 mb-2 group-hover:text-fuchsia-600 transition-colors">
                        Mes a Gestionar:
                    </label>
                    <DatePicker
                        selected={currentMonthDate}
                        onChange={(date) => setCurrentMonthDate(date)}
                        dateFormat="MM-yyyy"
                        showMonthYearPicker
                        locale="es"
                        wrapperClassName="w-full"
                        className="block w-full px-5 py-4 bg-white border-2 border-purple-100 rounded-2xl text-purple-900 font-bold focus:bg-white focus:outline-none focus:ring-4 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all cursor-pointer shadow-sm hover:border-purple-300"
                    />
                </div>
                <div className="group">
                    <label htmlFor="salaryInput" className="block text-sm font-bold text-violet-900 mb-2 group-hover:text-fuchsia-600 transition-colors">
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
                            className="block w-full pl-10 pr-5 py-4 bg-white border-2 border-purple-100 rounded-2xl text-purple-900 font-bold text-lg focus:bg-white focus:outline-none focus:ring-4 focus:ring-fuchsia-500/20 focus:border-fuchsia-500 transition-all shadow-sm hover:border-purple-300"
                        />
                    </div>
                    {errors.salary && <p className="mt-2 text-sm text-pink-600 font-bold animate-pulse">{errors.salary}</p>}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 border-t border-purple-100/50 pt-8">
                <div className="relative overflow-hidden bg-gradient-to-br from-pink-500 to-rose-500 rounded-3xl p-6 text-center transform hover:-translate-y-1 hover:shadow-lg hover:shadow-rose-500/30 transition-all duration-300 group">
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                    <p className="text-xs font-black text-rose-100 uppercase tracking-widest mb-2">Total Gastado</p>
                    <p className="text-3xl font-extrabold text-white drop-shadow-md">${formatCLP(totalExpenses)}</p>
                </div>
                <div className={`relative overflow-hidden rounded-3xl p-6 text-center transform hover:-translate-y-1 hover:shadow-lg transition-all duration-300 group ${remainingSalary < 0 ? 'bg-gradient-to-br from-red-500 to-rose-600 hover:shadow-red-500/30' : 'bg-gradient-to-br from-emerald-400 to-teal-500 hover:shadow-emerald-500/30'}`}>
                    <div className="absolute inset-0 bg-white/20 transform -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-in-out"></div>
                    <p className="text-xs font-black text-white/80 uppercase tracking-widest mb-2">Saldo Disponible</p>
                    <p className="text-3xl font-extrabold text-white drop-shadow-md">${formatCLP(remainingSalary)}</p>
                </div>
            </div>
        </div>
    )
}

export default MonthSummary