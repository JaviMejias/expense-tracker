import { useRef } from 'react'
import { format } from 'date-fns'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faUpload, faDatabase } from '@fortawesome/free-solid-svg-icons'
import { useAppAlert } from '../hooks/useAppAlert'
import { useThemeStyles } from '../hooks/useThemeStyles'
import CustomButton from './CustomButton'
import SectionHeader from './SectionHeader'

function DataBackup({ themeMode = 'dark', activeTheme }) {
    const fileInputRef = useRef(null)
    const { s, isDark, textGradientClass, aura } = useThemeStyles(themeMode, activeTheme)
    const { showAlert } = useAppAlert(themeMode)

    const handleExport = () => {
        const data = localStorage.getItem('expenseTrackerV6')
        if (!data) return

        const blob = new Blob([data], { type: 'application/json' })
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url

        const dateStr = format(new Date(), 'dd-MM-yyyy_HH-mm')
        link.download = `Mis_Gastos_Aura_${dateStr}.json`
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
                    showAlert('Error de Formato', 'El archivo seleccionado no tiene el formato correcto.', 'error')
                }
            } catch {
                showAlert('Error al Leer', 'Ocurrió un error al intentar leer el archivo de respaldo.', 'error')
            }
        }
        reader.readAsText(file)
        e.target.value = null
    }

    return (
        <div className={`${s.cardBg} rounded-[2rem] p-6 sm:p-8 mt-8 transition-all duration-500`}>
            <SectionHeader
                as="h3"
                title="Respaldar Información"
                icon={faDatabase}
                gradientClass={textGradientClass}
                iconClass={aura.icon}
            />
            <div className={`mb-6 p-4 rounded-xl text-sm font-medium ${isDark ? 'bg-amber-500/10 border border-amber-500/20 text-amber-200' : 'bg-amber-50 border border-amber-200 text-amber-800'}`}>
                <p className="mb-2"><strong>⚠️ ¡Importante!</strong> Tu información se guarda localmente en este navegador.</p>
                <p>Si borras los <strong>datos de navegación</strong> (historial, caché), usas programas de limpieza o quieres ver tu información en <strong>otro dispositivo</strong>, perderás tus registros. ¡Descarga un archivo de respaldo regularmente!</p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
                <CustomButton
                    onClick={handleExport}
                    variant="primary"
                    icon={faDownload}
                    className="flex-1 py-4 px-5 !rounded-2xl"
                    activeTheme={activeTheme}
                    isDark={isDark}
                >
                    Descargar Respaldo
                </CustomButton>

                <input
                    type="file"
                    accept=".json"
                    ref={fileInputRef}
                    onChange={handleImport}
                    className="hidden"
                />
                <CustomButton
                    onClick={() => fileInputRef.current?.click()}
                    variant="secondary"
                    icon={faUpload}
                    className="flex-1 py-4 px-5 !rounded-2xl"
                    isDark={isDark}
                >
                    Cargar Respaldo
                </CustomButton>
            </div>
        </div>
    )
}

export default DataBackup