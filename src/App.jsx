import { useState, Suspense, lazy, useEffect, useRef } from 'react'
import { Routes, Route, NavLink, Navigate, useLocation } from 'react-router-dom'
import { ErrorBoundary } from 'react-error-boundary'
import Header from './components/Header'
import DataBackup from './components/DataBackup'
import Confetti from './components/Confetti'
import ErrorFallback from './components/ErrorFallback'
import ReloadPrompt from './components/ReloadPrompt'
import AuraBackground from './components/AuraBackground'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet, faListUl, faCalendarCheck, faChartLine, faPiggyBank, faTags, faChartPie, faSpinner, faCreditCard, faCalendarAlt } from '@fortawesome/free-solid-svg-icons'
import { appThemes, getThemeClass } from './utils/theme'
import { useThemeStore } from './store/useThemeStore'
import { useAppAlert } from './hooks/useAppAlert'
import { format } from 'date-fns'
import { useDataStore } from './store/useDataStore'
import { useMonthTransition } from './hooks/useMonthTransition'

const MonthSummary = lazy(() => import('./components/MonthSummary'))
const ExpenseForm = lazy(() => import('./components/ExpenseForm'))
const ExpenseList = lazy(() => import('./components/ExpenseList'))
const FixedExpenses = lazy(() => import('./components/FixedExpenses'))
const Installments = lazy(() => import('./components/Installments'))
const MobileNav = lazy(() => import('./components/MobileNav'))
const Analytics = lazy(() => import('./components/Analytics'))
const CategoryManager = lazy(() => import('./components/CategoryManager'))
const SavingsGoals = lazy(() => import('./components/SavingsGoals'))
const CalendarView = lazy(() => import('./components/CalendarView'))

import { AnimatePresence } from 'framer-motion'
import PageTransition from './components/PageTransition'

const LoaderFallback = () => (
  <div className="space-y-4 p-2">
    {[1, 2, 3].map(i => (
      <div key={i} className="animate-skeleton rounded-2xl" style={{ animationDelay: `${i * 100}ms` }}>
        <div className={`h-24 rounded-2xl bg-slate-800/60 animate-skeleton`} style={{ animationDelay: `${i * 150}ms` }} />
      </div>
    ))}
  </div>
)

