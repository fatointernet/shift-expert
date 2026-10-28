# Pendientes

Ordenados por prioridad. Lo marcado "por confirmar" necesita evidencia (convenio o nómina) antes de tocar el código.

## 1. Comprobaciones con Jordi (sin código)
- Comparar la pestaña Balance de junio de 2026 con la nómina: TRC ×23,5, TRA ×1, nocturnidad 8 h, llamada ×4, horas extra 73 h, retén 5 + 2, comp. llamada festivo ×3, comida ×13, km 276, P1 ×4 más 1 en viernes. Hasta que lo haga, la app solo está comprobada pieza a pieza, no en total.
- ✅ **Reglas de seguridad de Firestore** (revisadas 27/10/2026): la ruta de ShiftExpert, `artifacts/anav-shift-calc-v5/users/{userId}/data/{document=**}`, exige `request.auth != null && request.auth.uid == userId`. Correcto: nadie puede leer ni escribir los datos de otro usuario. No se ha visto el resto del fichero de reglas (la otra app que comparte el proyecto), así que eso queda sin revisar.
- Dominios autorizados de Firebase Auth: comprobar que `fatointernet.github.io` está y si `localhost` funciona.

## 2. Diferencias con el convenio, por confirmar
Ninguna se ha tocado porque no hay nómina que las confirme.
1. **Comp. llamada laborable (57,94)**: sale del art. 38 (54,47 × 1,0638). La nómina de junio solo tuvo casos festivos.
2. **P1 en víspera de festivo intersemanal**: el convenio (art. 20.3.d) paga 46,74 también en la víspera, la app solo en viernes.
3. **I7**: según el art. 31 devenga 1 plus TRA por día trabajado; la app no lo cuenta. Por confirmar con nómina.
4. **Umbral de 5 h 30 min** en horas extra de festivo para el descanso adicional (art. 20.4.d): la app no lo comprueba.
5. **Horas extra nocturnas con descanso 2x**: la app mira las horas nocturnas del día, el convenio habla de horas extra nocturnas.
6. **Dieta de desayuno** (8,13): no existe en la app.
7. **Plus de Navidad, Año Nuevo y Reyes** (143,08, art. 20.4.j): no existe en la app.
8. **Plus de disponibilidad (298,35) y plus de zona (459,52)**: aparecen fijos en nómina; solo añadirlos si Jordi quiere ver el total de la nómina.
9. Artículos **43 y 73** del convenio sin leer.
10. Redondeo: la nómina usa 2023 × 1,0638 sin redondear; la app usa valores de 2 decimales. Diferencias de céntimos (0,36 € en 73 h extra). Se puede ignorar o guardar más decimales.

## 3. Errores pequeños
- ✅ Clases `max-sm` y `max-lg` corregidas a `max-w-sm` / `max-w-lg` (caja de login y modal de ajustes), 28/10/2026.
- `PriceConfigPage` oculta las claves antiguas `CALL_L` y `CALL_F`.
- `new Date(dateStr)` interpreta la fecha ISO como UTC. En España funciona; se rompería con otra zona horaria.

## 4. Privacidad y datos
- `DEFAULT_PLANNER_COUNTERS` contiene saldos de horas personales en un repositorio **público**. Sustituirlos por valores vacíos (Jordi los tiene ya en Firestore) y valorar limpiar el historial de git si le importa.
- El historial público ya contiene la configuración de Firebase (normal) y esos saldos.

## 5. Deuda técnica
- Todos los turnos están en un solo documento `shifts` y se guarda en cada pulsación de tecla. Firestore limita un documento a 1 MiB: con años de datos puede llegar al límite, y hay riesgo de pisar cambios entre dispositivos. Solución: guardar con retraso (debounce) y, más adelante, un documento por mes (con migración compatible hacia atrás).
- Todo el código vive en un `index.html` grande con Babel en el navegador (arranque lento). Dividir en ficheros o añadir build solo si merece la pena; hoy prima no romper nada.
- Cargar las tablas de 2027 cuando salgan (el convenio se prorroga tácitamente, art. 5).
- Exportar los datos a un fichero como copia de seguridad.
