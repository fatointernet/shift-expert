# ShiftExpert: contexto para Claude

Web app personal de Jordi para calcular lo que le corresponde por convenio según el turno que hace cada día (pluses, retén, llamadas, horas extra, nocturnidad, dietas, kilometraje, descansos) y planificar el año. Aplica el **V Convenio Colectivo de ANAV** (Asociación Nuclear Ascó-Vandellós II). Publicada en https://fatointernet.github.io/shift-expert/ (GitHub Pages sirve la rama `main`).

Tú eres la persona encargada de mantenerla y mejorarla. Jordi no es programador de formación: sabe lo que necesita, tú te encargas del código.

## Cómo trabajar con Jordi
- Español, breve y directo. Sin adornos.
- Si crees que se equivoca, díselo con argumentos. No le des la razón por complacer.
- Si no estás seguro de un dato, cifra o regla del convenio, dilo. Marca lo que sea estimación tuya. Nunca rellenes un hueco inventando.
- Antes de cambiar la lógica de un plus, comprueba el convenio (`docs/REGLAS_CONVENIO.md`) y, si se puede, una nómina real.
- Nunca pidas ni guardes su contraseña, y no entres en la app con su cuenta.

## Reglas de oro (la app está en producción y la usa para su trabajo)
1. **No romperla.** Cambios pequeños, en una rama (`dev/<tema>`), con `npm test` en verde. A `main` solo se fusiona con el visto bueno de Jordi. Un error de sintaxis deja la web en blanco.
2. **Los datos de Firebase mandan.** Lo guardado en Firestore sustituye a los valores por defecto del código. Si añades claves nuevas a un valor por defecto, fusiona al cargar (`{ ...DEFAULT, ...guardado }`), como se hace con `globalRates`.
3. **No cambies el formato de los datos de Firestore** sin migración compatible hacia atrás (la app debe seguir leyendo lo antiguo). Detalle en `docs/ARQUITECTURA.md`.
4. **El repositorio es público.** No subas nóminas, DNI, IBAN, saldos de horas, el PDF del convenio ni los Excel. La carpeta `reference/` está en `.gitignore` para eso.
5. **Valida con evidencia.** Cada importe debe salir del convenio o de una nómina real. Sin evidencia, anótalo como "por confirmar" en `docs/PENDIENTES.md`.
6. Si tocas la lógica de cálculo, añade o ajusta una prueba en `tests/calc.test.mjs`.

## Comandos
- `npm install` (solo instala Babel para las pruebas) y `npm test` (23 pruebas: cálculo de pluses y compilación del JSX).
- Probar en local: `python3 -m http.server 8000` y abrir http://localhost:8000. El login usa Firebase Auth; si en local falla, hay que revisar los dominios autorizados en la consola de Firebase (por comprobar).
- Despliegue: `git push` a `main`; GitHub Pages publica en uno o dos minutos.
- Volver atrás: el commit `c83e022` es la versión anterior a esta fase (no hay etiqueta `v0-original-gemini` subida a GitHub). `git checkout c83e022 -- index.html` la restaura.

## Dónde está cada cosa
Todo el código está en `index.html` (React 18, Tailwind, Babel y Firebase 11 por CDN, sin paso de compilación):
- Configuración de Firebase y `APP_ID`.
- `DEFAULT_SALARY_DATA`: tablas por grupo y tramo de nivel. `DEFAULT_GLOBAL_CONST` y `GLOBAL_LABELS`: tarifas globales (editables en la pestaña Precios).
- `SHIFTS`: turnos (D, P1, I7, R1, R3, R7, R9, S1, S3, S5).
- `PlannerView`: planificador anual y bolsas de horas.
- `PriceConfigPage`: pestaña Precios.
- `App`: estado, sincronización con Firestore, **`calcDay`** (el cálculo de cada día), estadísticas del mes y el editor de jornada.

## Documentación
- `docs/REGLAS_CONVENIO.md`: qué paga cada concepto, con artículo, valores 2023 y 2026, y qué está confirmado.
- `docs/ARQUITECTURA.md`: modelo de datos de Firestore y flujo de la app.
- `docs/PENDIENTES.md`: tareas ordenadas, dudas abiertas y deuda técnica.
- `docs/REFERENCIAS.md`: qué ficheros de referencia hay que dejar en `reference/` y cómo leerlos.
