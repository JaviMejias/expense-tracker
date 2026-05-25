import { useRef } from 'react'
import Swal from 'sweetalert2'
import { getThemeClass } from '../utils/theme'

function DataBackup({ themeMode = 'dark' }) {
    const fileInputRef = useRef(null)
    const s = getThemeClass(themeMode)
    const isDark = themeMode === 'dark'

    const handleExport = () => {
        const data = localStorage.getItem('expenseTrackerV6')
        if (!data) return

        const blob = new Blob([data], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = 'backup_gastos.json'
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        URL.revokeObjectURL(url)
    }

    const handleImport = (e) => {
        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target.result)
                if (importedData.salaries || importedData.expenses) {
                    localStorage.setItem('expenseTrackerV6', JSON.stringify(importedData))
                    localStorage.setItem('backupImportedFlag', 'true')
                    window.location.reload()
                } else {
                    Swal.fire({
                        title: 'Error de Formato',
                        text: 'El archivo seleccionado no tiene el formato correcto.',
                        icon: 'error',
                        background: s.swal.background,
                        color: s.swal.color,
                        confirmButtonColor: s.swal.confirmButtonColor
                    })
                }
            } catch {
                Swal.fire({
                    title: 'Error al Leer',
                    text: 'Ocurrió un error al intentar leer el archivo de respaldo.',
                    icon: 'error',
                    background: s.swal.background,
                    color: s.swal.color,
                    confirmButtonColor: s.swal.confirmButtonColor
                })
            }
        }
        reader.readAsText(file)
        e.target.value = null
    }

    return (
        <div className={`${s.cardBg} rounded-[2rem] p-6 sm:p-8 mt-8 transition-all duration-500`}>
            <h3 className={`text-xl font-bold ${isDark ? 'text-violet-300' : 'text-violet-600'} mb-4 border-b ${isDark ? 'border-slate-800' : 'border-slate-200'} pb-2 transition-colors duration-500`}>
                Respaldar Información
            </h3>
            <p className={`${s.bodyTextMuted} text-sm mb-5 font-medium transition-colors duration-500`}>
                Guarda una copia de tus gastos o restaura un archivo anterior en caso de limpiar el navegador.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={handleExport}
                    className={`flex-1 ${isDark ? 'bg-violet-900/30 text-violet-300 border-violet-800/50 hover:bg-violet-800' : 'bg-violet-50 text-violet-600 border-violet-200 hover:bg-violet-600 hover:text-white'} border font-extrabold py-4 px-5 rounded-2xl transition-all transform hover:-translate-y-0.5 cursor-pointer`}
                >
                    Descargar Respaldo
                </button>

                <input
                    type="file"
                    accept=".json"
                    ref={fileInputRef}
                    onChange={handleImport}
                    className="hidden"
                />
                <button
                    onClick={() => fileInputRef.current?.click()}
                    className={`flex-1 ${isDark ? 'bg-fuchsia-900/30 text-fuchsia-300 border-fuchsia-800/50 hover:bg-fuchsia-800' : 'bg-fuchsia-50 text-fuchsia-600 border-fuchsia-200 hover:bg-fuchsia-600 hover:text-white'} border font-extrabold py-4 px-5 rounded-2xl transition-all transform hover:-translate-y-0.5 cursor-pointer`}
                >
                    Cargar Respaldo
                </button>
            </div>
        </div>
    )
}

export default DataBackup