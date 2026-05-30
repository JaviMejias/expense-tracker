export const latestUpdate = {
    version: '1.2.0',
    title: '¡Aura se ha actualizado! 🚀',
    features: [
        {
            icon: '💳',
            title: 'Cuotas Inteligentes',
            description: 'Nuevo módulo dedicado para calcular el estado y remanente de tus pagos.'
        },
        {
            icon: '💾',
            title: 'Respaldo Total',
            description: 'Tus descargas ahora incluyen el historial completo de Cuotas.'
        },
        {
            icon: '📆',
            title: 'Fijación de Teclado',
            description: 'Corregido el molesto teclado emergente en el calendario al usar el celular.'
        },
        {
            icon: '🎨',
            title: 'Navegación Fluida',
            description: 'Nueva distribución y memoria de pestañas para continuar donde lo dejaste.'
        }
    ],
    footer: '¿Deseas recargar ahora para aplicar estos cambios?'
}

export function getChangelogHtml() {
    const listHtml = latestUpdate.features.map(f => 
        `<li>${f.icon} <b>${f.title}:</b> ${f.description}</li>`
    ).join('');

    return `
        <div style="text-align: left; font-size: 0.95em; padding-top: 10px;">
            <p>Hay una nueva versión disponible. Novedades de esta actualización:</p>
            <ul style="margin-left: 20px; margin-top: 10px; margin-bottom: 20px; line-height: 1.6;">
                ${listHtml}
            </ul>
            <p>${latestUpdate.footer}</p>
        </div>
    `;
}
