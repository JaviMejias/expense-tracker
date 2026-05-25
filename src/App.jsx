import { useState } from 'react'
import { useExpenseTracker } from './hooks/useExpenseTracker'
import Header from './components/Header'
import MonthSummary from './components/MonthSummary'
import ExpenseForm from './components/ExpenseForm'
import ExpenseList from './components/ExpenseList'
import FixedExpenses from './components/FixedExpenses'
import DataBackup from './components/DataBackup'
import Analytics from './components/Analytics'
import CategoryManager from './components/CategoryManager'
import SavingsGoals from './components/SavingsGoals'
import Confetti from './components/Confetti'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWallet, faListUl, faCalendarCheck, faChartLine, faPiggyBank, faTags, faChartPie } from '@fortawesome/free-solid-svg-icons'
import { format } from 'date-fns'
import { appThemes, getThemeClass } from './utils/theme'

function App() {
  const {
    activeTab,
    setActiveTab,
    currentMonthDate,
    setCurrentMonthDate,
    expenses,
    fixedExpenses,
    setFixedExpenses,
    categoryLimits,
    categories,
    savingsGoals,
    currentTheme,
    setCurrentTheme,
    themeMode,
    setThemeMode,
    expenseDate,
    setExpenseDate,
    description,
    setDescription,
    amount,
    setAmount,
    category,
    setCategory,
    editingId,
    errors,
    currentMonthExpenses,
    totalExpenses,
    remainingSalary,
    displaySalary,
    handleSalaryChange,
    handleAmountChange,
    handleSetCategoryLimit,
    handleSubmit,
    handleEdit,
    handleDelete,
    handleCancelEdit,
    handleDuplicateExpenses,
    applyFixedExpenseToMonth,
    handleAddCategory,
    handleDeleteCategory,
    handleAddSavingsGoal,
    handleDeleteSavingsGoal,
    handleContributeToGoal
  } = useExpenseTracker()

  const [confettiTrigger, setConfettiTrigger] = useState(0)
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

  return (
    <div className={`min-h-screen ${!isDark ? 'light-theme' : ''} ${isDark ? 'bg-slate-900 text-slate-100 selection:bg-indigo-500/30 selection:text-indigo-200' : 'bg-slate-50 text-slate-800 selection:bg-indigo-500/20 selection:text-indigo-900'} bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] ${isDark ? activeTheme.bgGradient : activeTheme.bgGradientLight} py-8 px-4 sm:px-6 lg:px-8 font-sans transition-all duration-1000`}>
      <style dangerouslySetInnerHTML={{ __html: globalDatePickerStyles }} />
      <div className="w-full space-y-8 animate-fade-in">
        <Header currentTheme={currentTheme} setCurrentTheme={setCurrentTheme} themeMode={themeMode} setThemeMode={setThemeMode} />

        <div className={`${s.cardBg} rounded-[2rem] shadow-2xl ${isDark ? 'shadow-indigo-900/10' : 'shadow-slate-300/50'} overflow-hidden transition-all duration-500`}>
          <div className={`flex p-3 ${isDark ? 'bg-slate-900/50' : 'bg-slate-100/50'} flex-wrap lg:flex-nowrap gap-2 transition-all duration-500`}>
            <button
              onClick={() => setActiveTab('summary')}
              className={`flex-1 py-4 font-bold text-sm sm:text-base rounded-2xl transition-all duration-300 min-w-[120px] flex items-center justify-center gap-2 cursor-pointer select-none ${activeTab === 'summary' ? activeTheme.activeTab : (isDark ? activeTheme.inactiveTab : activeTheme.inactiveTabLight)}`}
            >
              <FontAwesomeIcon icon={faChartPie} /> Resumen
            </button>
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`flex-1 py-4 font-bold text-sm sm:text-base rounded-2xl transition-all duration-300 min-w-[120px] flex items-center justify-center gap-2 cursor-pointer select-none ${activeTab === 'dashboard' ? activeTheme.activeTab : (isDark ? activeTheme.inactiveTab : activeTheme.inactiveTabLight)}`}
            >
              <FontAwesomeIcon icon={faWallet} /> Registrar
            </button>
            <button
              onClick={() => setActiveTab('categorias')}
              className={`flex-1 py-4 font-bold text-sm sm:text-base rounded-2xl transition-all duration-300 min-w-[120px] flex items-center justify-center gap-2 cursor-pointer select-none ${activeTab === 'categorias' ? activeTheme.activeTab : (isDark ? activeTheme.inactiveTab : activeTheme.inactiveTabLight)}`}
            >
              <FontAwesomeIcon icon={faTags} /> Categorías
            </button>
            <button
              onClick={() => setActiveTab('list')}
              className={`flex-1 py-4 font-bold text-sm sm:text-base rounded-2xl transition-all duration-300 min-w-[120px] flex items-center justify-center gap-2 cursor-pointer select-none ${activeTab === 'list' ? activeTheme.activeTab : (isDark ? activeTheme.inactiveTab : activeTheme.inactiveTabLight)}`}
            >
              <FontAwesomeIcon icon={faListUl} /> Lista
            </button>
            <button
              onClick={() => setActiveTab('fixed')}
              className={`flex-1 py-4 font-bold text-sm sm:text-base rounded-2xl transition-all duration-300 min-w-[120px] flex items-center justify-center gap-2 cursor-pointer select-none ${activeTab === 'fixed' ? activeTheme.activeTab : (isDark ? activeTheme.inactiveTab : activeTheme.inactiveTabLight)}`}
            >
              <FontAwesomeIcon icon={faCalendarCheck} /> Fijos
            </button>
            <button
              onClick={() => setActiveTab('savings')}
              className={`flex-1 py-4 font-bold text-sm sm:text-base rounded-2xl transition-all duration-300 min-w-[120px] flex items-center justify-center gap-2 cursor-pointer select-none ${activeTab === 'savings' ? activeTheme.activeTab : (isDark ? activeTheme.inactiveTab : activeTheme.inactiveTabLight)}`}
            >
              <FontAwesomeIcon icon={faPiggyBank} /> Ahorros
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`flex-1 py-4 font-bold text-sm sm:text-base rounded-2xl transition-all duration-300 min-w-[120px] flex items-center justify-center gap-2 cursor-pointer select-none ${activeTab === 'analytics' ? activeTheme.activeTab : (isDark ? activeTheme.inactiveTab : activeTheme.inactiveTabLight)}`}
            >
              <FontAwesomeIcon icon={faChartLine} /> Estadísticas
            </button>
          </div>

          <div className="p-6 sm:p-8">
            {activeTab === 'summary' && (
              <MonthSummary
                currentMonthDate={currentMonthDate}
                setCurrentMonthDate={setCurrentMonthDate}
                displaySalary={displaySalary}
                handleSalaryChange={handleSalaryChange}
                errors={errors}
                totalExpenses={totalExpenses}
                remainingSalary={remainingSalary}
                currentMonthExpenses={currentMonthExpenses}
                categoryLimits={categoryLimits}
                handleSetCategoryLimit={handleSetCategoryLimit}
                categories={categories}
                themeMode={themeMode}
                activeTheme={activeTheme}
              />
            )}

            {activeTab === 'dashboard' && (
              <div className="space-y-8">
                <ExpenseForm
                  editingId={editingId}
                  expenseDate={expenseDate}
                  setExpenseDate={setExpenseDate}
                  description={description}
                  setDescription={setDescription}
                  amount={amount}
                  handleAmountChange={handleAmountChange}
                  setAmount={setAmount}
                  errors={errors}
                  handleSubmit={handleSubmit}
                  handleCancelEdit={handleCancelEdit}
                  category={category}
                  setCategory={setCategory}
                  categories={categories}
                  themeMode={themeMode}
                  activeTheme={activeTheme}
                />
              </div>
            )}

            {activeTab === 'categorias' && (
              <div className="space-y-8">
                <CategoryManager
                  categories={categories}
                  handleAddCategory={handleAddCategory}
                  handleDeleteCategory={handleDeleteCategory}
                  themeMode={themeMode}
                  activeTheme={activeTheme}
                />
              </div>
            )}

            {activeTab === 'list' && (
              <ExpenseList
                key={format(currentMonthDate, 'MM-yyyy')}
                expenses={expenses}
                handleEdit={handleEdit}
                handleDelete={handleDelete}
                handleDuplicateExpenses={handleDuplicateExpenses}
                currentMonthDate={currentMonthDate}
                categories={categories}
                themeMode={themeMode}
                activeTheme={activeTheme}
              />
            )}

            {activeTab === 'fixed' && (
              <FixedExpenses
                fixedExpenses={fixedExpenses}
                setFixedExpenses={setFixedExpenses}
                applyFixedExpenseToMonth={applyFixedExpenseToMonth}
                currentMonthDate={currentMonthDate}
                setCurrentMonthDate={setCurrentMonthDate}
                categories={categories}
                themeMode={themeMode}
                activeTheme={activeTheme}
              />
            )}

            {activeTab === 'savings' && (
              <SavingsGoals
                savingsGoals={savingsGoals}
                handleAddSavingsGoal={handleAddSavingsGoal}
                handleDeleteSavingsGoal={handleDeleteSavingsGoal}
                handleContributeToGoal={handleContributeToGoal}
                remainingSalary={remainingSalary}
                onCompleteCelebrate={() => setConfettiTrigger(prev => prev + 1)}
                themeMode={themeMode}
                activeTheme={activeTheme}
              />
            )}

            {activeTab === 'analytics' && (
              <Analytics
                expenses={expenses}
                categories={categories}
                themeMode={themeMode}
                activeTheme={activeTheme}
              />
            )}
          </div>
        </div>

        <DataBackup themeMode={themeMode} />
      </div>

      {/* Confetti celebration portal */}
      <Confetti trigger={confettiTrigger} />
    </div>
  )
}

export default App