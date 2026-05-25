export const colorThemes = {
    rose: {
        label: 'Rosa',
        color: 'rose',
        bg: 'border-rose-500/20 text-rose-400 bg-rose-500/5 hover:bg-rose-500/10',
        active: 'bg-rose-500 text-white border-rose-500 shadow-lg shadow-rose-500/30',
        bgClass: 'bg-rose-500/10 border-rose-500/20 text-rose-400'
    },
    blue: {
        label: 'Azul',
        color: 'blue',
        bg: 'border-blue-500/20 text-blue-400 bg-blue-500/5 hover:bg-blue-500/10',
        active: 'bg-blue-500 text-white border-blue-500 shadow-lg shadow-blue-500/30',
        bgClass: 'bg-blue-500/10 border-blue-500/20 text-blue-400'
    },
    amber: {
        label: 'Ámbar',
        color: 'amber',
        bg: 'border-amber-500/20 text-amber-400 bg-amber-500/5 hover:bg-amber-500/10',
        active: 'bg-amber-500 text-slate-950 border-amber-500 shadow-lg shadow-amber-500/30 font-extrabold',
        bgClass: 'bg-amber-500/10 border-amber-500/20 text-amber-400'
    },
    emerald: {
        label: 'Esmeralda',
        color: 'emerald',
        bg: 'border-emerald-500/20 text-emerald-400 bg-emerald-500/5 hover:bg-emerald-500/10',
        active: 'bg-emerald-500 text-white border-emerald-500 shadow-lg shadow-emerald-500/30',
        bgClass: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
    },
    pink: {
        label: 'Fucsia',
        color: 'pink',
        bg: 'border-pink-500/20 text-pink-400 bg-pink-500/5 hover:bg-pink-500/10',
        active: 'bg-pink-500 text-white border-pink-500 shadow-lg shadow-pink-500/30',
        bgClass: 'bg-pink-500/10 border-pink-500/20 text-pink-400'
    },
    violet: {
        label: 'Violeta',
        color: 'violet',
        bg: 'border-violet-500/20 text-violet-400 bg-violet-500/5 hover:bg-violet-500/10',
        active: 'bg-violet-500 text-white border-violet-500 shadow-lg shadow-violet-500/30',
        bgClass: 'bg-violet-500/10 border-violet-500/20 text-violet-400'
    },
    sky: {
        label: 'Cian',
        color: 'sky',
        bg: 'border-sky-500/20 text-sky-400 bg-sky-500/5 hover:bg-sky-500/10',
        active: 'bg-sky-500 text-white border-sky-500 shadow-lg shadow-sky-500/30',
        bgClass: 'bg-sky-500/10 border-sky-500/20 text-sky-400'
    },
    slate: {
        label: 'Gris',
        color: 'slate',
        bg: 'border-slate-600/20 text-slate-400 bg-slate-800/10 hover:bg-slate-700/20',
        active: 'bg-slate-600 text-white border-slate-500 shadow-lg shadow-slate-500/30',
        bgClass: 'bg-slate-500/10 border-slate-500/20 text-slate-400'
    }
}

export const appThemes = {
    classic: {
        id: 'classic',
        label: 'Classic Indigo',
        icon: '🌌',
        bgGradient: 'from-slate-800 via-indigo-950/30 to-slate-950',
        bgGradientLight: 'from-indigo-50/20 via-slate-100/40 to-slate-200/50',
        textGradient: 'from-indigo-400 via-purple-400 to-pink-400',
        textGradientLight: 'from-indigo-600 via-purple-600 to-pink-600',
        primaryGlow: 'bg-indigo-500/20',
        activeTab: 'bg-indigo-500 border-indigo-400 shadow-indigo-500/30 shadow-lg text-white scale-100',
        inactiveTab: 'text-slate-400 hover:text-slate-200 hover:bg-slate-800 scale-95 border-transparent',
        inactiveTabLight: 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 scale-95 border-transparent',
        accentBorder: 'border-indigo-500/30',
        accentGlowText: 'text-indigo-400',
        accentBgColor: 'bg-indigo-600',
        accentHoverBgColor: 'hover:bg-indigo-500 shadow-indigo-900/50'
    },
    cyberpunk: {
        id: 'cyberpunk',
        label: 'Cyberpunk Red',
        icon: '🤖',
        bgGradient: 'from-slate-950 via-rose-950/20 to-slate-950',
        bgGradientLight: 'from-rose-50/10 via-slate-100/40 to-slate-200/50',
        textGradient: 'from-rose-400 via-pink-400 to-sky-400',
        textGradientLight: 'from-rose-600 via-pink-600 to-sky-600',
        primaryGlow: 'bg-rose-500/20',
        activeTab: 'bg-rose-500 border-rose-400 shadow-rose-500/30 shadow-lg text-white scale-100',
        inactiveTab: 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 scale-95 border-transparent',
        inactiveTabLight: 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 scale-95 border-transparent',
        accentBorder: 'border-rose-500/30',
        accentGlowText: 'text-rose-400',
        accentBgColor: 'bg-rose-600',
        accentHoverBgColor: 'hover:bg-rose-500 shadow-rose-900/50'
    },
    mint: {
        id: 'mint',
        label: 'Emerald Mint',
        icon: '🍃',
        bgGradient: 'from-slate-950 via-emerald-950/20 to-slate-950',
        bgGradientLight: 'from-emerald-50/10 via-slate-100/40 to-slate-200/50',
        textGradient: 'from-emerald-400 via-teal-400 to-sky-400',
        textGradientLight: 'from-emerald-600 via-teal-600 to-sky-600',
        primaryGlow: 'bg-emerald-500/20',
        activeTab: 'bg-emerald-500 border-emerald-400 shadow-emerald-500/30 shadow-lg text-white scale-100',
        inactiveTab: 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/80 scale-95 border-transparent',
        inactiveTabLight: 'text-slate-500 hover:text-slate-800 hover:bg-slate-200/60 scale-95 border-transparent',
        accentBorder: 'border-emerald-500/30',
        accentGlowText: 'text-emerald-400',
        accentBgColor: 'bg-emerald-600',
        accentHoverBgColor: 'hover:bg-emerald-500 shadow-emerald-900/50'
    }
}

