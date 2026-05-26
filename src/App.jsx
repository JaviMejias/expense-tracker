import { useState, Suspense, lazy, useEffect } from 'react'
import { Routes, Route, NavLink, Navigate } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import Header from './components/Header'
import DataBackup from './components/DataBackup'
import Confetti from './components/Confetti'
import ErrorFallback from './components/ErrorFallback'
import ReloadPrompt from './components/ReloadPrompt'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet, faListUl, faCalendarCheck, faChartLine, faPiggyBank, faTags, faChartPie, faSpinner } from '@fortawesome/free-solid-svg-icons'
import { appThemes, getThemeClass } from './utils/theme'
import { useThemeStore } from './store/useThemeStore'
import { useAppAlert } from './hooks/useAppAlert'

const MonthSummary = lazy(() => import('./components/MonthSummary'))
const ExpenseForm = lazy(() => import('./components/ExpenseForm'))
const ExpenseList = lazy(() => import('./components/ExpenseList'))
const FixedExpenses = lazy(() => import('./components/FixedExpenses'))
const Analytics = lazy(() => import('./components/Analytics'))
const CategoryManager = lazy(() => import('./components/CategoryManager'))
const SavingsGoals = lazy(() => import('./components/SavingsGoals'))

const LoaderFallback = () => (
  <div className="flex flex-col items-center justify-center p-20 opacity-50 animate-pulse">
    <FontAwesomeIcon icon={faSpinner} spin className="text-4xl mb-4 text-indigo-500" />
    <p className="font-bold tracking-widest uppercase text-xs">Cargando módulo...</p>
  </div>
)

