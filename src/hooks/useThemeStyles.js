import { getThemeClass } from '../utils/theme'

export function useThemeStyles(themeMode = 'dark', activeTheme) {
    const s = getThemeClass(themeMode)
    const isDark = themeMode === 'dark'

    const activeColor = activeTheme?.accentBgColor?.includes('rose') ? 'rose'
        : activeTheme?.accentBgColor?.includes('emerald') ? 'emerald'
            : 'indigo'

    const textGradientClass = activeTheme
        ? (isDark ? activeTheme.textGradient : activeTheme.textGradientLight)
        : (isDark ? 'from-indigo-400 to-purple-400' : 'from-indigo-600 to-purple-600')

    const focusRingClass = {
        rose: 'focus:outline-none focus:ring-2 focus:ring-rose-500/50 focus:border-rose-500',
        emerald: 'focus:outline-none focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500',
        indigo: 'focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500'
    }[activeColor]

    const auraStylesConfig = {
        rose: {
            icon: 'text-rose-500',
            label: isDark ? 'text-rose-300 group-hover:text-rose-400' : 'text-rose-600 group-hover:text-rose-700',
            bgGlow: 'bg-rose-500/10 blur-[50px]',
            boxBg: 'bg-rose-500/10 border-rose-500/30 text-rose-400',
            gradient: isDark ? 'from-rose-950/40 to-slate-900/60 border-rose-500/20 hover:border-rose-500/35' : 'from-rose-50/50 via-white to-slate-100/60 border-rose-200 hover:border-rose-300',
            chartBar: 'from-rose-600 via-rose-500 to-pink-500 hover:from-rose-400 hover:to-pink-400 shadow-[0_0_15px_rgba(244,63,94,0.2)] hover:shadow-[0_0_20px_rgba(244,63,94,0.4)]',
            gradientText: 'from-rose-400 to-pink-400',
            cardHover: 'hover:border-rose-500/20',
            badge: isDark ? 'bg-rose-500/10 border-rose-500/20 text-rose-300' : 'bg-rose-50 border-rose-200 text-rose-600',
            radio: isDark ? 'text-rose-500 focus:ring-rose-500 bg-slate-800 border-slate-600' : 'text-rose-600 focus:ring-rose-500 bg-white border-slate-300',
            radioHover: 'hover:border-rose-500',
            dayActive: 'bg-rose-500 text-white shadow-md shadow-rose-500/30 border border-rose-400',
            dayHover: isDark ? 'hover:border-rose-500 hover:text-rose-200' : 'hover:border-rose-500 hover:text-slate-800',
            hoverItem: 'hover:border-rose-500/50 hover:shadow-md hover:shadow-rose-500/10',
            dayBadge: isDark ? 'bg-rose-500/10 text-rose-300 border-rose-500/20' : 'bg-rose-50 text-rose-700 border border-rose-100',
            monthBox: isDark ? 'from-rose-950/40 via-slate-900/80 to-slate-950/60 border-rose-500/20 shadow-rose-950/50 hover:border-rose-500/30' : 'from-rose-50/50 via-white/85 to-slate-100/60 border-rose-200 shadow-rose-100/30 hover:border-rose-300',
            applyBtn: 'bg-gradient-to-r from-rose-600 to-pink-600 text-white shadow-lg shadow-rose-500/30 border border-rose-400/50 hover:shadow-rose-500/50 hover:border-rose-300',
            hoverBorder: 'hover:border-rose-500/20 hover:text-rose-400',
            btn: 'bg-rose-600 hover:bg-rose-500 text-white',
            container: isDark ? 'bg-slate-950/40 border-rose-500/30 shadow-lg shadow-rose-950/20' : 'bg-white/70 border-rose-200 shadow-lg shadow-rose-100/50',
            button: isDark ? 'bg-slate-900/60 hover:bg-slate-800 border-slate-700/30 text-slate-300 hover:text-white' : 'bg-white hover:bg-rose-50 border-rose-100 text-slate-600 hover:text-rose-600',
            text: isDark ? 'text-slate-500' : 'text-slate-500',
            divider: isDark ? 'bg-slate-800/80' : 'bg-rose-200/60',
            listSelected: isDark ? 'border-rose-500 bg-rose-950/20 shadow-md shadow-rose-950/30 text-rose-200' : 'border-rose-500 bg-rose-50/50 shadow-md shadow-rose-100/50 text-rose-950',
            listUnselected: isDark ? 'bg-slate-800/80 border-slate-700 hover:border-rose-500/50 hover:shadow-rose-900/20' : 'bg-white border-slate-200/80 hover:border-rose-500/50 hover:shadow-slate-200/50 text-slate-800',
            listHoverText: isDark ? 'group-hover:text-rose-300' : 'group-hover:text-rose-600',
            listCheckbox: isDark ? 'border-slate-600 bg-slate-900 text-rose-500 focus:ring-rose-500 focus:ring-offset-slate-800' : 'border-slate-300 bg-white text-rose-600 focus:ring-rose-500 focus:ring-offset-white',
            listActionBtn: 'bg-rose-500/15 border-rose-500/30 text-rose-400 hover:bg-rose-600 hover:text-white',
            listClearBtn: isDark ? 'text-rose-400 hover:text-rose-300' : 'text-rose-600 hover:text-rose-500'
        },
        emerald: {
            icon: 'text-emerald-500',
            label: isDark ? 'text-emerald-300 group-hover:text-emerald-400' : 'text-emerald-600 group-hover:text-emerald-700',
            bgGlow: 'bg-emerald-500/10 blur-[50px]',
            boxBg: 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400',
            gradient: isDark ? 'from-emerald-950/40 to-slate-900/60 border-emerald-500/20 hover:border-emerald-500/35' : 'from-emerald-50/50 via-white to-slate-100/60 border-emerald-200 hover:border-emerald-300',
            chartBar: 'from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 shadow-[0_0_15px_rgba(16,185,129,0.2)] hover:shadow-[0_0_20px_rgba(16,185,129,0.4)]',
            gradientText: 'from-emerald-400 to-teal-400',
            cardHover: 'hover:border-emerald-500/20',
            badge: isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-300' : 'bg-emerald-50 border-emerald-200 text-emerald-600',
            radio: isDark ? 'text-emerald-500 focus:ring-emerald-500 bg-slate-800 border-slate-600' : 'text-emerald-600 focus:ring-emerald-500 bg-white border-slate-300',
            radioHover: 'hover:border-emerald-500',
            dayActive: 'bg-emerald-500 text-white shadow-md shadow-emerald-500/30 border border-emerald-400',
            dayHover: isDark ? 'hover:border-emerald-500 hover:text-emerald-200' : 'hover:border-emerald-500 hover:text-slate-800',
            hoverItem: 'hover:border-emerald-500/50 hover:shadow-md hover:shadow-emerald-500/10',
            dayBadge: isDark ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/20' : 'bg-emerald-50 text-emerald-700 border border-emerald-100',
            monthBox: isDark ? 'from-emerald-950/40 via-slate-900/80 to-slate-950/60 border-emerald-500/20 shadow-emerald-950/50 hover:border-emerald-500/30' : 'from-emerald-50/50 via-white/85 to-slate-100/60 border-emerald-200 shadow-emerald-100/30 hover:border-emerald-300',
            applyBtn: 'bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg shadow-emerald-500/30 border border-emerald-400/50 hover:shadow-emerald-500/50 hover:border-emerald-300',
            hoverBorder: 'hover:border-emerald-500/20 hover:text-emerald-400',
            btn: 'bg-emerald-600 hover:bg-emerald-500 text-white',
            container: isDark ? 'bg-slate-950/40 border-emerald-500/30 shadow-lg shadow-emerald-950/20' : 'bg-white/70 border-emerald-200 shadow-lg shadow-emerald-100/50',
            button: isDark ? 'bg-slate-900/60 hover:bg-slate-800 border-slate-700/30 text-slate-300 hover:text-white' : 'bg-white hover:bg-emerald-50 border-emerald-100 text-slate-600 hover:text-emerald-600',
            text: isDark ? 'text-slate-500' : 'text-slate-500',
            divider: isDark ? 'bg-slate-800/80' : 'bg-emerald-200/60',
            listSelected: isDark ? 'border-emerald-500 bg-emerald-950/20 shadow-md shadow-emerald-950/30 text-emerald-200' : 'border-emerald-500 bg-emerald-50/50 shadow-md shadow-emerald-100/50 text-emerald-950',
            listUnselected: isDark ? 'bg-slate-800/80 border-slate-700 hover:border-emerald-500/50 hover:shadow-emerald-900/20' : 'bg-white border-slate-200/80 hover:border-emerald-500/50 hover:shadow-slate-200/50 text-slate-800',
            listHoverText: isDark ? 'group-hover:text-emerald-300' : 'group-hover:text-emerald-600',
            listCheckbox: isDark ? 'border-slate-600 bg-slate-900 text-emerald-500 focus:ring-emerald-500 focus:ring-offset-slate-800' : 'border-slate-300 bg-white text-emerald-600 focus:ring-emerald-500 focus:ring-offset-white',
            listActionBtn: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400 hover:bg-emerald-600 hover:text-white',
            listClearBtn: isDark ? 'text-emerald-400 hover:text-emerald-300' : 'text-emerald-600 hover:text-emerald-500'
        },
        indigo: {
            icon: 'text-indigo-500',
            label: isDark ? 'text-indigo-300 group-hover:text-indigo-400' : 'text-indigo-600 group-hover:text-indigo-700',
            bgGlow: 'bg-indigo-500/10 blur-[50px]',
            boxBg: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-400',
            gradient: isDark ? 'from-indigo-950/40 to-slate-900/60 border-indigo-500/20 hover:border-indigo-500/35' : 'from-indigo-50/50 via-white to-slate-100/60 border-indigo-200 hover:border-indigo-300',
            chartBar: 'from-indigo-600 via-indigo-500 to-purple-500 hover:from-indigo-400 hover:to-pink-500 shadow-[0_0_15px_rgba(99,102,241,0.2)] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]',
            gradientText: 'from-indigo-400 to-purple-400',
            cardHover: 'hover:border-indigo-500/20',
            badge: isDark ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-600',
            radio: isDark ? 'text-indigo-500 focus:ring-indigo-500 bg-slate-800 border-slate-600' : 'text-indigo-600 focus:ring-indigo-500 bg-white border-slate-300',
            radioHover: 'hover:border-indigo-500',
            dayActive: 'bg-indigo-500 text-white shadow-md shadow-indigo-500/30 border border-indigo-400',
            dayHover: isDark ? 'hover:border-indigo-500 hover:text-indigo-200' : 'hover:border-indigo-500 hover:text-slate-800',
            hoverItem: 'hover:border-indigo-500/50 hover:shadow-md hover:shadow-indigo-500/10',
            dayBadge: isDark ? 'bg-indigo-500/10 text-indigo-300 border-indigo-500/20' : 'bg-indigo-50 text-indigo-700 border border-indigo-100',
            monthBox: isDark ? 'from-indigo-950/40 via-slate-900/80 to-slate-950/60 border-indigo-500/20 shadow-indigo-950/50 hover:border-indigo-500/30' : 'from-indigo-50/50 via-white/85 to-slate-100/60 border-indigo-200 shadow-indigo-100/30 hover:border-indigo-300',
            applyBtn: 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg shadow-indigo-500/30 border border-indigo-400/50 hover:shadow-indigo-500/50 hover:border-indigo-300',
            hoverBorder: 'hover:border-indigo-500/20 hover:text-indigo-400',
            btn: 'bg-indigo-600 hover:bg-indigo-500 text-white',
            container: isDark ? 'bg-slate-950/40 border-indigo-500/30 shadow-lg shadow-indigo-950/20' : 'bg-white/70 border-indigo-200 shadow-lg shadow-indigo-100/50',
            button: isDark ? 'bg-slate-900/60 hover:bg-slate-800 border-slate-700/30 text-slate-300 hover:text-white' : 'bg-white hover:bg-indigo-50 border-indigo-100 text-slate-600 hover:text-indigo-600',
            text: isDark ? 'text-slate-500' : 'text-slate-500',
            divider: isDark ? 'bg-slate-800/80' : 'bg-indigo-200/60',
            listSelected: isDark ? 'border-indigo-500 bg-indigo-950/20 shadow-md shadow-indigo-950/30 text-indigo-200' : 'border-indigo-500 bg-indigo-50/50 shadow-md shadow-indigo-100/50 text-indigo-950',
            listUnselected: isDark ? 'bg-slate-800/80 border-slate-700 hover:border-indigo-500/50 hover:shadow-indigo-900/20' : 'bg-white border-slate-200/80 hover:border-indigo-500/50 hover:shadow-slate-200/50 text-slate-800',
            listHoverText: isDark ? 'group-hover:text-indigo-300' : 'group-hover:text-indigo-600',
            listCheckbox: isDark ? 'border-slate-600 bg-slate-900 text-indigo-500 focus:ring-indigo-500 focus:ring-offset-slate-800' : 'border-slate-300 bg-white text-indigo-600 focus:ring-indigo-500 focus:ring-offset-white',
            listActionBtn: 'bg-indigo-500/15 border-indigo-500/30 text-indigo-400 hover:bg-indigo-600 hover:text-white',
            listClearBtn: isDark ? 'text-indigo-400 hover:text-indigo-300' : 'text-indigo-600 hover:text-indigo-500'
        }
    }

    const aura = auraStylesConfig[activeColor]

    return { s, isDark, activeColor, textGradientClass, focusRingClass, aura }
}