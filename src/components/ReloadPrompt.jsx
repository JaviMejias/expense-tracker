import { useRegisterSW } from 'virtual:pwa-register/react'
import { useEffect, useState } from 'react'
import { useAppAlert } from '../hooks/useAppAlert'
import { useThemeStore } from '../store/useThemeStore'
import { useThemeStyles } from '../hooks/useThemeStyles'
import { appThemes } from '../utils/theme'
import { getChangelogHtml, latestUpdate } from '../config/changelog'
import Swal from 'sweetalert2'
import { getThemeClass } from '../utils/theme'

function ReloadPrompt() {
    const { themeMode, currentTheme } = useThemeStore()
    const activeTheme = appThemes[currentTheme] || appThemes.classic
    const { s } = useThemeStyles(themeMode, activeTheme)
    const { showToast } = useAppAlert(themeMode)
    
    // Solo mostramos el botón de novedades si la versión guardada es distinta a la actual
    const [showUpdateFeatures, setShowUpdateFeatures] = useState(
        localStorage.getItem('seenUpdateVersion') !== latestUpdate.version
    )

    const {
        offlineReady: [offlineReady, setOfflineReady]
    } = useRegisterSW({
        onRegistered(r) {
            console.log('SW Registered', r)
            if (r) {
                // Revisar actualizaciones cada 60 minutos silenciosamente
                setInterval(() => {
                    r.update()
                }, 60 * 60 * 1000)

                // Revisar actualizaciones inmediatamente al volver a la pestaña
                document.addEventListener('visibilitychange', () => {
                    if (document.visibilityState === 'visible') {
                        r.update()
                    }
                })
            }
        },
        onRegisterError(error) {
            console.error('SW registration error', error)
        },
    })

    useEffect(() => {
        if (offlineReady) {
            showToast('App lista para funcionar sin conexión 📶', 'success')
            setOfflineReady(false)
        }
        
        // Si hay novedades sin ver (es decir, la app se acaba de actualizar), mandamos un toast de bienvenida
        if (showUpdateFeatures) {
            const hasSeenWelcome = localStorage.getItem('seenUpdateWelcome') === latestUpdate.version
            if (!hasSeenWelcome) {
                showToast('¡App actualizada exitosamente! ✨', 'success', 4000)
                localStorage.setItem('seenUpdateWelcome', latestUpdate.version)
            }
        }
    }, [offlineReady, setOfflineReady, showToast, showUpdateFeatures])

    const openChangelogModal = async () => {
        const swalTheme = getThemeClass(themeMode)
        
        await Swal.fire({
            title: latestUpdate.title,
            html: getChangelogHtml(),
            icon: 'success',
            showConfirmButton: true,
            confirmButtonText: '¡Genial, gracias!',
            background: swalTheme.swal.background,
            color: swalTheme.swal.color,
            confirmButtonColor: swalTheme.swal.confirmButtonColor
        })
        
        // Una vez cerrado, guardamos la versión para que no vuelva a salir el botón
        localStorage.setItem('seenUpdateVersion', latestUpdate.version)
        setShowUpdateFeatures(false)
    }

    if (showUpdateFeatures) {
        return (
            <button
                onClick={openChangelogModal}
                className={`fixed bottom-24 right-4 sm:right-8 z-[99999] ${s.button} px-3 py-2 sm:px-4 sm:py-2.5 rounded-full flex items-center gap-1.5 sm:gap-2 shadow-[0_0_15px_rgba(var(--aura-rgb),0.3)] hover:shadow-[0_0_25px_rgba(var(--aura-rgb),0.5)] transition-all animate-pulse`}
            >
                <span className="text-base sm:text-lg">✨</span>
                <span className="text-xs sm:text-sm font-bold">Novedades</span>
            </button>
        )
    }

    return null
}

export default ReloadPrompt