function App() {
  const { currentTheme, themeMode } = useThemeStore()
  const [confettiTrigger, setConfettiTrigger] = useState(0)
  const { showToast } = useAppAlert(themeMode)

  useEffect(() => {
    if (localStorage.getItem('backupImportedFlag')) {
      showToast('Respaldo cargado correctamente 🎉', 'success', 4000)
      localStorage.removeItem('backupImportedFlag')
    }
  }, [showToast])
  
  const activeTheme = appThemes[currentTheme] || appThemes.classic
  const isDark = themeMode === 'dark'
  const s = getThemeClass(themeMode)

  const activeColor = activeTheme?.accentBgColor?.includes('rose') ? 'rose' : activeTheme?.accentBgColor?.includes('emerald') ? 'emerald' : 'indigo'
  const auraHex = activeColor === 'rose' ? '#f43f5e' : activeColor === 'emerald' ? '#10b981' : '#6366f1'
  const auraBgHover = activeColor === 'rose' ? 'rgba(244, 63, 94, 0.15)' : activeColor === 'emerald' ? 'rgba(16, 185, 129, 0.15)' : 'rgba(99, 102, 241, 0.15)'

  const globalDatePickerStyles = `
      .aura-datepicker-${activeColor} .react-datepicker {
          font-family: inherit;
          background-color: ${isDark ? '#1e293b' : '#ffffff'} !important;
          border: 1px solid ${isDark ? '#334155' : '#e2e8f0'} !important;
          border-radius: 1rem !important;
          overflow: hidden;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.2) !important;
      }
      .aura-datepicker-${activeColor} .react-datepicker__header {
          background-color: ${isDark ? '#0f172a' : '#f8fafc'} !important;
          border-bottom: 1px solid ${auraBgHover} !important;
      }
      .aura-datepicker-${activeColor} .react-datepicker__current-month,
      .aura-datepicker-${activeColor} .react-datepicker-year-header {
          color: ${auraHex} !important;
          font-weight: 900 !important;
      }
      .aura-datepicker-${activeColor} .react-datepicker__day-name {
          color: ${isDark ? '#cbd5e1' : '#475569'} !important;
          font-weight: 800 !important;
      }
      .aura-datepicker-${activeColor} .react-datepicker__day,
      .aura-datepicker-${activeColor} .react-datepicker__month-text,
      .aura-datepicker-${activeColor} .react-datepicker__year-text {
          color: ${isDark ? '#cbd5e1' : '#334155'} !important;
          border-radius: 0.5rem !important;
      }
      .aura-datepicker-${activeColor} .react-datepicker__day:hover,
      .aura-datepicker-${activeColor} .react-datepicker__month-text:hover,
      .aura-datepicker-${activeColor} .react-datepicker__year-text:hover {
          background-color: ${auraBgHover} !important;
          color: ${auraHex} !important;
      }
      .aura-datepicker-${activeColor} .react-datepicker__day--selected,
      .aura-datepicker-${activeColor} .react-datepicker__day--keyboard-selected,
      .aura-datepicker-${activeColor} .react-datepicker__month-text--selected,
      .aura-datepicker-${activeColor} .react-datepicker__month-text--keyboard-selected,
      .aura-datepicker-${activeColor} .react-datepicker__month--selected,
      .aura-datepicker-${activeColor} .react-datepicker__month--keyboard-selected,
      .aura-datepicker-${activeColor} .react-datepicker__year-text--selected,
      .aura-datepicker-${activeColor} .react-datepicker__year-text--keyboard-selected,
      .aura-datepicker-${activeColor} .react-datepicker__day[aria-selected="true"],
      .aura-datepicker-${activeColor} .react-datepicker__month-text[aria-selected="true"],
      .aura-datepicker-${activeColor} .react-datepicker__year-text[aria-selected="true"] {
          background-color: ${auraHex} !important;
          color: #ffffff !important;
          font-weight: 900 !important;
      }
      .aura-datepicker-${activeColor} .react-datepicker__day--today,
      .aura-datepicker-${activeColor} .react-datepicker__month-text--today,
      .aura-datepicker-${activeColor} .react-datepicker__year-text--today {
          border: 1px solid ${auraHex} !important;
          color: ${auraHex} !important;
          font-weight: 900 !important;
          background-color: transparent !important;
      }
      .aura-datepicker-${activeColor} .react-datepicker__day--today.react-datepicker__day--selected,
      .aura-datepicker-${activeColor} .react-datepicker__day--today.react-datepicker__day--keyboard-selected,
      .aura-datepicker-${activeColor} .react-datepicker__month-text--today.react-datepicker__month-text--selected,
      .aura-datepicker-${activeColor} .react-datepicker__month-text--today.react-datepicker__month-text--keyboard-selected,
      .aura-datepicker-${activeColor} .react-datepicker__month-text--today.react-datepicker__month--selected,
      .aura-datepicker-${activeColor} .react-datepicker__month-text--today[aria-selected="true"],
      .aura-datepicker-${activeColor} .react-datepicker__day--today[aria-selected="true"] {
          background-color: ${auraHex} !important;
          color: #ffffff !important;
          border-color: ${auraHex} !important;
      }
      .aura-datepicker-${activeColor} .react-datepicker__navigation-icon::before {
          border-color: ${auraHex} !important;
      }
      .react-datepicker-popper {
          z-index: 9999 !important;
      }
  `

  const getNavLinkClass = ({ isActive }) => 
    `flex-1 py-4 font-bold text-sm sm:text-base rounded-2xl transition-all duration-300 min-w-[120px] flex items-center justify-center gap-2 cursor-pointer select-none ${isActive ? activeTheme.activeTab : (isDark ? activeTheme.inactiveTab : activeTheme.inactiveTabLight)}`

  return (
    <div className={`min-h-screen ${!isDark ? 'light-theme' : ''} ${isDark ? 'bg-slate-900 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200' : 'bg-slate-50 text-slate-800 selection:bg-indigo-500/20 selection:text-indigo-900'} bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${isDark ? activeTheme.bgGradient : activeTheme.bgGradientLight} py-8 px-4 sm:px-6 lg:px-8 font-sans transition-all duration-1000`}>
      <style dangerouslySetInnerHTML={{ __html: globalDatePickerStyles }} />
      <div className="w-full space-y-8 animate-fade-in">
        <Header />

        <div className={`${s.cardBg} rounded-[2rem] shadow-2xl ${isDark ? 'shadow-indigo-900/10' : 'shadow-slate-300/50'} overflow-hidden transition-all duration-500`}>
          <div className={`flex p-3 ${isDark ? 'bg-slate-900/50' : 'bg-slate-100/50'} flex-wrap lg:flex-nowrap gap-2 transition-all duration-500`}>
            <NavLink to="/resumen" className={getNavLinkClass}>
              <FontAwesomeIcon icon={faChartPie} /> Resumen
            </NavLink>
            <NavLink to="/registrar" className={getNavLinkClass}>
              <FontAwesomeIcon icon={faWallet} /> Registrar
            </NavLink>
            <NavLink to="/categorias" className={getNavLinkClass}>
              <FontAwesomeIcon icon={faTags} /> Categorías
            </NavLink>
            <NavLink to="/lista" className={getNavLinkClass}>
              <FontAwesomeIcon icon={faListUl} /> Lista
            </NavLink>
            <NavLink to="/fijos" className={getNavLinkClass}>
              <FontAwesomeIcon icon={faCalendarCheck} /> Fijos
            </NavLink>
            <NavLink to="/ahorros" className={getNavLinkClass}>
              <FontAwesomeIcon icon={faPiggyBank} /> Ahorros
            </NavLink>
            <NavLink to="/estadisticas" className={getNavLinkClass}>
              <FontAwesomeIcon icon={faChartLine} /> Estadísticas
            </NavLink>
          </div>

          <div className="p-6 sm:p-8 min-h-[300px]">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<LoaderFallback />}>
                <Routes>
                  <Route path="/" element={<Navigate to="/resumen" replace />} />
                  <Route path="/resumen" element={<MonthSummary />} />
                  <Route path="/registrar" element={<div className="space-y-8"><ExpenseForm /></div>} />
                  <Route path="/categorias" element={<div className="space-y-8"><CategoryManager /></div>} />
                  <Route path="/lista" element={<ExpenseList />} />
                  <Route path="/fijos" element={<FixedExpenses />} />
                  <Route path="/ahorros" element={<SavingsGoals onCompleteCelebrate={() => setConfettiTrigger(prev => prev + 1)} />} />
                  <Route path="/estadisticas" element={<Analytics />} />
                </Routes>
              </Suspense>
            </ErrorBoundary>
          </div>
        </div>

        <DataBackup />
      </div>

      <Confetti trigger={confettiTrigger} />
      <ReloadPrompt />
    </div>
  )
}

export default App