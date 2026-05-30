/**
 * Verifica si un mes (formato MM-yyyy) cae dentro del período de pago de una cuota.
 */
export function isMonthInRange(monthKey, installment) {
    const [fMM, fYYYY] = installment.firstPaymentMonth.split('-').map(Number)
    const [mMM, mYYYY] = monthKey.split('-').map(Number)
    const firstIdx = fYYYY * 12 + fMM
    const monthIdx = mYYYY * 12 + mMM
    const diff = monthIdx - firstIdx
    return diff >= 0 && diff < installment.totalInstallments
}

/**
 * Retorna el número de cuota (base 1) para un mes dado.
 */
export function getInstallmentNum(monthKey, installment) {
    const [fMM, fYYYY] = installment.firstPaymentMonth.split('-').map(Number)
    const [mMM, mYYYY] = monthKey.split('-').map(Number)
    return (mYYYY * 12 + mMM) - (fYYYY * 12 + fMM) + 1
}

/**
 * Retorna las cuotas que están pendientes (en rango, no aplicadas, no saltadas) para un mes dado.
 */
export function getPendingInstallments(installments, monthKey) {
    return (installments || []).filter(inst => {
        if (!isMonthInRange(monthKey, inst)) return false
        if ((inst.appliedMonths || []).length >= inst.totalInstallments) return false
        if ((inst.appliedMonths || []).includes(monthKey)) return false
        if ((inst.skippedMonths || []).includes(monthKey)) return false
        return true
    })
}
