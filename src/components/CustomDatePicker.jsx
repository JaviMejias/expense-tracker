import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { es } from 'date-fns/locale'
import { getMonth, getYear } from 'date-fns'
import { forwardRef } from 'react'

const DatePickerInput = forwardRef(({ value, onClick, placeholder, className }, ref) => (
    <input
        type="text"
        value={value}
        onClick={onClick}
        onChange={() => {}} 
        readOnly={true} 
        inputMode="none" 
        ref={ref}
        placeholder={placeholder}
        className={className}
    />
))

function CustomDatePicker({
    selected,
    onChange,
    type = 'date',
    dateFormat,
    activeColor = 'indigo',
    activeTheme,
    isDark,
    s = {},
    focusRingClass = '',
    wrapperClassName = 'w-full',
    className = '',
    placeholderText,
    fastNavigation = false,
    minDate,
    maxDate,
}) {
    const isMonth = type === 'month'
    const finalDateFormat = dateFormat || (isMonth ? 'MMMM yyyy' : 'dd MMMM yyyy')
    const textColorClass = activeTheme ? activeTheme.accentGlowText : (isDark ? 'text-indigo-400' : 'text-indigo-600')

    return (
        <DatePicker
            selected={selected}
            onChange={onChange}
            dateFormat={finalDateFormat}
            showMonthYearPicker={isMonth}
            locale={es}
            calendarClassName={`aura-datepicker-${activeColor} z-[9999]`}
            wrapperClassName={wrapperClassName}
            placeholderText={placeholderText}
            customInput={<DatePickerInput />}
            minDate={minDate}
            maxDate={maxDate}
            portalId="root"
            {...(fastNavigation && {
                renderCustomHeader: ({
                    date,
                    changeYear,
                    changeMonth,
                    decreaseMonth,
                    increaseMonth,
                    prevMonthButtonDisabled,
                    nextMonthButtonDisabled,
                }) => {
                    const months = [
                        "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
                        "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
                    ]
                    const currentYear = new Date().getFullYear()
                    // Create an array of years from 5 years ago to 25 years in the future
                    const years = Array.from({ length: 30 }, (_, i) => currentYear - 5 + i)

                    return (
                        <div className="flex justify-center items-center gap-1.5 px-2 py-2 m-2 bg-black/5 dark:bg-white/5 rounded-2xl">
                            <button
                                type="button"
                                onClick={decreaseMonth}
                                disabled={prevMonthButtonDisabled}
                                className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-200 text-slate-600'} transition-colors disabled:opacity-30`}
                            >
                                {"<"}
                            </button>
                            <select
                                value={months[getMonth(date)]}
                                onChange={({ target: { value } }) => changeMonth(months.indexOf(value))}
                                className={`py-1.5 px-2 text-sm font-extrabold rounded-xl border-0 outline-none cursor-pointer appearance-none text-center ${isDark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-white text-slate-700 hover:bg-slate-50'} shadow-sm transition-all flex-1`}
                                style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                            >
                                {months.map((option) => (
                                    <option key={option} value={option} className={isDark ? 'bg-slate-800' : 'bg-white'}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <select
                                value={getYear(date)}
                                onChange={({ target: { value } }) => changeYear(Number(value))}
                                className={`py-1.5 px-2 text-sm font-extrabold rounded-xl border-0 outline-none cursor-pointer appearance-none text-center ${isDark ? 'bg-slate-800 text-slate-200 hover:bg-slate-700' : 'bg-white text-slate-700 hover:bg-slate-50'} shadow-sm transition-all`}
                                style={{ WebkitAppearance: 'none', MozAppearance: 'none' }}
                            >
                                {years.map((option) => (
                                    <option key={option} value={option} className={isDark ? 'bg-slate-800' : 'bg-white'}>
                                        {option}
                                    </option>
                                ))}
                            </select>
                            <button
                                type="button"
                                onClick={increaseMonth}
                                disabled={nextMonthButtonDisabled}
                                className={`flex items-center justify-center w-8 h-8 rounded-full font-bold ${isDark ? 'hover:bg-slate-700 text-slate-300' : 'hover:bg-slate-200 text-slate-600'} transition-colors disabled:opacity-30`}
                            >
                                {">"}
                            </button>
                        </div>
                    )
                }
            })}
            className={`block w-full ${s.input || ''} ${focusRingClass} transition-all cursor-pointer shadow-inner text-center sm:text-left ${textColorClass} ${className}`}
        />
    )
}

export default CustomDatePicker