export const getThemeClass = (mode) => {
    const isDark = mode === 'dark'
    return {
        isDark,
        bodyText: isDark ? 'text-slate-100' : 'text-slate-800',
        bodyTextMuted: isDark ? 'text-slate-400' : 'text-slate-500',
        bodyTextMutedLight: isDark ? 'text-slate-500' : 'text-slate-400',
        
        // Card Containers
        cardBg: isDark ? 'bg-slate-800/60 backdrop-blur-xl border border-slate-700/50' : 'bg-white/85 backdrop-blur-xl border border-slate-200/80 shadow-xl shadow-slate-200/10',
        cardBgSolid: isDark ? 'bg-slate-800 border border-slate-700/50' : 'bg-white border border-slate-200 shadow-md shadow-slate-200/10',
        
        // Inner item blocks
        itemBg: isDark ? 'bg-slate-900/50 border border-slate-700/50' : 'bg-slate-50 border border-slate-200/50',
        itemBgHover: isDark ? 'bg-slate-800/80 border border-slate-700 hover:border-indigo-500/50' : 'bg-white border border-slate-200/80 hover:border-indigo-500/50 shadow-sm hover:shadow-md text-slate-800',
        
        // Inputs
        input: isDark ? 'bg-slate-900 border border-slate-700 text-slate-100 focus:bg-slate-800 placeholder-slate-600 focus:border-indigo-500' : 'bg-white border border-slate-300 text-slate-800 placeholder-slate-400 focus:border-indigo-500 focus:bg-white focus:ring-4 focus:ring-indigo-500/10 focus:outline-none',
        
        // Text headers
        headerText: isDark ? 'text-slate-200' : 'text-slate-800',
        
        // SweetAlert style configs
        swal: isDark 
            ? { background: '#1e293b', color: '#f1f5f9', confirmButtonColor: '#6366f1' } 
            : { background: '#ffffff', color: '#1e293b', confirmButtonColor: '#4f46e5' },
            
        // Budget progress bars
        progressGlow: isDark ? 'shadow-emerald-500/20' : 'shadow-emerald-200/40',
        progressTrack: isDark ? 'bg-slate-900 border border-slate-800' : 'bg-slate-200 border border-slate-300',
        
        // MoM advisor cards
        advisorWarning: isDark ? 'bg-rose-500/10 border-rose-500/20 text-rose-400 border' : 'bg-rose-50 border-rose-100 text-rose-700 border',
        advisorSuccess: isDark ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400 border' : 'bg-emerald-50 border-emerald-100 text-emerald-700 border',
        advisorStable: isDark ? 'bg-blue-500/10 border-blue-500/20 text-blue-400 border' : 'bg-blue-50 border-blue-100 text-blue-700 border',
        advisorInfo: isDark ? 'bg-slate-500/10 border-slate-500/20 text-slate-400 border' : 'bg-slate-100 border-slate-200 text-slate-600 border',
        advisorPareto: isDark ? 'border-purple-500/20 bg-purple-500/5 text-purple-300 border' : 'border-purple-200 bg-purple-50/50 text-purple-700 border'
    }
}
