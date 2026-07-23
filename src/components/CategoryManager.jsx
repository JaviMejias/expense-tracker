import { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faTrash, faTags, faEdit, faTimes, faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'
import { SYSTEM_CATEGORIES, appThemes } from '../utils/theme'
import { useThemeStyles } from '../hooks/useThemeStyles'
import { useAppAlert } from '../hooks/useAppAlert'
import { useDataStore } from '../store/useDataStore'
import { useThemeStore } from '../store/useThemeStore'
import CategoryForm from './CategoryForm'
import { motion, AnimatePresence } from 'framer-motion'

function CategoryManager() {
    const { categories, getCategoryForDeletion, confirmDeleteCategory } = useDataStore()
    const { themeMode, currentTheme } = useThemeStore()
    const activeTheme = appThemes[currentTheme] || appThemes.classic
    const { s, isDark, textGradientClass, focusRingClass, aura } = useThemeStyles(themeMode, activeTheme)
    const { showAlert, showToast, showConfirm } = useAppAlert(themeMode)

    const [editingCat, setEditingCat] = useState(null)
    const [showForm, setShowForm] = useState(false)

    const handleEditClick = (cat) => {
        if (editingCat?.id === cat.id) {
            setEditingCat(null)
            setShowForm(false)
        } else {
            setEditingCat({ id: cat.id, name: cat.name, emoji: cat.emoji, color: cat.color || 'rose' })
            setShowForm(true)
        }
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
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <h2 className={`text-2xl font-black text-transparent bg-clip-text bg-gradient-to-r ${textGradientClass} flex items-center gap-3 transition-colors duration-500`}>
                    <FontAwesomeIcon icon={faTags} className={aura.icon} />
                    Administrar Categorías
                </h2>
                <button
                    type="button"
                    onClick={() => {
                        if (showForm) {
                            setShowForm(false)
                            setEditingCat(null)
                        } else {
                            setEditingCat(null)
                            setShowForm(true)
                        }
                    }}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black uppercase tracking-wider border transition-all cursor-pointer
                        ${showForm
                            ? (isDark ? 'bg-slate-700 border-slate-600 text-slate-300' : 'bg-slate-200 border-slate-300 text-slate-600')
                            : (isDark ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300 hover:bg-indigo-500/30' : 'bg-indigo-50 border-indigo-200 text-indigo-600 hover:bg-indigo-100')
                        }`}
                >
                    <FontAwesomeIcon icon={showForm ? faChevronUp : faChevronDown} />
                    {showForm ? 'Cerrar' : 'Nueva Categoría'}
                </button>
            </div>

            <AnimatePresence>
                {showForm && (
                    <CategoryForm
                        editingCat={editingCat}
                        onCancel={() => {
                            setShowForm(false)
                            setEditingCat(null)
                        }}
                        isDark={isDark}
                        activeTheme={activeTheme}
                        aura={aura}
                        s={s}
                        focusRingClass={focusRingClass}
                    />
                )}
            </AnimatePresence>

            <div className={`p-6 rounded-3xl border shadow-xl ${isDark ? 'bg-slate-900/60 border-slate-800' : 'bg-white border-slate-200'} space-y-6`}>
                <div>
                    <h3 className={`font-black text-xl mb-6 ${s.bodyText} flex items-center gap-2`}>
                        <FontAwesomeIcon icon={faTags} className="text-slate-400" />
                        Tus Categorías
                    </h3>
                    <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                        <AnimatePresence mode="popLayout">
                            {categories.map((cat, index) => {
                                const isSystem = SYSTEM_CATEGORIES.includes(cat.id)
                                const isEditing = editingCat?.id === cat.id
                                return (
                                    <motion.div
                                        key={cat.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8, transition: { duration: 0.15 } }}
                                        transition={{ type: 'spring', stiffness: 500, damping: 30, mass: 1, delay: Math.min(index * 0.02, 0.3) }}
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
                                    </motion.div>
                                )
                            })}
                        </AnimatePresence>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}

export default CategoryManager
