# Aura — Gestor de Gastos

Aplicación web de finanzas personales para registrar, organizar y analizar gastos en pesos chilenos. Aura funciona directamente en el navegador, conserva la información de forma local y puede instalarse como una Progressive Web App (PWA).

El proyecto reúne en una sola interfaz el presupuesto mensual, los movimientos diarios, gastos recurrentes, compras en cuotas, metas de ahorro, préstamos reembolsables y análisis históricos.

## Características

### Presupuesto y resumen mensual

- Registro de sueldo por mes.
- Billetera continua: el saldo histórico disponible se incorpora automáticamente al presupuesto actual.
- Indicadores de ingreso, gasto total y saldo disponible.
- Distribución de gastos por categoría mediante gráfico y barras de progreso.
- Límites configurables por categoría, con advertencia antes de registrar un gasto que los supere.
- Navegación entre meses y detección automática del cambio de período.
- Vista de deudas pendientes por gastos marcados como reembolsables.

### Registro y administración de gastos

- Creación y edición de movimientos con fecha, descripción, monto y categoría.
- Formato monetario adaptado a CLP.
- Marcado opcional de un gasto como préstamo o monto reembolsable.
- Registro de devoluciones parciales o totales y opción para condonar el saldo pendiente.
- Búsqueda por descripción o categoría y filtros por rango de fechas.
- Orden por fecha, monto o descripción.
- Selección múltiple para reasignar categorías, duplicar movimientos en el mes activo o eliminarlos.
- Eliminación coordinada con las compras en cuotas para mantener consistente su estado.

### Calendario

- Vista mensual con total gastado por día.
- Indicadores de las categorías presentes en cada fecha.
- Panel con el detalle de movimientos del día seleccionado.
- Navegación directa desde el detalle hacia la lista de gastos.

### Categorías y presupuestos

- Seis categorías iniciales: comida, servicios, transporte, entretención, salud y otros.
- Creación y edición de categorías personalizadas con nombre, emoji y color.
- Protección de las categorías del sistema.
- Reasignación automática a “Otros” al eliminar una categoría personalizada.
- Límites de gasto independientes por categoría.

### Gastos fijos

- Plantillas mensuales de una sola aplicación.
- Plantillas semanales para uno o varios días de la semana.
- Asociación de cada plantilla a una categoría.
- Aplicación al mes seleccionado y control de los meses ya procesados para evitar duplicados accidentales.

### Compras en cuotas

- Registro del monto total, número de cuotas, fecha de compra, primer mes de pago y categoría.
- Cálculo automático de la cuota para compras sin interés.
- Ingreso manual del valor mensual cuando la compra tiene interés.
- Aplicación de cada cuota como un gasto vinculado al período correspondiente.
- Opción de saltar un mes o dejar el recordatorio pendiente.
- Avisos de cuotas pendientes al cambiar de mes o abrir la aplicación en un período nuevo.

### Metas de ahorro

- Metas con nombre, monto objetivo, fecha límite y color.
- Aportes parciales con seguimiento visual del progreso.
- Sugerencia del ahorro mensual necesario para alcanzar la fecha objetivo.
- Registro de cada aporte como gasto para reflejarlo en el presupuesto.
- Celebración visual al completar una meta.

### Estadísticas y asesoría

- Evolución mensual de gastos por año.
- Total anual, promedio por mes activo y mes con mayor gasto.
- Cinco compras de mayor monto.
- Comparación con el mes anterior y detección de tendencias.
- Análisis de concentración de gastos basado en el principio de Pareto.
- Asesor financiero opcional con Google Gemini para obtener tres recomendaciones personalizadas a partir del total anual y las cinco categorías principales.

### Respaldo y exportación

- Descarga de un respaldo JSON con datos financieros, categorías, metas, cuotas y preferencias visuales.
- Importación de respaldos con validación estructural mediante Zod antes de reemplazar la información local.
- Exportación a Excel con dos hojas: detalle completo de gastos y resumen mensual.

### Experiencia de uso

- Diseño responsivo para escritorio y dispositivos móviles.
- Modos claro y oscuro.
- Cuatro temas visuales: Classic Indigo, Cyberpunk Red, Emerald Mint y Aura Pink.
- Navegación por rutas, carga diferida de vistas, transiciones y manejo de errores de interfaz.
- Instalación como PWA, funcionamiento con recursos en caché y aviso cuando existe una actualización disponible.
- Onboarding para usuarios sin información registrada y recuperación de la última sección visitada.

## Privacidad y almacenamiento

Aura es una aplicación *local-first*: no necesita una cuenta ni un backend propio. Los datos financieros, las preferencias y la API key de Gemini se guardan en `localStorage` dentro del navegador utilizado.

Esto tiene dos consecuencias importantes:

