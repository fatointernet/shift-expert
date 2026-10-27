# Arquitectura

## Stack
- Un único `index.html` estático. Sin build. React 18.2 (UMD), Tailwind (CDN), `@babel/standalone` 7.23.6 (compila el JSX en el navegador), iconos lucide y Firebase 11 (Auth + Firestore) por CDN.
- El script principal es `<script type="text/babel" data-type="module">`. Un error de sintaxis deja la web en blanco: por eso `tests/syntax.test.mjs` compila el bloque con Babel.
- GitHub Pages sirve la rama `main` del repositorio público `fatointernet/shift-expert`.

## Firebase
- Proyecto `notasdegasto-12d33` (compartido con otra app). La configuración pública está en el código, es normal en web apps; la seguridad real depende de las **reglas de Firestore**, que no se han revisado todavía (ver `PENDIENTES.md`).
- Login con email y contraseña (Firebase Auth).
- Cada documento guarda `{ data, updatedAt }`.

## Modelo de datos de Firestore
Ruta: `artifacts/anav-shift-calc-v5/users/{uid}/data/{documento}`

| Documento | Contenido |
|---|---|
| `shifts` | Mapa fecha ISO → jornada: `{ ds, day, shift, isReten, isFestive, activeConceptsCount{trc, trc_comp, tra, plus_llamada, comp_llamada, comida, comp_km, otros}, extraKm, extras, horasNocturnas, extraCompMode ('money'\|'rest_total'\|'mixed'), otrosLabel, otrosValue }` |
| `annual_plan` | Fecha ISO → `{ base: 'intensiva'\|'partida'\|null, concepts: { cnt_N \| festivo_especial : horas\|null } }`. Se siguen leyendo los formatos antiguos (texto suelto y `{concept, manualHours}`). Claves `w_YYYY_M_W` para las marcas de semana M/T. |
| `planner_counters` | Array de `{ id, desc, val }` (bolsas de horas). |
| `profile` | `{ group, level, kmCount, retention }` |
| `globalRates` | Tarifas globales (pestaña Precios). Se **fusionan** con `DEFAULT_GLOBAL_CONST` al cargar. |
| `salaryMatrix` | Tablas salariales editadas por el usuario. |
| `userColors` | Colores de turnos. |

Regla: lo guardado manda sobre los valores por defecto del código. Para añadir una tarifa nueva, ponla en `DEFAULT_GLOBAL_CONST` y en `GLOBAL_LABELS`; los usuarios con `globalRates` antiguo la reciben por la fusión, y `calcDay` usa `?? DEFAULT_GLOBAL_CONST.X` como segunda red.

`salaryMatrix` guardado **no** se fusiona con los valores por defecto: si algún día se añade un grupo o nivel nuevo, hay que contemplarlo.

## Flujo
1. Login → se suscribe (`onSnapshot`) a cada documento y llena el estado de `App`.
2. El usuario edita una jornada → se actualiza `shifts` y se guarda en Firestore (hoy se guarda en cada cambio).
3. `calcDay(dateStr, data, plan, shifts)` devuelve `{ items, total, ... }` por día. Las estadísticas del mes, la pestaña Balance y el planificador se construyen a partir de él.

## calcDay (resumen; el detalle de importes está en `REGLAS_CONVENIO.md`)
- Día festivo = sábado, domingo, día marcado o festivo del planificador (`cnt_1`, `cnt_3`, `festivo_especial`).
- TRC: R7 ×1,5, R9 ×2,5, S5 ×3 festivo / ×2 laborable, S1 y S3 ×2 festivo / ×1 laborable. TRA: ×3 festivo / ×2 laborable.
- Retén: tarifa laborable o festivo. Plus de llamada: se omite en R7 y R9 laborable. Complemento de llamada: solo si el día no es retén.
- Comida 40,69. P1: 46,74 el viernes, 32,90 el resto. Km: `(comp_km × kmCount + extraKm) × KM_PRICE`.
- Nocturnidad: horas × tarifa nocturna. Horas extra según `extraCompMode`.
- Descanso compensatorio al trabajar festivo con el día siguiente laborable: 7,5 h (intensiva), 8,5 h (partida), 8 h en otro caso.
- Interruptor "% Ret": multiplica los importes por (1 − retención %).

## Pruebas
- `npm test` ejecuta `node --test tests/*.test.mjs` (en Node 22 hay que usar el glob, no el directorio).
- `tests/helpers.mjs` **extrae el código real de `index.html`** entre marcadores de texto (`const DEFAULT_SALARY_DATA = {`, `const calcDay = useCallback(`, etc.) y lo ejecuta con `new Function`. Si se cambian esas líneas en `index.html`, las pruebas fallan con un mensaje claro y hay que ajustar los marcadores.
- `tests/calc.test.mjs`: pluses con fechas de junio de 2026 (sáb 2026-06-06, dom 2026-06-07, lun 2026-06-08, vie 2026-06-05).
- `tests/syntax.test.mjs`: compilación del JSX.

## Flujo de trabajo para cambios
1. `git checkout -b dev/<tema>`.
2. Cambia `index.html` y añade o ajusta la prueba.
3. `npm test` en verde.
4. Prueba en local si afecta a la interfaz (`python3 -m http.server 8000`).
5. Enseña el cambio a Jordi; con su visto bueno, fusiona en `main` y `git push`.
