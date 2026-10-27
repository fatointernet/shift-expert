# Ficheros de referencia

La carpeta `reference/` está en `.gitignore`: el repositorio es público y esos ficheros contienen datos personales o son material con derechos. **No se suben nunca.** Jordi debe copiarlos ahí en su ordenador cuando trabaje con Claude Code.

| Fichero | Para qué sirve |
|---|---|
| `reference/convenio.pdf` | V Convenio Colectivo de ANAV. No tiene capa de texto: hay que leerlo como imágenes, página a página (página del PDF = página impresa + 1). `pdftoppm -r 100 -f N -l N -png convenio.pdf p` y abrir la imagen. |
| `reference/TABLA_SALARIAL_2026_AFILIADOS.xlsx` | Tablas salariales 2026. Se comprobaron contra `DEFAULT_SALARY_DATA` (112 valores). Se lee con `openpyxl`. |
| `reference/hores_y_nocturnes.xlsx` | Horas y nocturnidad. |
| `reference/nomina-AAAA-MM.pdf` | Nóminas reales para validar importes. `pdftotext -layout nomina.pdf -` funciona. |

Dónde está lo importante del convenio (páginas impresas, por confirmar al releer): art. 19 y 37 retén, art. 20 jornada y horas extra, art. 31 plus de turno, art. 34 nocturnidad, art. 38 llamadas, art. 41 dietas, art. 42 kilometraje, Documento 1 (condiciones de llamada), Documento 7 (regímenes de turnos de recarga).

Al validar contra una nómina nueva: apunta en `docs/REGLAS_CONVENIO.md` qué importes coinciden y cuáles no, y añade una prueba en `tests/calc.test.mjs`. No copies en el repositorio ni los importes totales de la nómina ni datos identificativos.