- Los datos no se sincronizan automáticamente entre navegadores o dispositivos.
- Borrar los datos del sitio puede eliminar toda la información; conviene descargar respaldos JSON periódicamente.

La integración con Gemini es opcional. Solo al solicitar un análisis se envían a la API de Google el año seleccionado, el total gastado y los totales de las cinco categorías principales. La API key se configura desde Ajustes y permanece almacenada localmente. Su uso está sujeto a las condiciones y posibles costos de Google Gemini.

## Guía rápida

1. En **Resumen**, selecciona el mes e ingresa el sueldo correspondiente.
2. En **Categorías**, adapta las categorías y define límites si los necesitas.
3. Usa **Registrar** para añadir movimientos cotidianos.
4. Configura pagos repetitivos en **Fijos** y compras financiadas en **Cuotas**.
5. Consulta **Lista** o **Calendario** para revisar y administrar los movimientos.
6. Crea objetivos en **Ahorros** y revisa la evolución anual en **Estadísticas**.
7. Descarga periódicamente un **Respaldo JSON** desde el bloque inferior de la aplicación.

## Tecnologías

| Área | Tecnología |
| --- | --- |
| Interfaz | React 19, Tailwind CSS 4, Font Awesome |
| Build y desarrollo | Vite 5 |
| Estado y persistencia | Zustand 5 |
| Navegación | React Router 7 |
| Fechas y moneda | date-fns, `Intl.NumberFormat` |
| Visualización | Recharts, React CountUp |
| Animación | Framer Motion |
| Alertas y errores | SweetAlert2, React Error Boundary |
| Exportación y validación | SheetJS (`xlsx`), Zod |
| Inteligencia artificial | Google Generative AI SDK |
| PWA | vite-plugin-pwa, Workbox |
| Calidad | ESLint, Vitest, Testing Library, happy-dom |

## Arquitectura

```text
src/
├── components/       # Vistas, formularios y componentes reutilizables
├── config/           # Metadatos de versiones y novedades
├── hooks/            # Cálculos derivados, filtros, analítica y alertas
├── services/         # Integraciones externas, como Gemini
├── store/            # Estado global, persistencia y dominios de datos
│   └── slices/       # Acciones separadas por área funcional
├── utils/            # Moneda, temas, cuotas y esquema de respaldos
├── App.jsx           # Navegación y composición principal
└── main.jsx          # Punto de entrada de React
```

La aplicación separa el estado persistente (`useDataStore`, `useThemeStore` y `useSettingsStore`) del estado temporal de interfaz (`useUIStore`). Los hooks encapsulan cálculos derivados y los componentes consumen esas capas para presentar cada flujo. Las vistas principales se cargan de forma diferida para reducir el trabajo inicial del navegador.

## Requisitos

- Node.js 20.19 o superior.
- npm compatible con la versión de Node.js instalada.

## Instalación local

```bash
git clone git@github.com:JaviMejias/expense-tracker.git
cd expense-tracker
npm install
npm run dev
```

Vite mostrará en la terminal la URL local de desarrollo, normalmente `http://localhost:5173`.

No se requiere un archivo `.env`. La API key opcional de Gemini se ingresa desde el menú de ajustes de la aplicación.

## Comandos disponibles

| Comando | Descripción |
| --- | --- |
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npm run build` | Genera la versión optimizada en `dist/`. |
| `npm run preview` | Sirve localmente el resultado de producción. |
| `npm run lint` | Ejecuta las reglas de ESLint. |
| `npm test` | Ejecuta la suite de Vitest una vez. |

## Verificación

Antes de integrar o publicar cambios:

```bash
npm ci
npm run lint
npm test
npm run build
```

El repositorio también ejecuta lint y pruebas en GitHub Actions para los *pushes* y *pull requests* dirigidos a `main`.

## Despliegue

El resultado de `npm run build` es una aplicación estática y puede publicarse en servicios como Vercel, Netlify, Cloudflare Pages o GitHub Pages. El hosting debe:

- servir el contenido generado en `dist/`;
- usar `index.html` como fallback para las rutas del cliente;
- publicar mediante HTTPS para habilitar correctamente la instalación y el *service worker* de la PWA.

Después del primer acceso, el navegador puede ofrecer la instalación de Aura. Las nuevas versiones se detectan mediante el *service worker* y la interfaz solicita recargar cuando hay una actualización disponible.

## Alcance actual

- La moneda y los textos están orientados a Chile (`CLP`, locale `es-CL`).
- La aplicación está pensada para uso personal en un único navegador y no incluye cuentas, autenticación ni sincronización en la nube.
- Los cálculos y consejos son herramientas informativas; no sustituyen asesoría financiera profesional.

## Licencia

Este repositorio no incluye actualmente un archivo de licencia. Todos los derechos permanecen reservados a su autor salvo que se añada una licencia explícita.
