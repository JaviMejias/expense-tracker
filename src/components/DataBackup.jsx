import { useRef } from 'react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import * as XLSX from 'xlsx'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faDownload, faUpload, faDatabase, faFileExcel } from '@fortawesome/free-solid-svg-icons'
import { useAppAlert } from '../hooks/useAppAlert'
import { useThemeStyles } from '../hooks/useThemeStyles'
import CustomButton from './CustomButton'
import SectionHeader from './SectionHeader'
import { useThemeStore } from '../store/useThemeStore'
import { appThemes } from '../utils/theme'
import { backupSchema } from '../utils/backupSchema'

function DataBackup() {
    const { themeMode, currentTheme } = useThemeStore()
    const activeTheme = appThemes[currentTheme] || appThemes.classic
    const fileInputRef = useRef(null)
    const { s, isDark, textGradientClass, aura } = useThemeStyles(themeMode, activeTheme)
    const { showAlert } = useAppAlert(themeMode)

    const handleExport = () => {
        try {
            const dataStore = JSON.parse(localStorage.getItem('expenseTracker-data'))?.state || {}
            const themeStore = JSON.parse(localStorage.getItem('expenseTracker-theme'))?.state || {}
            
            const combinedData = {
                salaries: dataStore.salaries,
                expenses: dataStore.expenses,
                fixedExpenses: dataStore.fixedExpenses,
                categoryLimits: dataStore.categoryLimits,
                categories: dataStore.categories,
                savingsGoals: dataStore.savingsGoals,
                installments: dataStore.installments,
                lastSeenMonth: dataStore.lastSeenMonth,
                currentTheme: themeStore.currentTheme,
                themeMode: themeStore.themeMode
            }

            const blob = new Blob([JSON.stringify(combinedData)], { type: 'application/json' })
            const url = URL.createObjectURL(blob)
            const link = document.createElement('a')
            link.href = url

            const dateStr = format(new Date(), 'dd-MM-yyyy_HH-mm')
            link.download = `Mis_Gastos_Aura_${dateStr}.json`
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
            URL.revokeObjectURL(url)
        } catch (error) {
            showAlert('Error', 'No se pudo exportar el respaldo.', 'error')
        }
    }

    const handleExportExcel = () => {
        try {
            const dataStore = JSON.parse(localStorage.getItem('expenseTracker-data'))?.state || {}
            const expenses = dataStore.expenses || []
            const categories = dataStore.categories || []
            const salaries = dataStore.salaries || {}

            if (expenses.length === 0) {
                showAlert('Sin datos', 'No hay gastos registrados para exportar.', 'info')
                return
            }

            const catMap = Object.fromEntries(categories.map(c => [c.id, `${c.emoji} ${c.name}`]))

            // Sheet 1: All expenses
            const expenseRows = expenses
                .sort((a, b) => new Date(b.date) - new Date(a.date))
                .map(exp => ({
                    'Fecha': format(parseISO(exp.date), "dd 'de' MMMM yyyy", { locale: es }),
                    'Descripción': exp.description,
                    'Monto ($)': exp.amount,
                    'Categoría': catMap[exp.category] || exp.category || 'Otros',
                    'Mes': format(parseISO(exp.date), 'MM-yyyy')
                }))

            // Sheet 2: Monthly summary
            const monthlyMap = {}
            expenses.forEach(exp => {
                const key = format(parseISO(exp.date), 'MM-yyyy')
                monthlyMap[key] = (monthlyMap[key] || 0) + exp.amount
            })
            const summaryRows = Object.entries(monthlyMap)
                .sort(([a], [b]) => b.localeCompare(a))
                .map(([month, total]) => ({
                    'Mes': month,
                    'Total Gastado ($)': total,
                    'Sueldo ($)': salaries[month] || 0,
                    'Diferencia ($)': (salaries[month] || 0) - total
                }))

            const wb = XLSX.utils.book_new()
            const ws1 = XLSX.utils.json_to_sheet(expenseRows)
            const ws2 = XLSX.utils.json_to_sheet(summaryRows)

            // Column widths
            ws1['!cols'] = [{ wch: 26 }, { wch: 35 }, { wch: 15 }, { wch: 20 }, { wch: 12 }]
            ws2['!cols'] = [{ wch: 12 }, { wch: 18 }, { wch: 14 }, { wch: 15 }]

            XLSX.utils.book_append_sheet(wb, ws1, 'Todos los Gastos')
            XLSX.utils.book_append_sheet(wb, ws2, 'Resumen Mensual')

            const dateStr = format(new Date(), 'dd-MM-yyyy')
            XLSX.writeFile(wb, `Mis_Gastos_Aura_${dateStr}.xlsx`)
        } catch (error) {
            showAlert('Error', 'No se pudo generar el archivo Excel.', 'error')
        }
    }

    const handleImport = (e) => {
        const file = e.target.files[0]
        if (!file) return

        const reader = new FileReader()
        reader.onload = (event) => {
            try {
                const importedData = JSON.parse(event.target.result)
                const validation = backupSchema.safeParse(importedData)

                if (validation.success) {
                    const validData = validation.data
                    
                    const dataState = {
                        salaries: validData.salaries,
                        expenses: validData.expenses,
                        fixedExpenses: validData.fixedExpenses,
                        categoryLimits: validData.categoryLimits,
                        categories: validData.categories,
                        savingsGoals: validData.savingsGoals,
                        installments: validData.installments,
                        lastSeenMonth: validData.lastSeenMonth
                    }
                    localStorage.setItem('expenseTracker-data', JSON.stringify({ state: dataState, version: 0 }))
                    
                    const themeState = {
                        currentTheme: validData.currentTheme || 'classic',
                        themeMode: validData.themeMode || 'dark'
                    }
                    localStorage.setItem('expenseTracker-theme', JSON.stringify({ state: themeState, version: 0 }))
                    
                    localStorage.setItem('backupImportedFlag', 'true')
                    window.location.reload()
                } else {
                    // Collect all error messages
                    const errorMessages = validation.error.issues.map(err => {
                        const path = err.path.join('.')
                        return `${path ? `[${path}] ` : ''}${err.message}`
                    }).join('\n')

                    showAlert(
                        'Archivo Inválido o Corrupto',
                        `El archivo no cumple con el formato requerido. Se encontraron los siguientes errores:\n\n${errorMessages}`,
                        'error'
                    )
                }
            } catch (e) {
                showAlert('Error al Leer', 'Ocurrió un error al intentar leer o procesar el archivo JSON de respaldo.', 'error')
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
                    Respaldo JSON
                </CustomButton>

                <CustomButton
                    onClick={handleExportExcel}
                    variant="custom"
                    icon={faFileExcel}
                    className={`flex-1 py-4 px-5 !rounded-2xl font-extrabold ${
                        isDark
                            ? 'bg-emerald-600/20 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500 hover:text-white'
                            : 'bg-emerald-50 border border-emerald-200 text-emerald-700 hover:bg-emerald-500 hover:text-white'
                    } transition-all duration-300 hover:-translate-y-0.5 shadow-md`}
                    isDark={isDark}
                >
                    Exportar Excel
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