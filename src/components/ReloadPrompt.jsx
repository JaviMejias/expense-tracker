import { useRegisterSW } from 'virtual:pwa-register/react'
import { useEffect } from 'react'
import { useAppAlert } from '../hooks/useAppAlert'
import { useThemeStore } from '../store/useThemeStore'

function ReloadPrompt() {
    const { themeMode } = useThemeStore()
    const { showToast, showConfirm } = useAppAlert(themeMode)

    const {
        offlineReady: [offlineReady, setOfflineReady],
        needRefresh: [needRefresh, setNeedRefresh],
        updateServiceWorker,
    } = useRegisterSW({
        onRegistered(r) {
            console.log('SW Registered: ' + r)
        },
        onRegisterError(error) {
            console.log('SW registration error', error)
        },
    })

    useEffect(() => {
        if (offlineReady) {
            showToast('App lista para funcionar sin conexión 📶', 'success')
            setOfflineReady(false)
        }
    }, [offlineReady, setOfflineReady, showToast])

    useEffect(() => {
        if (needRefresh) {
            const promptUpdate = async () => {
                const result = await showConfirm(
                    '¡Nueva actualización disponible! 🚀',
                    'Hay una nueva versión de la aplicación. ¿Deseas actualizar ahora para obtener las últimas mejoras?',
                    'Actualizar Ahora',
                    false
                )
                
                if (result.isConfirmed) {
                    updateServiceWorker(true)
                } else {
                    setNeedRefresh(false)
                }
            }
            promptUpdate()
        }
    }, [needRefresh, setNeedRefresh, updateServiceWorker, showConfirm])

    // This component doesn't render any permanent UI, it just handles the PWA lifecycle
    return null
}

export default ReloadPrompt
