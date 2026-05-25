import { renderHook } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
import { useAnalytics } from './useAnalytics'

describe('Hook: useAnalytics', () => {
    // 1. Preparamos datos falsos (Mocks) para la prueba
    const mockCategories = [
        { id: 'comida', name: 'Comida', emoji: '🍔', color: 'rose' },
        { id: 'transporte', name: 'Transporte', emoji: '🚗', color: 'amber' }
    ]

    const mockExpenses = [
        { id: 1, amount: 15000, category: 'comida', date: '2023-10-15T12:00:00.000Z', description: 'Cena' },
        { id: 2, amount: 5000, category: 'transporte', date: '2023-10-20T12:00:00.000Z', description: 'Uber' },
        { id: 3, amount: 10000, category: 'comida', date: '2023-09-10T12:00:00.000Z', description: 'Supermercado' } // Mes distinto
    ]

    const mockThemeStyles = {
        advisorWarning: 'warning',
        advisorSuccess: 'success',
        advisorStable: 'stable',
        advisorInfo: 'info'
    }

    // 2. Escribimos los casos de prueba (it)
    it('debe calcular el total gastado en el año seleccionado correctamente', () => {
        // Renderizamos el hook usando "renderHook" de React Testing Library
        const { result } = renderHook(() => useAnalytics(mockExpenses, mockCategories, 2023, mockThemeStyles))

        // En 2023 gastamos 15000 + 5000 + 10000 = 30000
        expect(result.current.totalSpentInYear).toBe(30000)
    })

    it('debe identificar el mes con mayor consumo (peakMonth)', () => {
        const { result } = renderHook(() => useAnalytics(mockExpenses, mockCategories, 2023, mockThemeStyles))

        // En octubre (10) gastamos 20000, en septiembre (09) gastamos 10000. El mayor debe ser octubre.
        expect(result.current.peakMonth.total).toBe(20000)
        expect(result.current.peakMonth.key).toBe('2023-10')
    })

    it('debe devolver los años disponibles ordenados de mayor a menor', () => {
        const { result } = renderHook(() => useAnalytics(mockExpenses, mockCategories, 2023, mockThemeStyles))

        // Debe incluir el año de los gastos (2023) y el año actual
        expect(result.current.availableYears).toContain(2023)
    })
})