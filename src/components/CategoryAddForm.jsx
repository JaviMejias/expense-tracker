import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faPlus } from '@fortawesome/free-solid-svg-icons'
import CustomButton from './CustomButton'
import CustomInput from './CustomInput'
import ColorSelector from './ColorSelector'
import { useDataStore } from '../store/useDataStore'
import { useAppAlert } from '../hooks/useAppAlert'

function CategoryAddForm({ isDark, activeTheme, aura, s, focusRingClass }) {
    const { addCategory } = useDataStore()
    const { showAlert, showToast } = useAppAlert(isDark ? 'dark' : 'light')

    const [newCatName, setNewCatName] = useState('')
    const [newCatEmoji, setNewCatEmoji] = useState('')
    const [newCatColor, setNewCatColor] = useState('rose')

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

    return (
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
    )
}

export default CategoryAddForm
