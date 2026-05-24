export const formatCLP = (value) => {
    if (!value) return ''
    const numericValue = value.toString().replace(/\D/g, '')
    if (!numericValue) return ''
    return new Intl.NumberFormat('es-CL').format(parseInt(numericValue, 10))
}

export const parseCLP = (value) => {
    if (!value) return 0
    return parseInt(value.toString().replace(/\D/g, ''), 10) || 0
}