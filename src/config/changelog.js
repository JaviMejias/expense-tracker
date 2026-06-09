export const latestUpdate = {
    version: '1.3.0',
    title: '¡Aura se ha actualizado! 🚀',
    features: [
        {
            icon: '💸',
            title: 'Billetera Continua',
            description: 'El dinero ahora fluye mes a mes. Tu saldo histórico se suma automáticamente a tu sueldo actual como "Saldo Anterior".'
        },
        {
            icon: '🤝',
            title: 'Préstamos y Reembolsos',
            description: 'Marca gastos como "Reembolsables", haz seguimiento de las deudas y recibe pagos que se sumarán mágicamente de vuelta a tu presupuesto.'
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
