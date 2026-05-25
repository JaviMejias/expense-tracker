import { useMemo } from 'react'
import { format, parseISO } from 'date-fns'
import { es } from 'date-fns/locale'
import { formatCLP } from '../utils/currency'
import { faArrowUp, faArrowDown, faChartLine } from '@fortawesome/free-solid-svg-icons'
import { useCategoryStyles } from './useCategoryStyles'

export function useAnalytics(expenses, categories, selectedYear, s) {
    const availableYears = useMemo(() => {
        const years = new Set(expenses.map(e => parseISO(e.date).getFullYear()))
        years.add(new Date().getFullYear())
        return Array.from(years).sort((a, b) => b - a)
    }, [expenses])

    const monthlyData = useMemo(() => {
        const data = Array.from({ length: 12 }, (_, i) => {
            const date = new Date(selectedYear, i, 1)
            return {
                key: format(date, 'yyyy-MM'),
                name: format(date, 'MMM', { locale: es }),
                monthName: format(date, 'MMMM', { locale: es }),
                fullName: format(date, 'MMMM yyyy', { locale: es }),
                total: 0
            }
        })
        expenses.forEach(exp => {
            const date = parseISO(exp.date)
            if (date.getFullYear() === selectedYear) {
                data[date.getMonth()].total += exp.amount
            }
        })
        return data
    }, [expenses, selectedYear])

    const maxMonthlySpend = useMemo(() => {
        return Math.max(...monthlyData.map(m => m.total), 1)
    }, [monthlyData])

    const totalSpentInYear = useMemo(() => monthlyData.reduce((acc, curr) => acc + curr.total, 0), [monthlyData])
    const activeMonthsCount = useMemo(() => monthlyData.filter(m => m.total > 0).length || 1, [monthlyData])
    const averageSpending = totalSpentInYear / activeMonthsCount
    const peakMonth = useMemo(() => [...monthlyData].filter(m => m.total > 0).sort((a, b) => b.total - a.total)[0], [monthlyData])

    const topExpenses = useMemo(() => {
        return [...expenses]
            .filter(e => parseISO(e.date).getFullYear() === selectedYear)
            .sort((a, b) => b.amount - a.amount)
            .slice(0, 5)
    }, [expenses, selectedYear])

    const categoryStyles = useCategoryStyles(categories)

    const momTrendCard = useMemo(() => {
        const activeMonths = monthlyData.filter(m => m.total > 0)
        if (activeMonths.length >= 2) {
            const prevMonth = activeMonths[activeMonths.length - 2]
            const currMonth = activeMonths[activeMonths.length - 1]
            const diff = currMonth.total - prevMonth.total
            const percentChange = prevMonth.total > 0 ? (diff / prevMonth.total) * 100 : 0

            if (percentChange > 5) {
                return { type: 'warning', icon: faArrowUp, title: `Tus gastos aumentaron un ${percentChange.toFixed(0)}%`, text: `Registraste $${formatCLP(diff)} más en egresos este mes comparado con el anterior. Te sugerimos revisar tus plantillas fijas y posponer consumos secundarios.`, colorClass: s.advisorWarning }
            } else if (percentChange < -5) {
                return { type: 'success', icon: faArrowDown, title: `Tus gastos disminuyeron un ${Math.abs(percentChange).toFixed(0)}%`, text: `¡Excelente trabajo! Gastaste $${formatCLP(Math.abs(diff))} menos que el mes pasado. Tu disciplina de ahorro está rindiendo frutos.`, colorClass: s.advisorSuccess }
            } else {
                return { type: 'stable', icon: faChartLine, title: 'Tus gastos se mantienen estables', text: `Has mantenido un nivel de consumo muy constante (variación del ${percentChange.toFixed(0)}%). ¡Felicitaciones por esta consistencia!`, colorClass: s.advisorStable }
            }
        }
        return { type: 'info', icon: faChartLine, title: 'Analizando tendencias...', text: 'Una vez que acumules historial de gastos en al menos 2 meses distintos, verás el análisis de variaciones en tiempo real aquí.', colorClass: s.advisorInfo }
    }, [monthlyData, s])

    const yearlyCatTotals = useMemo(() => {
        return expenses
            .filter(e => parseISO(e.date).getFullYear() === selectedYear)
            .reduce((acc, curr) => {
                const cat = curr.category || 'otros'
                acc[cat] = (acc[cat] || 0) + curr.amount
                return acc
            }, {})
    }, [expenses, selectedYear])

    const dominantCatId = useMemo(() => {
        return Object.keys(yearlyCatTotals).length > 0
            ? Object.keys(yearlyCatTotals).sort((a, b) => yearlyCatTotals[b] - yearlyCatTotals[a])[0]
            : null
    }, [yearlyCatTotals])

    const paretoAdvice = useMemo(() => {
        if (dominantCatId) {
            const catLabel = categoryStyles[dominantCatId]?.label || 'Gastos Varios'
            const catEmoji = categoryStyles[dominantCatId]?.emoji || '🏷️'
            switch (dominantCatId) {
                case 'comida': return `Tu mayor egreso de este período se concentra en comida ${catEmoji}. Cocinar más en casa, planificar menús semanales o consolidar compras en supermercados mayoristas suele recortar hasta un 30% en este rubro.`
                case 'servicios': return `La categoría de Servicios ${catEmoji} lidera tus consumos. Te recomendamos revisar tus suscripciones recurrentes de streaming o aplicaciones inactivas para cortar de inmediato fugas silenciosas de dinero.`
                case 'transporte': return `El Transporte ${catEmoji} representa tu mayor flujo de salida. Si utilizas aplicaciones de viaje con frecuencia, consolidar tus traslados o evaluar días de caminata o transporte alternativo puede generar un gran alivio.`
                case 'entretencion': return `La diversión y salidas ${catEmoji} han sido tu foco principal de gasto. Intenta fijar un límite rígido a principios de mes en esta categoría para evitar excederte sin darte cuenta.`
                case 'salud': return `Lideran los gastos de Salud ${catEmoji}. Es una categoría esencial, pero te sugerimos preguntar siempre por alternativas genéricas bioequivalentes en tus compras de farmacia para optimizar costos.`
                default: return `Los gastos diversos (${catLabel}) representan tu mayor desembolso. Intenta desglosar en descripciones detalladas el uso de estos fondos para identificar micro-gastos superfluos.`
            }
        }
        return "No registras consumos en este mes activo aún. Registra gastos diarios o aplica tus plantillas fijas para obtener consejos financieros interactivos personalizados."
    }, [dominantCatId, categoryStyles])

    return { availableYears, monthlyData, maxMonthlySpend, totalSpentInYear, averageSpending, peakMonth, topExpenses, categoryStyles, momTrendCard, paretoAdvice }
}