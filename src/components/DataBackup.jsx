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
        <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] shadow-xl shadow-purple-200/50 border border-white p-6 sm:p-8 mt-8 hover:shadow-2xl hover:shadow-purple-200/60 transition-all duration-500">
            <h3 className="text-xl font-bold text-violet-900 mb-4 border-b-2 border-purple-100 pb-2">Respaldar Información</h3>
            <p className="text-purple-600 text-sm mb-5 font-medium">Guarda una copia de tus gastos o restaura un archivo anterior en caso de limpiar el navegador o cambiar de dispositivo.</p>

            <div className="flex flex-col sm:flex-row gap-4">
                <button
                    onClick={handleExport}
                    className="flex-1 bg-violet-100 text-violet-700 font-extrabold py-4 px-5 rounded-2xl hover:bg-violet-200 transition-colors transform hover:-translate-y-1"
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
                    className="flex-1 bg-fuchsia-100 text-fuchsia-700 font-extrabold py-4 px-5 rounded-2xl hover:bg-fuchsia-200 transition-colors transform hover:-translate-y-1"
                >
                    Cargar Respaldo
                </button>
            </div>
        </div>
    )
}

export default DataBackup