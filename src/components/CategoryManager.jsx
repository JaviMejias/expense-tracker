import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTags, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { colorThemes, SYSTEM_CATEGORIES } from '../utils/theme'
import CustomButton from './CustomButton'
import CustomInput from './CustomInput'
import { useThemeStyles } from '../hooks/useThemeStyles'
import ColorSelector from './ColorSelector'
import { useAppAlert } from '../hooks/useAppAlert'

function CategoryManager({ categories = [], handleAddCategory, handleDeleteCategory, themeMode = 'dark', activeTheme }) {
    const [newCatName, setNewCatName] = useState('')
    const [newCatEmoji, setNewCatEmoji] = useState('')
    const [newCatColor, setNewCatColor] = useState('rose')

    const { s, isDark, textGradientClass, focusRingClass, aura } = useThemeStyles(themeMode, activeTheme)
    const { showAlert } = useAppAlert(themeMode)

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!newCatName.trim()) {
            showAlert('Campo Requerido', 'Por favor ingresa un nombre para la categoría.')
            return
        }

        const success = handleAddCategory({
            name: newCatName,
            emoji: newCatEmoji || '🏷️',
            color: newCatColor
        })

        if (success) {
            setNewCatName('')
            setNewCatEmoji('')
            setNewCatColor('rose')
        }
    }

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${textGradientClass} mb-6 flex items-center gap-3 transition-colors duration-500`}>
                <FontAwesomeIcon icon={faTags} className={aura.icon} />
                Administrar Categorías
            </h2>

            <div className={`p-6 ${isDark ? 'bg-slate-900/20 border-slate-700/30' : 'bg-slate-100/40 border-slate-200'} border rounded-2xl space-y-6`}>
                <div>
                    <h4 className={`text-xs font-black ${aura.label} uppercase tracking-widest mb-3`}>Tus Categorías Activas</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                        {categories.map(cat => {
                            const isSystem = SYSTEM_CATEGORIES.includes(cat.id)
                            return (
                                <div
                                    key={cat.id}
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border relative group/item transition-all duration-300 ${cat.colorClass || (isDark ? 'border-slate-700 text-slate-400 bg-slate-800/10' : 'border-slate-200 text-slate-500 bg-white shadow-sm')} ${aura.hoverItem}`}
                                >
                                    <span className="text-2xl mb-1">{cat.emoji}</span>
                                    <span className={`text-xs font-black uppercase tracking-wide truncate w-full text-center ${isDark ? 'text-slate-100' : 'text-slate-700'}`}>{cat.name}</span>

                                    {!isSystem && (
                                        <button
                                            type="button"
                                            onClick={() => handleDeleteCategory(cat.id)}
                                            className="absolute -top-1.5 -right-1.5 bg-rose-950/90 hover:bg-rose-600 border border-rose-500/30 hover:border-rose-400 text-rose-300 hover:text-white w-6 h-6 rounded-full flex items-center justify-center transition-all cursor-pointer shadow-md select-none opacity-100 sm:opacity-0 group-hover/item:opacity-100 animate-in fade-in duration-200"
                                            title="Eliminar categoría"
                                        >
                                            <FontAwesomeIcon icon={faTrash} className="text-[10px]" />
                                        </button>
                                    )}
                                </div>
                            )
                        })}
                    </div>
                </div>

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
