import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { es } from 'date-fns/locale'

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
    placeholderText
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
            calendarClassName={`aura-datepicker-${activeColor}`}
            wrapperClassName={wrapperClassName}
            placeholderText={placeholderText}
            className={`block w-full ${s.input || ''} ${focusRingClass} transition-all cursor-pointer shadow-inner text-center sm:text-left ${textColorClass} ${className}`}
        />
    )
}

export default CustomDatePicker