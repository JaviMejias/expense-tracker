import { useRef } from 'react'

function DataBackup() {
    const fileInputRef = useRef(null)

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
                    window.location.reload()
                } else {
                    alert('El archivo no tiene el formato correcto.')
                }
            } catch (error) {
                alert('Error al leer el archivo JSON.')
            }
        }
        reader.readAsText(file)
        e.target.value = null
    }

    return (
        <div className="bg-slate-900/80 backdrop-blur-xl rounded-[2rem] shadow-2xl border border-slate-800 p-6 sm:p-8 mt-8 hover:border-slate-700 transition-all duration-500">
            <h3 className="text-xl font-bold text-violet-300 mb-4 border-b border-slate-800 pb-2">Respaldar Información</h3>
            <p className="text-slate-400 text-sm mb-5 font-medium">Guarda una copia de tus gastos o restaura un archivo anterior en caso de limpiar el navegador.</p>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={handleExport}
                    className="flex-1 bg-violet-900/30 text-violet-300 border border-violet-800/50 font-extrabold py-4 px-5 rounded-2xl hover:bg-violet-800 hover:text-white transition-colors transform hover:-translate-y-1"
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
                    className="flex-1 bg-fuchsia-900/30 text-fuchsia-300 border border-fuchsia-800/50 font-extrabold py-4 px-5 rounded-2xl hover:bg-fuchsia-800 hover:text-white transition-colors transform hover:-translate-y-1"
                >
                    Cargar Respaldo
                </button>
            </div>
        </div>
    )
}

export default DataBackup