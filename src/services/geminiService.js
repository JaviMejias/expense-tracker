import { GoogleGenerativeAI } from '@google/generative-ai'
import { formatCLP } from '../utils/currency'

export const getGeminiAdvice = async (apiKey, expenses, categories, selectedYear) => {
    if (!apiKey) {
        throw new Error('No se ha configurado la API Key de Gemini.')
    }

    try {
        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" })

        const totalGastado = expenses.reduce((sum, exp) => sum + exp.amount, 0)
        
        const categoryTotals = {}
        expenses.forEach(exp => {
            const catName = categories.find(c => c.id === exp.category)?.name || 'Otros'
            categoryTotals[catName] = (categoryTotals[catName] || 0) + exp.amount
        })

        const sortedCategories = Object.entries(categoryTotals)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 5)

        let topCategoriesText = sortedCategories.map(([cat, amount]) => `- ${cat}: $${formatCLP(amount)}`).join('\n')

        const prompt = `
Eres un asesor financiero experto y amigable. Un usuario chileno quiere analizar sus gastos del año ${selectedYear}.
Gastó un total de $${formatCLP(totalGastado)} CLP en este año.

Sus 5 principales categorías de gasto fueron:
${topCategoriesText}

Por favor, dale 3 consejos cortos, directos y accionables sobre cómo podría mejorar sus finanzas o en qué debería prestar atención basándote en estas categorías. Usa emojis para hacerlo amigable.
Responde estrictamente en formato Markdown limpio.
`
        const result = await model.generateContent(prompt)
        const response = await result.response
        return response.text()
    } catch (error) {
        console.error("Error consultando a Gemini:", error)
        throw new Error('Hubo un problema comunicándose con Gemini. Revisa tu API Key o intenta más tarde.')
    }
}
