export const generateId = (prefix = 'id') => `${prefix}_${crypto.randomUUID()}`

export const getInitialData = (key, defaultVal) => {
    try {
        const savedData = localStorage.getItem('expenseTrackerV6')
        if (savedData) {
            const parsedData = JSON.parse(savedData)
            if (parsedData[key] !== undefined) return parsedData[key]
        }
    } catch (e) {
        console.error("Error reading legacy data", e)
    }
    return defaultVal
}
