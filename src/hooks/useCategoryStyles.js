import { useMemo } from 'react'
import { colorThemes } from '../utils/theme'

export function useCategoryStyles(categories = []) {
    return useMemo(() => {
        return categories.reduce((acc, cat) => {
            acc[cat.id] = {
                label: cat.name,
                emoji: cat.emoji,
                bgClass: cat.colorClass || colorThemes[cat.color]?.bgClass || colorThemes.slate.bgClass
            }
            return acc
        }, {})
    }, [categories])
}