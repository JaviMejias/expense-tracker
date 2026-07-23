import { useState, useEffect } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus, faEdit, faCheck } from '@fortawesome/free-solid-svg-icons'
import CustomButton from './CustomButton'
import CustomInput from './CustomInput'
import ColorSelector from './ColorSelector'
import { useDataStore } from '../store/useDataStore'
import { useAppAlert } from '../hooks/useAppAlert'
import { motion } from 'framer-motion'

function CategoryForm({ editingCat, onCancel, isDark, activeTheme, aura, s, focusRingClass }) {
    const { addCategory, updateCategory } = useDataStore()
    const { showAlert, showToast } = useAppAlert(isDark ? 'dark' : 'light')

    const [catName, setCatName] = useState('')
    const [catEmoji, setCatEmoji] = useState('')
    const [catColor, setCatColor] = useState('rose')

    useEffect(() => {
        if (editingCat) {
            setCatName(editingCat.name)
            setCatEmoji(editingCat.emoji || '🏷️')
            setCatColor(editingCat.color || 'rose')
        } else {
            setCatName('')
            setCatEmoji('')
            setCatColor('rose')
        }
    }, [editingCat])

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!catName.trim()) {
            showAlert('Campo Requerido', 'Por favor ingresa un nombre para la categoría.')
            return
        }

        if (editingCat) {
            const result = updateCategory(editingCat.id, {
                name: catName.trim(),
                emoji: catEmoji || '🏷️',
                color: catColor
            })
            if (!result.success) {
                if (result.reason === 'duplicate') showAlert('Categoría Duplicada', 'Ya existe una categoría con ese nombre.')
                return
            }
            showToast('Categoría actualizada correctamente ✏️')
        } else {
            const result = addCategory({
                name: catName.trim(),
                emoji: catEmoji || '🏷️',
                color: catColor
            })
            if (!result.success) {
                if (result.reason === 'duplicate') showAlert('Categoría Duplicada', 'Ya existe una categoría con ese nombre.')
                return
            }
            showToast('Categoría creada exitosamente')
        }
        
        onCancel() // close form
    }

    return (
        <motion.form
            initial={{ opacity: 0, height: 0, scale: 0.95, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', scale: 1, marginBottom: 32 }}
            exit={{ opacity: 0, height: 0, scale: 0.95, marginBottom: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            onSubmit={handleSubmit}
            className={`overflow-hidden border ${isDark ? 'border-slate-700/50 bg-slate-800/40' : 'border-slate-200 bg-slate-50'} p-5 sm:p-6 rounded-3xl`}
        >
            <h4 className={`text-xs font-black ${aura.label} uppercase tracking-widest mb-4 flex items-center gap-2`}>
                {editingCat ? (
                    <>
                        <FontAwesomeIcon icon={faEdit} />
                        Editando: <span className="text-base">{editingCat.emoji}</span> {editingCat.name}
                    </>
                ) : (
                    <>
                        <FontAwesomeIcon icon={faPlus} />
                        Crear Nueva Categoría
                    </>
                )}
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                <div className="sm:col-span-4">
                    <label className={`block text-[10px] font-bold ${aura.label} mb-1.5 uppercase tracking-wider`}>Nombre</label>
                    <CustomInput
                        value={catName}
                        onChange={(e) => setCatName(e.target.value)}
                        placeholder="Ej: Gimnasio, Mascotas..."
                        s={s}
                        focusRingClass={focusRingClass}
                        className="py-2.5 rounded-xl text-sm font-bold placeholder-slate-500"
                    />
                </div>
                <div className="sm:col-span-2">
                    <label className={`block text-[10px] font-bold ${aura.label} mb-1.5 uppercase tracking-wider`}>Emoji</label>
                    <CustomInput
                        value={catEmoji}
                        onChange={(e) => setCatEmoji(e.target.value)}
                        placeholder="🍕, 🐶..."
                        s={s}
                        focusRingClass={focusRingClass}
                        className="py-2.5 rounded-xl text-sm font-bold text-center placeholder-slate-500"
                    />
                </div>
                <div className="sm:col-span-3 flex flex-col">
                    <span className={`block text-[10px] font-bold ${aura.label} mb-2.5 uppercase tracking-wider`}>Color</span>
                    <ColorSelector
                        selectedColor={catColor}
                        onSelectColor={setCatColor}
                        isDark={isDark}
                    />
                </div>
                <div className="sm:col-span-3 flex gap-2">
                    <CustomButton
                        type="submit"
                        variant="primary"
                        icon={editingCat ? faCheck : faPlus}
                        className="flex-1 py-2.5 px-3 text-xs uppercase tracking-wider h-[42px]"
                        activeTheme={activeTheme}
                        isDark={isDark}
                    >
                        {editingCat ? 'Guardar' : 'Crear'}
                    </CustomButton>
                    <button
                        type="button"
                        onClick={onCancel}
                        className={`flex-1 py-2.5 px-3 rounded-xl text-xs font-black uppercase tracking-wider h-[42px] transition-all cursor-pointer border ${isDark ? 'border-slate-700 text-slate-400 hover:bg-slate-800 hover:text-slate-200' : 'border-slate-300 text-slate-500 hover:bg-slate-100 hover:text-slate-700'}`}
                    >
                        Cancelar
                    </button>
                </div>
            </div>
        </motion.form>
    )
}

export default CategoryForm
