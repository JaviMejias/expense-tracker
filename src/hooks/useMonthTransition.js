import { format, parse, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { formatCLP } from '../utils/currency'
import { useDataStore } from '../store/useDataStore'
import { useThemeStore } from '../store/useThemeStore'
import { useAppAlert } from './useAppAlert'
import { getPendingInstallments, getInstallmentNum } from '../utils/installments'

/**
 * Cache de transiciones ya gestionadas durante esta sesión.
 * Evita que el mismo prompt se dispare múltiples veces al navegar
 * hacia adelante y atrás entre meses repetidamente.
 * Se resetea automáticamente al cerrar/recargar la app.
 */
const decidedTransitions = new Set()

/**
 * Hook reutilizable que maneja las transiciones de mes:
 * 1. Prompt de remanente (saldo sobrante del mes anterior)
 * 2. Prompts de cuotas pendientes para el nuevo mes
 *
 * Puede ser usado tanto desde MonthSummary (cambio manual) como desde
 * App.jsx (detección automática al abrir la app en un mes nuevo).
 */
export function useMonthTransition() {
    const { themeMode } = useThemeStore()
    const { showConfirm, showToast, showThreeWay } = useAppAlert(themeMode)

    const handleMonthTransition = async (fromMonthKey, toMonthKey) => {
        const transitionKey = `${fromMonthKey}-${toMonthKey}`
        if (decidedTransitions.has(transitionKey)) return
        decidedTransitions.add(transitionKey)

        // Leer estado fresco en el momento de la llamada para evitar closures obsoletos
        const {
            salaries, expenses, installments,
            handleSalaryChange, applyInstallmentToMonth, skipInstallmentMonth
        } = useDataStore.getState()

        // --- 1. Remanente del mes anterior ---
        // Remanente automático ahora es manejado por useDerivedData (Billetera Continua).
        // Ya no se requiere prompt manual de arrastre.

        // --- 2. Cuotas pendientes para el nuevo mes ---
        const pending = getPendingInstallments(installments || [], toMonthKey)
        const toDate = parse(toMonthKey, 'MM-yyyy', new Date())

        for (const inst of pending) {
            const num = getInstallmentNum(toMonthKey, inst)

            const result = await showThreeWay(
                `💳 Cuota pendiente`,
                `Cuota ${num}/${inst.totalInstallments} de "${inst.description}" — $${formatCLP(inst.monthlyAmount)} en ${format(toDate, 'MMMM yyyy', { locale: es })}`,
                '✅ Registrar como gasto',
                '⏭️ Saltar este mes',
                '🔕 Recordar después'
            )

            if (result.isConfirmed) {
                // Leer estado actualizado (pudo haber cambiado por el loop)
                const fresh = useDataStore.getState()
                fresh.applyInstallmentToMonth(inst.id, toMonthKey)
                showToast(`Cuota ${num}/${inst.totalInstallments} de "${inst.description}" registrada ✅`, 'success', 3000)
            } else if (result.isDenied) {
                const fresh = useDataStore.getState()
                fresh.skipInstallmentMonth(inst.id, toMonthKey)
                showToast(`Cuota de "${inst.description}" saltada para ${format(toDate, 'MMMM', { locale: es })}`, 'info', 2500)
            }
            // isDismissed = "Recordar después" → sin acción, queda como pendiente
        }
    }

    return { handleMonthTransition }
}
