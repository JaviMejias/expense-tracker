import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faTrash, faTags, faEdit, faTimes, faCheck } from '@fortawesome/free-solid-svg-icons'
import { SYSTEM_CATEGORIES } from '../utils/theme'
import CustomButton from './CustomButton'
import CustomInput from './CustomInput'
import { useThemeStyles } from '../hooks/useThemeStyles'
import ColorSelector from './ColorSelector'
import { useAppAlert } from '../hooks/useAppAlert'
import { useDataStore } from '../store/useDataStore'
import { useThemeStore } from '../store/useThemeStore'
import { appThemes } from '../utils/theme'

function CategoryManager() {
    const { categories, addCategory, updateCategory, getCategoryForDeletion, confirmDeleteCategory } = useDataStore()
    const { themeMode, currentTheme } = useThemeStore()
    const activeTheme = appThemes[currentTheme] || appThemes.classic
    const { s, isDark, textGradientClass, focusRingClass, aura } = useThemeStyles(themeMode, activeTheme)
    const { showAlert, showToast, showConfirm } = useAppAlert(themeMode)

    // Estado para crear nueva categoría
    const [newCatName, setNewCatName] = useState('')
    const [newCatEmoji, setNewCatEmoji] = useState('')
    const [newCatColor, setNewCatColor] = useState('rose')

    // Estado para editar categoría existente
    const [editingCat, setEditingCat] = useState(null) // { id, name, emoji, color }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!newCatName.trim()) {
            showAlert('Campo Requerido', 'Por favor ingresa un nombre para la categoría.')
            return
        }

        const result = addCategory({
            name: newCatName,
            emoji: newCatEmoji || '🏷️',
            color: newCatColor
        })

        if (!result.success) {
            if (result.reason === 'duplicate') {
                showAlert('Categoría Duplicada', 'Ya existe una categoría con ese nombre.')
            }
            return
        }

        setNewCatName('')
        setNewCatEmoji('')
        setNewCatColor('rose')
        showToast(`Categoría creada exitosamente`)
    }

    const handleEditClick = (cat) => {
        // Si ya está editando esta misma, cancelar
        if (editingCat?.id === cat.id) {
            setEditingCat(null)
        } else {
            setEditingCat({ id: cat.id, name: cat.name, emoji: cat.emoji, color: cat.color || 'rose' })
        }
    }

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

    const handleDelete = async (catId) => {
        const result = getCategoryForDeletion(catId)
        if (!result.success) {
            if (result.reason === 'system') {
                showAlert('Acción No Permitida', 'Las categorías del sistema por defecto no se pueden eliminar.', 'error')
            }
            return
        }

        const confirmed = await showConfirm(
            '¿Eliminar categoría?',
            `¿Estás seguro de eliminar "${result.category.name}"? Los gastos registrados se reasignarán a "Otros".`
        )
        if (confirmed.isConfirmed) {
            if (editingCat?.id === catId) setEditingCat(null)
            confirmDeleteCategory(catId)
            showToast(`Categoría "${result.category.name}" eliminada y gastos reasignados`)
        }
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${textGradientClass} mb-6 flex items-center gap-3 transition-colors duration-500`}>
                <FontAwesomeIcon icon={faTags} className={aura.icon} />
                Administrar Categorías
            </h2>

            <div className={`p-6 ${isDark ? 'bg-slate-900/20 border-slate-700/30' : 'bg-slate-100/40 border-slate-200'} border rounded-2xl space-y-6`}>

                {/* Grid de categorías activas */}
                <div>
                    <h4 className={`text-xs font-black ${aura.label} uppercase tracking-widest mb-3`}>Tus Categorías Activas</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                        {categories.map(cat => {
                            const isSystem = SYSTEM_CATEGORIES.includes(cat.id)
                            const isEditing = editingCat?.id === cat.id
                            return (
                                <div
                                    key={cat.id}
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border relative group/item transition-all duration-300
                                        ${isEditing ? 'ring-2 ring-offset-1 ring-indigo-500/70 ' + (isDark ? 'ring-offset-slate-900' : 'ring-offset-white') : ''}
                                        ${cat.colorClass || (isDark ? 'border-slate-700 text-slate-400 bg-slate-800/10' : 'border-slate-200 text-slate-500 bg-white shadow-sm')}
                                        ${aura.hoverItem}`}
                                >
                                    <span className="text-2xl mb-1">{cat.emoji}</span>
                                    <span className={`text-xs font-black uppercase tracking-wide truncate w-full text-center ${isDark ? 'text-slate-100' : 'text-slate-700'}`}>
                                        {cat.name}
                                    </span>

                                    {!isSystem && (
                                        <>
                                            {/* Botón editar — esquina superior izquierda */}
                                            <button
                                                type="button"
                                                onClick={() => handleEditClick(cat)}
                                                className={`absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md select-none border
                                                    opacity-100 sm:opacity-0 group-hover/item:opacity-100 animate-in fade-in duration-200
                                                    ${isEditing
                                                        ? 'bg-indigo-600 hover:bg-indigo-500 border-indigo-400 text-white'
                                                        : (isDark ? 'bg-slate-800/90 hover:bg-indigo-600 border-slate-600/40 hover:border-indigo-400 text-slate-300 hover:text-white' : 'bg-white hover:bg-indigo-600 border-slate-300 hover:border-indigo-400 text-slate-500 hover:text-white shadow')
                                                    }`}
                                                title={isEditing ? 'Cancelar edición' : 'Editar categoría'}
                                            >
                                                <FontAwesomeIcon icon={isEditing ? faTimes : faEdit} className="text-[10px]" />
                                            </button>

                                            {/* Botón eliminar — esquina superior derecha */}
                                            <button
                                                type="button"
                                                onClick={() => handleDelete(cat.id)}
                                                className="absolute -top-1.5 -right-1.5 bg-rose-950/90 hover:bg-rose-600 border border-rose-500/30 hover:border-rose-400 text-rose-300 hover:text-white w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md select-none opacity-100 sm:opacity-0 group-hover/item:opacity-100 animate-in fade-in duration-200"
                                                title="Eliminar categoría"
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="text-[10px]" />
                                            </button>
                                        </>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

                {/* Formulario de edición inline (aparece solo al editar) */}
                {editingCat && (
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
                )}

                {/* Formulario para crear nueva categoría */}
                <div className={`border-t ${isDark ? 'border-slate-800/60' : 'border-slate-200'} pt-5`}>
                    <h4 className={`text-xs font-black ${aura.label} uppercase tracking-widest mb-3`}>Crear Nueva Categoría</h4>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                        <div className="sm:col-span-4">
                            <label htmlFor="newCatName" className={`block text-[10px] font-bold ${aura.label} mb-1.5 uppercase tracking-wider`}>Nombre de Categoría</label>
                            <CustomInput
                                id="newCatName"
                                value={newCatName}
                                onChange={(e) => setNewCatName(e.target.value)}
                                placeholder="Ej: Gimnasio, Mascotas..."
                                s={s}
                                focusRingClass={focusRingClass}
                                className="py-2.5 rounded-xl text-sm font-bold placeholder-slate-500"
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="newCatEmoji" className={`block text-[10px] font-bold ${aura.label} mb-1.5 uppercase tracking-wider`}>Emoji</label>
                            <CustomInput
                                id="newCatEmoji"
                                value={newCatEmoji}
                                onChange={(e) => setNewCatEmoji(e.target.value)}
                                placeholder="🍕, 🐶, ⚽..."
                                s={s}
                                focusRingClass={focusRingClass}
                                className="py-2.5 rounded-xl text-sm font-bold text-center placeholder-slate-500"
                            />
                        </div>
                        <div className="sm:col-span-4 flex flex-col">
                            <span className={`block text-[10px] font-bold ${aura.label} mb-2.5 uppercase tracking-wider`}>Color de Acento</span>
                            <ColorSelector
                                selectedColor={newCatColor}
                                onSelectColor={setNewCatColor}
                                isDark={isDark}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <CustomButton
                                type="submit"
                                variant="primary"
                                icon={faPlus}
                                className="w-full py-2.5 px-4 text-xs uppercase tracking-wider h-[42px]"
                                activeTheme={activeTheme}
                                isDark={isDark}
                            >
                                Crear
                            </CustomButton>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CategoryManager
