import { useState } from 'react'
import Swal from 'sweetalert2'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTags, faTrash, faPlus } from '@fortawesome/free-solid-svg-icons'
import { colorThemes, getThemeClass } from '../utils/theme'

function CategoryManager({ categories = [], handleAddCategory, handleDeleteCategory, themeMode = 'dark', activeTheme }) {
    const [newCatName, setNewCatName] = useState('')
    const [newCatEmoji, setNewCatEmoji] = useState('')
    const [newCatColor, setNewCatColor] = useState('rose')

    const s = getThemeClass(themeMode)
    const isDark = themeMode === 'dark'

    const handleSubmit = (e) => {
        e.preventDefault()
        if (!newCatName.trim()) {
            Swal.fire({
                title: 'Campo Requerido',
                text: 'Por favor ingresa un nombre para la categoría.',
                icon: 'warning',
                background: s.swal.background,
                color: s.swal.color,
                confirmButtonColor: s.swal.confirmButtonColor
            })
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

    const textGradientClass = activeTheme ? (isDark ? activeTheme.textGradient : activeTheme.textGradientLight) : (isDark ? 'from-indigo-400 to-purple-400' : 'from-indigo-600 to-purple-600')
    const primaryButtonClass = activeTheme ? `${activeTheme.accentBgColor} ${activeTheme.accentHoverBgColor}` : 'bg-indigo-600 hover:bg-indigo-500'

    const activeColor = activeTheme?.accentBgColor?.includes('rose') ? 'rose' : activeTheme?.accentBgColor?.includes('emerald') ? 'emerald' : 'indigo'
    const focusRingClass = { rose: 'focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500', emerald: 'focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500', indigo: 'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500' }[activeColor]

    const auraStyles = {
        rose: {
            icon: 'text-rose-500',
            label: isDark ? 'text-rose-300' : 'text-rose-600',
            hoverItem: 'hover:border-rose-500/50 hover:shadow-md hover:shadow-rose-500/10'
        },
        emerald: {
            icon: 'text-emerald-500',
            label: isDark ? 'text-emerald-300' : 'text-emerald-600',
            hoverItem: 'hover:border-emerald-500/50 hover:shadow-md hover:shadow-emerald-500/10'
        },
        indigo: {
            icon: 'text-indigo-500',
            label: isDark ? 'text-indigo-300' : 'text-indigo-600',
            hoverItem: 'hover:border-indigo-500/50 hover:shadow-md hover:shadow-indigo-500/10'
        }
    }[activeColor]

    return (
        <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <h2 className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${textGradientClass} mb-6 flex items-center gap-3 transition-colors duration-500`}>
                <FontAwesomeIcon icon={faTags} className={auraStyles.icon} />
                Administrar Categorías
            </h2>

            <div className={`p-6 ${isDark ? 'bg-slate-900/20 border-slate-700/30' : 'bg-slate-100/40 border-slate-200'} border rounded-2xl space-y-6`}>
                <div>
                    <h4 className={`text-xs font-black ${auraStyles.label} uppercase tracking-widest mb-3`}>Tus Categorías Activas</h4>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                        {categories.map(cat => {
                            const isSystem = ['comida', 'servicios', 'transporte', 'entretencion', 'salud', 'otros'].includes(cat.id)
                            return (
                                <div
                                    key={cat.id}
                                    className={`flex flex-col items-center justify-center p-4 rounded-xl border relative group/item transition-all duration-300 ${cat.colorClass || (isDark ? 'border-slate-700 text-slate-400 bg-slate-800/10' : 'border-slate-200 text-slate-500 bg-white shadow-sm')} ${auraStyles.hoverItem}`}
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
                    <h4 className={`text-xs font-black ${auraStyles.label} uppercase tracking-widest mb-3`}>Crear Nueva Categoría</h4>
                    <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-end">
                        <div className="sm:col-span-4">
                            <label htmlFor="newCatName" className={`block text-[10px] font-bold ${auraStyles.label} mb-1.5 uppercase tracking-wider`}>Nombre de Categoría</label>
                            <input
                                type="text"
                                id="newCatName"
                                value={newCatName}
                                onChange={(e) => setNewCatName(e.target.value)}
                                placeholder="Ej: Gimnasio, Mascotas..."
                                className={`block w-full px-4 py-2.5 ${s.input} ${focusRingClass} rounded-xl text-sm font-bold placeholder-slate-500`}
                            />
                        </div>
                        <div className="sm:col-span-2">
                            <label htmlFor="newCatEmoji" className={`block text-[10px] font-bold ${auraStyles.label} mb-1.5 uppercase tracking-wider`}>Emoji</label>
                            <input
                                type="text"
                                id="newCatEmoji"
                                value={newCatEmoji}
                                onChange={(e) => setNewCatEmoji(e.target.value)}
                                placeholder="🍕, 🐶, ⚽..."
                                className={`block w-full px-4 py-2.5 ${s.input} ${focusRingClass} rounded-xl text-sm font-bold text-center placeholder-slate-500`}
                            />
                        </div>
                        <div className="sm:col-span-4 flex flex-col">
                            <span className={`block text-[10px] font-bold ${auraStyles.label} mb-2.5 uppercase tracking-wider`}>Color de Acento</span>
                            <div className="flex gap-2 items-center h-10">
                                {Object.keys(colorThemes).map(themeKey => {
                                    const theme = colorThemes[themeKey]
                                    const isSelected = newCatColor === themeKey
                                    const colorDotClasses = {
                                        rose: 'bg-rose-500 ring-rose-500/40',
                                        blue: 'bg-blue-500 ring-blue-500/40',
                                        amber: 'bg-amber-500 ring-amber-500/40',
                                        emerald: 'bg-emerald-500 ring-emerald-500/40',
                                        pink: 'bg-pink-500 ring-pink-500/40',
                                        violet: 'bg-violet-500 ring-violet-500/40',
                                        sky: 'bg-sky-500 ring-sky-500/40',
                                        slate: 'bg-slate-500 ring-slate-500/40'
                                    }
                                    return (
                                        <button
                                            key={themeKey}
                                            type="button"
                                            onClick={() => setNewCatColor(themeKey)}
                                            className={`w-6 h-6 rounded-full ${colorDotClasses[themeKey]} cursor-pointer transform hover:scale-125 transition-all outline-none ${isSelected ? `ring-4 ring-offset-2 ${isDark ? 'ring-offset-slate-900' : 'ring-offset-white'} scale-110` : 'opacity-60 hover:opacity-100'}`}
                                            title={theme.label}
                                        ></button>
                                    )
                                })}
                            </div>
                        </div>
                        <div className="sm:col-span-2">
                            <button
                                type="submit"
                                className={`w-full ${primaryButtonClass} text-white font-extrabold py-2.5 px-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-1.5 cursor-pointer text-xs uppercase select-none tracking-wider h-[42px]`}
                            >
                                <FontAwesomeIcon icon={faPlus} /> Crear
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default CategoryManager
