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

    const showConfirm = (title, text, confirmText = 'Sí, eliminar', isDanger = true) => {
        return Swal.fire({
            title,
            text,
            icon: isDanger ? 'warning' : 'question',
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

    return { showToast, showConfirm, showAlert, showPrompt, showThreeWay }
}