import Swal from 'sweetalert2'
import { getThemeClass } from '../utils/theme'
import { formatCLP } from '../utils/currency'

export function useAppAlert(themeMode = 'dark') {
    const s = getThemeClass(themeMode)
    const isDark = themeMode === 'dark'

    const showToast = (title, icon = 'success', timer = 3000) => {
        return Swal.fire({
            toast: true,
            position: 'top-end',
            icon,
            title,
            showConfirmButton: false,
            timer,
            timerProgressBar: true,
            background: s.swal.background,
            color: s.swal.color,
            iconColor: icon === 'success' ? '#10b981' : undefined
        })
    }

    const showUpdateToast = (title) => {
        return Swal.fire({
            toast: true,
            position: 'top-end',
            icon: undefined,
            title,
            showConfirmButton: true,
            confirmButtonText: 'Ver detalles',
            showCancelButton: true,
            cancelButtonText: 'Más tarde',
            timer: 8000, 
            timerProgressBar: true,
            background: s.swal.background,
            color: s.swal.color,
            confirmButtonColor: '#3b82f6',
            cancelButtonColor: isDark ? '#475569' : '#e2e8f0',
            customClass: {
                popup: 'shadow-lg border border-[rgba(var(--aura-rgb),0.2)]'
            }
        })
    }

    const showConfirm = (title, text, confirmText = 'Sí, eliminar', isDanger = true, useHtml = false, customIcon = null) => {
        return Swal.fire({
            title,
            [useHtml ? 'html' : 'text']: text,
            icon: customIcon || (isDanger ? 'warning' : 'info'),
            showCancelButton: true,
            confirmButtonColor: isDanger ? '#f43f5e' : s.swal.confirmButtonColor,
            cancelButtonColor: isDanger ? s.swal.confirmButtonColor : (isDark ? '#475569' : '#e2e8f0'),
            confirmButtonText: confirmText,
            cancelButtonText: 'Cancelar',
            background: s.swal.background,
            color: s.swal.color
        })
    }

    const showAlert = (title, text, icon = 'warning') => {
        return Swal.fire({
            title,
            text,
            icon,
            background: s.swal.background,
            color: s.swal.color,
            confirmButtonColor: s.swal.confirmButtonColor
        })
    }

    const showPrompt = (options) => {
        const { isAmountPrompt, didOpen, ...restOptions } = options
        return Swal.fire({
            background: s.swal.background,
            color: s.swal.color,
            confirmButtonColor: s.swal.confirmButtonColor,
            cancelButtonColor: isDark ? '#475569' : '#e2e8f0',
            didOpen: (popup) => {
                if (isAmountPrompt) {
                    const input = Swal.getInput()
                    if (input) {
                        input.addEventListener('input', (e) => {
                            const val = e.target.value.replace(/\D/g, '')
                            e.target.value = val ? formatCLP(val) : ''
                        })
                    }
                }
                if (didOpen) didOpen(popup)
            },
            ...restOptions
        })
    }

    const showThreeWay = (title, text, confirmText, denyText, cancelText) => {
        return Swal.fire({
            title,
            text,
            icon: 'question',
            showConfirmButton: true,
            showDenyButton: true,
            showCancelButton: true,
            confirmButtonColor: s.swal.confirmButtonColor,
            denyButtonColor: isDark ? '#d97706' : '#f59e0b',
            cancelButtonColor: isDark ? '#475569' : '#94a3b8',
            confirmButtonText: confirmText,
            denyButtonText: denyText,
            cancelButtonText: cancelText,
            background: s.swal.background,
            color: s.swal.color,
        })
    }

    return { showToast, showUpdateToast, showConfirm, showAlert, showPrompt, showThreeWay }
}