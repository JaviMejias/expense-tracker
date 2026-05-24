import DatePicker from 'react-datepicker'

function ExpenseForm({
    editingId,
    expenseDate,
    setExpenseDate,
    description,
    setDescription,
    amount,
    handleAmountChange,
    errors,
    handleSubmit,
    handleCancelEdit
}) {
    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className="text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400 mb-6">
                {editingId ? 'Editar Movimiento' : 'Nuevo Movimiento'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="group">
                    <label className="block text-sm font-bold text-violet-300 mb-2 group-hover:text-fuchsia-400 transition-colors">
                        Fecha:
                    </label>
                    <DatePicker
                        selected={expenseDate}
                        onChange={(date) => setExpenseDate(date)}
                        dateFormat="dd-MM-yyyy"
                        locale="es"
                        wrapperClassName="w-full"
                        className="block w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 font-bold focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500 transition-all cursor-pointer shadow-inner hover:border-slate-600"
                    />
                    {errors.expenseDate && <p className="mt-2 text-sm text-rose-400 font-bold animate-pulse">{errors.expenseDate}</p>}
                </div>

                <div className="group">
                    <label htmlFor="descriptionInput" className="block text-sm font-bold text-violet-300 mb-2 group-hover:text-fuchsia-400 transition-colors">
                        Descripción:
                    </label>
                    <input
                        type="text"
                        id="descriptionInput"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Ej: Salida fin de semana"
                        className="block w-full px-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 font-medium focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500 transition-all shadow-inner hover:border-slate-600 placeholder-slate-700"
                    />
                    {errors.description && <p className="mt-2 text-sm text-rose-400 font-bold animate-pulse">{errors.description}</p>}
                </div>

                <div className="group">
                    <label htmlFor="amountInput" className="block text-sm font-bold text-violet-300 mb-2 group-hover:text-fuchsia-400 transition-colors">
                        Monto:
                    </label>
                    <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <span className="text-fuchsia-500 font-extrabold text-lg">$</span>
                        </div>
                        <input
                            type="text"
                            id="amountInput"
                            value={amount}
                            onChange={handleAmountChange}
                            placeholder="0"
                            className="block w-full pl-10 pr-5 py-4 bg-slate-950 border border-slate-800 rounded-2xl text-slate-100 font-bold text-lg focus:bg-slate-900 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 focus:border-fuchsia-500 transition-all shadow-inner hover:border-slate-600 placeholder-slate-700"
                        />
                    </div>
                    {errors.amount && <p className="mt-2 text-sm text-rose-400 font-bold animate-pulse">{errors.amount}</p>}
                </div>

                <div className="flex gap-4 pt-4">
                    <button
                        type="submit"
                        className="flex-1 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-extrabold py-4 px-6 rounded-2xl hover:from-violet-500 hover:to-fuchsia-500 focus:outline-none focus:ring-2 focus:ring-fuchsia-500/50 transition-all duration-300 transform hover:-translate-y-1 shadow-lg hover:shadow-fuchsia-900/50"
                    >
                        {editingId ? 'Guardar Cambios' : 'Agregar'}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            onClick={handleCancelEdit}
                            className="flex-1 bg-slate-800 text-slate-300 border border-slate-700 font-extrabold py-4 px-6 rounded-2xl hover:bg-slate-700 hover:border-slate-600 transition-all duration-300 transform hover:-translate-y-1"
                        >
                            Cancelar
                        </button>
                    )}
                </div>
            </form>
        </div>
    )
}

export default ExpenseForm