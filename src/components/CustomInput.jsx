import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { formatCLP } from '../utils/currency'

function CustomInput({
    id,
    type = "text",
    value,
    onChange,
    onBlur,
    placeholder,
    isAmount = false,
    setEvaluatedAmount,
    icon,
    iconClass = '',
    rightElement,
    s = {},
    focusRingClass = '',
    className = '',
    ...props
}) {
    const evaluateExpression = (expr) => {
        if (!expr) return 0
        const hasOperators = /[+\-*/]/.test(expr)
        if (!hasOperators) {
            return parseInt(expr.toString().replace(/\D/g, ''), 10) || 0
        }

        const cleaned = expr.replace(/\./g, '').replace(/[^0-9+\-*/().]/g, '')
        try {
            const result = Function(`"use strict"; return (${cleaned})`)()
            return typeof result === 'number' && !isNaN(result) && isFinite(result) ? Math.round(result) : 0
        } catch {
            return 0
        }
    }

    const handleChange = (e) => {
        if (isAmount) {
            const val = e.target.value
            const hasOperators = /[+\-*/]/.test(val)
            if (!hasOperators) {
                const numericVal = val.replace(/\D/g, '')
                e.target.value = numericVal ? formatCLP(numericVal) : ''
            }
        }
        if (onChange) onChange(e)
    }

    const handleBlur = (e) => {
        if (isAmount && setEvaluatedAmount) {
            const evaluated = evaluateExpression(value)
            if (evaluated > 0) {
                setEvaluatedAmount(formatCLP(evaluated))
            } else {
                setEvaluatedAmount('')
            }
        }
        if (onBlur) onBlur(e)
    }

    const baseInputClasses = `block w-full ${s.input || ''} ${focusRingClass} transition-all shadow-inner`
    const finalClassName = `${baseInputClasses} ${isAmount || icon ? 'pl-11 pr-4' : 'px-5'} ${rightElement ? '!pr-[4.5rem]' : ''} ${className}`

    return (
        <div className="relative w-full">
            {(isAmount || icon) && (
                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    {isAmount ? (
                        <span className={`${iconClass} font-extrabold text-lg transition-colors`}>$</span>
                    ) : (
                        <FontAwesomeIcon icon={icon} className={`text-slate-500 ${iconClass}`} />
                    )}
                </div>
            )}
            <input id={id} type={type} value={value} onChange={handleChange} onBlur={handleBlur} placeholder={placeholder} className={finalClassName} {...props} />
            {rightElement && (
                <div className="absolute inset-y-0 right-0 pr-4 flex items-center">
                    {rightElement}
                </div>
            )}
        </div>
    )
}

export default CustomInput