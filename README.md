# 🌌 Gestor de Gastos Aura (Expense Tracker)

Una aplicación de gestión financiera personal construida con **React, Vite y TailwindCSS**. Diseñada bajo los más altos estándares de **Ingeniería de Software**, aplicando **Diseño Atómico**, separación de responsabilidades y un sistema de temas dinámico altamente escalable.

## ✨ Características Principales

- **Asistente Predictivo**: Análisis de tendencias mes a mes y consejos basados en el principio de Pareto.
- **Plantillas de Gastos Fijos**: Automatización de ingresos recurrentes y gastos fijos diarios/semanales.
- **Metas de Ahorro**: Seguimiento visual mediante gráficos circulares (SVG) del progreso de tus metas.
- **Sistema de Respaldo**: Exportación e importación de datos en formato JSON de forma local y segura.
- **Formateo en Tiempo Real**: Los inputs matemáticos detectan operadores o formatean a moneda local instantáneamente.

## 🏗️ Arquitectura y Modularidad (100% Dry)

Este proyecto se reestructuró para eliminar por completo la duplicidad de código, logrando un ecosistema 100% abstracto:

### 1. Interfaz de Usuario (Diseño Atómico)
- **Átomos**: `<CustomButton />`, `<CustomInput />`, `<CustomSelect />`, `<CategoryBadge />`.
- **Moléculas**: `<ExpenseListItem />`, `<StatCard />`, `<ProgressBar />`, `<EmptyState />`.
- **Organismos**: Las vistas principales (`MonthSummary.jsx`, `Analytics.jsx`, etc.) actúan como directores de orquesta limpios y legibles.

### 2. Capa de Lógica (Custom Hooks)
- `useAnalytics`: Extrae toda la matemática compleja, promedios y mapeo de datos para los gráficos.
- `useExpensesFilter`: Centraliza el algoritmo de filtrado, búsqueda y ordenamiento de arrays.
- `useAppAlert`: Envoltorio de *SweetAlert2* que inyecta automáticamente los colores del tema y formatea prompts de dinero en tiempo real.

### 3. Theming System (Sistema de Temas)
Todo el diseño responde a un único archivo `theme.js` y al hook `useThemeStyles`. Cambiar de "Classic Indigo" a "Cyberpunk Red" o "Emerald Mint" modifica instantáneamente botones, alertas, gráficos, brillos y gradientes sin tocar las vistas.

## 🗺️ Roadmap

### Fase 1: MVP Funcional ✅
- [x] CRUD de Gastos.
- [x] Persistencia en `localStorage`.
- [x] Filtros por fechas y categorías.

### Fase 2: Refactorización y Arquitectura Avanzada ✅
- [x] Extracción de componentes UI (Custom Input, Button, DatePicker).
- [x] Creación de Theming System Dinámico (Aura).
- [x] Abstracción total de lógica a Custom Hooks (Cero lógica matemática en vistas).
- [x] Modificación de alertas nativas a sistema de notificaciones global.

### Fase 3: Despliegue y Optimización 🚀
- [ ] Despliegue en producción mediante Vercel / Netlify.
- [x] Configuración como PWA (Progressive Web App) para instalar en móviles.
- [ ] Pruebas unitarias para los Hooks de cálculo matemático.

## 🛠️ Instalación y Uso

1. Clona el repositorio:
```bash
git clone https://github.com/tu-usuario/expense-tracker.git
```
2. Instala las dependencias:
```bash
npm install
```
3. Inicia el servidor de desarrollo:
```bash
npm run dev
```

---
*Desarrollado con ❤️ y las mejores prácticas de React.*
