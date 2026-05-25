import { colorThemes } from '../utils/theme'

function ColorSelector({ selectedColor, onSelectColor, isDark }) {
    return (
        <div className="flex gap-2 items-center h-10 flex-wrap">
            {Object.keys(colorThemes).map(themeKey => {
                const theme = colorThemes[themeKey]
                const isSelected = selectedColor === themeKey
                const colorDotClasses = {
                    rose: 'bg-rose-500 ring-rose-500/40',
                    blue: 'bg-blue-500 ring-blue-500/40',
                    amber: 'bg-amber-500 ring-amber-500/40',
                    emerald: 'bg-emerald-500 ring-emerald-500/40',
                    pink: 'bg-pink-500 ring-pink-500/40',
                    violet: 'bg-violet-500 ring-violet-500/40',
                    sky: 'bg-sky-500 ring-sky-500/40',
                    slate: 'bg-slate-500 ring-slate-500/40'
                }
                return (
                    <button
                        key={themeKey}
                        type="button"
                        onClick={() => onSelectColor(themeKey)}
                        className={`w-6 h-6 rounded-full ${colorDotClasses[themeKey]} cursor-pointer transform hover:scale-125 transition-all outline-none ${isSelected ? `ring-4 ring-offset-2 ${isDark ? 'ring-offset-slate-900' : 'ring-offset-white'} scale-110` : 'opacity-60 hover:opacity-100'}`}
                        title={theme.label}
                    ></button>
                )
            })}
        </div>
    )
}

export default ColorSelector