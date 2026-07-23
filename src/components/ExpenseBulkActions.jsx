import { faCopy, faTag, faTrash } from '@fortawesome/free-solid-svg-icons'
import CustomButton from './CustomButton'

function ExpenseBulkActions({
    filteredExpenses, selectedIds, handleSelectAllToggle,
    handleBulkAssignCategory, handleBulkDuplicateClick, handleBulkDeleteClick,
    isDark, aura
}) {
    if (filteredExpenses.length === 0) return null

    return (
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between ${isDark ? 'bg-slate-900/30 border-slate-700/50' : 'bg-slate-100/60 border-slate-200'} border p-4 rounded-2xl mb-6 gap-4 animate-in fade-in slide-in-from-top-2 duration-300`}>
            <div className="flex items-center gap-3">
                <label className={`flex items-center gap-3 cursor-pointer text-sm font-bold transition-colors select-none ${isDark ? 'text-slate-300' : 'text-slate-700'} ${aura.listHoverText}`}>
                    <input
                        type="checkbox"
                        checked={filteredExpenses.length > 0 && selectedIds.length === filteredExpenses.length}
                        ref={(input) => {
                            if (input) {
                                input.indeterminate = selectedIds.length > 0 && selectedIds.length < filteredExpenses.length;
                            }
                        }}
                        onChange={handleSelectAllToggle}
                        className={`w-5 h-5 rounded-md transition-all cursor-pointer ${aura.listCheckbox}`}
                    />
                    <span>Seleccionar todos ({filteredExpenses.length})</span>
                </label>
            </div>

            {selectedIds.length > 0 && (
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto animate-in fade-in zoom-in-95 duration-200">
                    <span className={`text-sm font-black px-3 py-1.5 rounded-xl w-full sm:w-auto text-center border ${aura.badge}`}>
                        {selectedIds.length} {selectedIds.length === 1 ? 'seleccionado' : 'seleccionados'}
                    </span>
                    <div className="flex gap-2 w-full sm:w-auto">
                        <CustomButton
                            onClick={handleBulkAssignCategory}
                            variant="custom"
                            icon={faTag}
                            className={`flex-1 sm:flex-none py-2.5 px-4 text-sm shadow-md ${aura.listActionBtn}`}
                        >
                            Categoría
                        </CustomButton>
                        <CustomButton
                            onClick={handleBulkDuplicateClick}
                            variant="custom"
                            icon={faCopy}
                            className={`flex-1 sm:flex-none py-2.5 px-4 text-sm shadow-md ${aura.listActionBtn}`}
                        >
                            Duplicar
                        </CustomButton>
                        <CustomButton
                            onClick={handleBulkDeleteClick}
                            variant="danger"
                            icon={faTrash}
                            className="flex-1 sm:flex-none py-2.5 px-4 text-sm"
                        >
                            Eliminar
                        </CustomButton>
                    </div>
                </div>
            )}
        </div>
    )
}

export default ExpenseBulkActions