function App() {
  const { currentTheme, themeMode } = useThemeStore()
  const [confettiTrigger, setConfettiTrigger] = useState(0)
  const { showToast } = useAppAlert(themeMode)
  const { lastSeenMonth, setLastSeenMonth, _hasHydrated } = useDataStore()
  const { handleMonthTransition } = useMonthTransition()
  const startupCheckDone = useRef(false)
  const location = useLocation()

  useEffect(() => {
    if (location.pathname !== '/') {
      localStorage.setItem('lastTab', location.pathname)
    }
  }, [location.pathname])

  useEffect(() => {
    if (localStorage.getItem('backupImportedFlag')) {
      showToast('Respaldo cargado correctamente 🎉', 'success', 4000)
      localStorage.removeItem('backupImportedFlag')
    }
  }, [showToast])
  
  const activeTheme = appThemes[currentTheme] || appThemes.classic
  const isDark = themeMode === 'dark'
  const s = getThemeClass(themeMode)

  const activeColor = activeTheme?.accentBgColor?.includes('rose') ? 'rose' : activeTheme?.accentBgColor?.includes('emerald') ? 'emerald' : activeTheme?.accentBgColor?.includes('pink') ? 'pink' : 'indigo'
  
  const colorMap = {
    rose: { hex: '#f43f5e', bgHover: 'rgba(244, 63, 94, 0.15)', rgb: '244, 63, 94' },
    emerald: { hex: '#10b981', bgHover: 'rgba(16, 185, 129, 0.15)', rgb: '16, 185, 129' },
    pink: { hex: '#ec4899', bgHover: 'rgba(236, 72, 153, 0.15)', rgb: '236, 72, 153' },
    indigo: { hex: '#6366f1', bgHover: 'rgba(99, 102, 241, 0.15)', rgb: '99, 102, 241' }
  }
  
  const auraHex = colorMap[activeColor].hex
  const auraBgHover = colorMap[activeColor].bgHover
  const auraRgb = colorMap[activeColor].rgb

  useEffect(() => {
    document.documentElement.style.setProperty('--aura-color', auraHex)
    document.documentElement.style.setProperty('--aura-rgb', auraRgb)
    document.documentElement.style.setProperty('--aura-bg-hover', auraBgHover)
  }, [auraHex, auraRgb, auraBgHover])

  // Detección automática de cambio de mes al abrir la app
  // Solo corre una vez cuando el store de Zustand termina de hidratarse desde localStorage
  useEffect(() => {
    if (!_hasHydrated || startupCheckDone.current) return
    startupCheckDone.current = true
    const currentMonthKey = format(new Date(), 'MM-yyyy')
    if (lastSeenMonth && lastSeenMonth !== currentMonthKey) {
      setLastSeenMonth(currentMonthKey)
      handleMonthTransition(lastSeenMonth, currentMonthKey)
    } else {
      setLastSeenMonth(currentMonthKey)
    }
  }, [_hasHydrated, handleMonthTransition, lastSeenMonth, setLastSeenMonth])



  const getNavLinkClass = ({ isActive }) => 
    `md:flex-1 flex-shrink-0 py-4 font-bold text-sm sm:text-base rounded-2xl transition-all duration-300 px-3 lg:px-5 flex items-center justify-center gap-2 cursor-pointer select-none ${isActive ? activeTheme.activeTab : (isDark ? activeTheme.inactiveTab : activeTheme.inactiveTabLight)}`

  return (
    <div className={`min-h-screen relative ${!isDark ? 'light-theme' : ''} ${isDark ? 'bg-slate-950 text-slate-100 selection:bg-[rgba(var(--aura-rgb),0.3)] selection:text-white' : 'bg-slate-50 text-slate-800 selection:bg-[rgba(var(--aura-rgb),0.2)] selection:text-slate-900'} font-sans transition-all duration-1000`}>
      <AuraBackground activeColor={activeColor} isDark={isDark} />
      <div className="w-full relative z-10 space-y-8 animate-fade-in py-8 px-4 sm:px-6 lg:px-8">
        <Header />

        <div className={`${s.cardBg} rounded-[2rem] shadow-[0_0_40px_rgba(var(--aura-rgb),0.1)] hover:shadow-[0_0_60px_rgba(var(--aura-rgb),0.15)] border border-[rgba(var(--aura-rgb),0.2)] overflow-hidden transition-all duration-500`}>
          {/* Navegación Desktop */}
          <div className={`hidden md:flex p-3 ${isDark ? 'bg-slate-900/40' : 'bg-white/40'} backdrop-blur-sm border-b border-[rgba(var(--aura-rgb),0.1)] flex-wrap lg:flex-nowrap gap-2 w-full transition-all duration-500`}>
            <NavLink to="/resumen" className={getNavLinkClass}>
              <FontAwesomeIcon icon={faChartPie} /> Resumen
            </NavLink>
            <NavLink to="/calendario" className={getNavLinkClass}>
              <FontAwesomeIcon icon={faCalendarAlt} /> Calendario
            </NavLink>
            <NavLink to="/categorias" className={getNavLinkClass}>
              <FontAwesomeIcon icon={faTags} /> Categorías
            </NavLink>
            <NavLink to="/registrar" className={getNavLinkClass}>
              <FontAwesomeIcon icon={faWallet} /> Registrar
            </NavLink>
            <NavLink to="/lista" className={getNavLinkClass}>
              <FontAwesomeIcon icon={faListUl} /> Lista
            </NavLink>
            <NavLink to="/cuotas" className={getNavLinkClass}>
              <FontAwesomeIcon icon={faCreditCard} /> Cuotas
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

          {/* Navegación Mobile (Dropdown) */}
          <div className="md:hidden p-4 border-b border-[rgba(var(--aura-rgb),0.1)]">
            <Suspense fallback={<div className="h-14 bg-slate-200 dark:bg-slate-800 rounded-2xl animate-pulse"></div>}>
              <MobileNav />
            </Suspense>
          </div>

          <div className="p-6 sm:p-8 min-h-[300px] overflow-hidden relative">
            <ErrorBoundary FallbackComponent={ErrorFallback}>
              <Suspense fallback={<LoaderFallback />}>
                <AnimatePresence mode="wait">
                  <Routes location={location} key={location.pathname}>
                    <Route path="/" element={<Navigate to={localStorage.getItem('lastTab') || '/resumen'} replace />} />
                    <Route path="/resumen" element={<PageTransition><MonthSummary /></PageTransition>} />
                    <Route path="/calendario" element={<PageTransition><CalendarView /></PageTransition>} />
                    <Route path="/registrar" element={<PageTransition><div className="space-y-8"><ExpenseForm /></div></PageTransition>} />
                    <Route path="/categorias" element={<PageTransition><div className="space-y-8"><CategoryManager /></div></PageTransition>} />
                    <Route path="/lista" element={<PageTransition><ExpenseList /></PageTransition>} />
                    <Route path="/cuotas" element={<PageTransition><Installments /></PageTransition>} />
                    <Route path="/fijos" element={<PageTransition><FixedExpenses /></PageTransition>} />
                    <Route path="/ahorros" element={<PageTransition><SavingsGoals onCompleteCelebrate={() => setConfettiTrigger(prev => prev + 1)} /></PageTransition>} />
                    <Route path="/estadisticas" element={<PageTransition><Analytics /></PageTransition>} />
                  </Routes>
                </AnimatePresence>
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