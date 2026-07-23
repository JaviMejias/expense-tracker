import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEdit, faCheck } from '@fortawesome/free-solid-svg-icons'
import CustomButton from './CustomButton'
import CustomInput from './CustomInput'
import ColorSelector from './ColorSelector'
import { useDataStore } from '../store/useDataStore'
import { useAppAlert } from '../hooks/useAppAlert'

function CategoryEditForm({ editingCat, setEditingCat, isDark, activeTheme, aura, s, focusRingClass }) {
    const { updateCategory } = useDataStore()
    const { showAlert, showToast } = useAppAlert(isDark ? 'dark' : 'light')

    const handleEditSave = (e) => {
        e.preventDefault()
        if (!editingCat.name.trim()) {
            showAlert('Campo Requerido', 'Por favor ingresa un nombre para la categoría.')
            return
        }
        const result = updateCategory(editingCat.id, {
            name: editingCat.name,
            emoji: editingCat.emoji,
            color: editingCat.color
        })
        if (!result.success) {
            if (result.reason === 'duplicate') {
                showAlert('Categoría Duplicada', 'Ya existe una categoría con ese nombre.')
            }
            return
        }
        showToast('Categoría actualizada correctamente ✏️')
        setEditingCat(null)
    }

    return (
        <div className={`border-t ${isDark ? 'border-indigo-500/20 bg-indigo-500/5' : 'border-indigo-200 bg-indigo-50/50'} border rounded-xl p-5 animate-in fade-in slide-in-from-top-2 duration-300`}>
            <h4 className={`text-xs font-black ${aura.label} uppercase tracking-widest mb-4 flex items-center gap-2`}>
                <FontAwesomeIcon icon={faEdit} />
                Editando: <span className="text-base">{editingCat.emoji}</span> {editingCat.name}
            </h4>
            <form onSubmit={handleEditSave} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                <div className="sm:col-span-4">
                    <label className={`block text-[10px] font-bold ${aura.label} mb-1.5 uppercase tracking-wider`}>Nombre</label>
                    <CustomInput
                        value={editingCat.name}
                        onChange={(e) => setEditingCat(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Nombre de la categoría"
                        s={s}
                        focusRingClass={focusRingClass}
                        className="py-2.5 rounded-xl text-sm font-bold placeholder-slate-500"
                    />
                </div>
                <div className="sm:col-span-2">
                    <label className={`block text-[10px] font-bold ${aura.label} mb-1.5 uppercase tracking-wider`}>Emoji</label>
                    <CustomInput
                        value={editingCat.emoji}
                        onChange={(e) => setEditingCat(prev => ({ ...prev, emoji: e.target.value }))}
                        placeholder="🏷️"
                        s={s}
                        focusRingClass={focusRingClass}
                        className="py-2.5 rounded-xl text-sm font-bold text-center placeholder-slate-500"
                    />
                </div>
                <div className="sm:col-span-3 flex flex-col">
                    <span className={`block text-[10px] font-bold ${aura.label} mb-2.5 uppercase tracking-wider`}>Color</span>
                    <ColorSelector
                        selectedColor={editingCat.color}
                        onSelectColor={(color) => setEditingCat(prev => ({ ...prev, color }))}
                        isDark={isDark}
                    />
                </div>
                <div className="sm:col-span-3 flex gap-2">
                    <CustomButton
                        type="submit"
                        variant="primary"
                        icon={faCheck}
                        className="flex-1 py-2.5 px-3 text-xs uppercase tracking-wider h-[42px]"
                        activeTheme={activeTheme}
                        isDark={isDark}
                    >
                        Guardar
                    </CustomButton>
                    <button
                        type="button"
                        onClick={() => setEditingCat(null)}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider h-[42px] transition-all cursor-pointer border ${isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'border-slate-300 text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
                    >
                        Cancelar
                    </button>
                </div>
            </form>
        </div>
    )
}

export default CategoryEditForm
