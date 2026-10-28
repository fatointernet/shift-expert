# Reglas de cálculo (V Convenio ANAV) y cómo las aplica la app

Fuente: V Convenio Colectivo de ANAV (26/04/2024), tablas salariales 2026 de afiliados y una nómina real de junio de 2026. Las páginas del PDF están en `docs/REFERENCIAS.md`.

Estados: ✅ confirmado con nómina real · 📖 según el convenio, sin nómina que lo confirme · ⚠ la app no lo hace o difiere del convenio.

## Valores 2023 y 2026
- El convenio publica los importes de **2023**. Los de **2026 = 2023 × 1,0638**. Se comprobó con el Excel de 2026 y con la nómina.
- La nómina usa los valores sin redondear (2023 × 1,0638). La app usa valores redondeados a 2 decimales, así que pueden salir céntimos de diferencia (en un mes con 73 h extra fueron 0,36 €).
- Excepción: el **TRA es el 38 % del TRC** de 2026 y el **comp. TRC es el 25 %** del TRC.
- El convenio vence el 31/12/2026 (art. 4) y se prorroga cada año si nadie lo denuncia (art. 5). Para 2027 habrá que cargar tablas nuevas (pestaña Precios).
- Incrementos: 2023 IPC; 2024, 2025 y 2026 un 1,5 % más una revisión si el IPC lo supera (arts. 6 y 7).

## Valores de referencia (Grupo V)
| Concepto | Niveles 1-9 (2023 → 2026) | Niveles 10-12 (2023 → 2026) |
|---|---|---|
| Plus TRC | 55,01 → 58,52 | 57,22 → 60,87 |
| Plus TRA (38 % TRC) | 20,90 → 22,24 | 21,74 → 23,13 |
| Comp. TRC 25 % | 13,75 → 14,63 | 14,31 → 15,22 |
| Hora extra 175 % | 46,80 → 49,79 | 49,81 → 52,99 |
| Hora ordinaria | 26,74 → 28,44 | 28,46 → 30,28 |
| Hora nocturna | 8,36 → 8,89 | 8,89 → 9,46 |
| Plus de llamada | 74,64 → 79,40 | 78,52 → 83,53 |
| Retén laborable | 52,15 → 55,48 | 52,15 → 55,48 |
| Retén festivo | 104,53 → 111,20 | 104,53 → 111,20 |

Las tablas completas (G I a G VII) están en `DEFAULT_SALARY_DATA` y coinciden con el Excel de 2026 (112 valores comprobados). El comp. TRC 25 % es un complemento del TRC para mayores de 55 años con 25 de antigüedad.

## Tarifas globales (2023 → 2026)
| Concepto | Artículo | 2023 | 2026 |
|---|---|---|---|
| Ayuda comida jornada partida (lun-jue) | 20.3.d | 30,93 | 32,90 ✅ |
| Ayuda comida jornada partida (viernes o víspera de festivo intersemanal) | 20.3.d | 43,94 | 46,74 ✅ |
| Dieta de comida o cena | 41 | 38,25 | 40,69 ✅ |
| Dieta de desayuno | 41 | 7,64 | 8,13 ⚠ (la app no la tiene) |
| Kilometraje (€/km) | 42 | 0,52 | **0,55** ✅ (la nómina paga 0,55, no 0,5532) |
| Complemento de llamada sin retén, laborable | 38 | 54,47 | 57,94 📖 |
| Complemento de llamada sin retén, festivo | 38 | 98,35 | 104,62 ✅ |
| Plus por trabajar Navidad, Año Nuevo y Reyes | 20.4.j | 134,50 | 143,08 ⚠ (la app no lo tiene) |
| Plus de disponibilidad (mensual) | 36 | 280,46 | 298,35 (fijo en nómina, no está en la app) |
| Plus de zona Ascó (mensual) | 32 | 431,96 | 459,52 (fijo en nómina, no está en la app) |

## Qué paga cada turno
Turnos rotativos de recarga (Documento 7 del convenio) y plus de turno (art. 31):

| Turno en la app | Régimen del convenio | Laborable | Festivo |
|---|---|---|---|
| R1, R3 (06:00-14:30, 14:00-22:30) | TRRe830, turno abierto de recarga | 2 pluses TRA | 3 pluses TRA |
| S1, S3 (mañana y tarde) | TRRc8, turno cerrado de recarga | 1 plus TRC | 2 pluses TRC |
| S5 (22:00-06:30) | TRRc8 noche | 2 pluses TRC | 3 pluses TRC |
| R7 (07:00-19:00) | TRRc12 | 1,5 pluses TRC | 1,5 pluses TRC |
| R9 (19:00-07:00) | TRRc12 | 2,5 pluses TRC | 2,5 pluses TRC |
| P1 | jornada partida | ayuda comida 32,90 (viernes 46,74) | |
| I7 | turno abierto normal | 1 plus TRA por día trabajado (art. 31), sin multiplicar por festivo | 1 plus TRA |
| D | descanso o vacaciones | nada | |

✅ Los multiplicadores de la tabla están implementados y coinciden con la nómina. El plus de turno compensa incomodidades, el descanso por horario continuado y el solape en el relevo.

**I7 (turno abierto normal, art. 31)** ✅: confirmado con la nómina de junio de 2026, línea "TURNO ABIERTO 1 22,24" — 1 unidad al precio base de TRA (22,24 €, G V nivel 7), sin multiplicar ×2/×3 como en R1/R3. Implementado el 28/10/2026: al elegir turno I7 se añade 1 plus TRA a tarifa base, igual en laborable que en festivo.

Festivo para la app: sábado, domingo, día marcado como festivo, o fiesta oficial o local del planificador (`cnt_1`, `cnt_3`, `festivo_especial`).

## Concepto por concepto
**Retén (arts. 19 y 37, Anexo V)** ✅: se paga el valor de retén laborable o festivo. Los días de retén festivo son los que coinciden con sábados, domingos y fiestas intersemanales. El valor corresponde a 24 horas; un retén más largo se paga proporcional al exceso. Las horas trabajadas cuando te requieren son horas extra estructurales (art. 19.d).

**Plus de llamada (art. 38, Documento 1)** ✅: se paga el valor de la tabla por llamada, con independencia de las horas trabajadas. Condiciones del Documento 1: debe haberse generado horario extraordinario; varias llamadas en un día se pagan todas; las anticipaciones de jornada lo devengan; si interrumpes la jornada para comer y vuelves antes de una hora no se paga. No se aplica a las prolongaciones de jornada. En la app, R7 y R9 en día laborable no llevan plus de llamada.

**Complemento de llamada (art. 38)** ✅ festivo / 📖 laborable: si la persona **no estaba de retén**, además del plus de llamada cobra 54,47 € (laborable) o 98,35 € (festivo) en 2023. Son importes fijos, **no** dependen del grupo ni son el valor del retén. Esta fue la corrección de octubre de 2026: antes la app usaba el retén de la tabla (111,20 en festivo) y en la nómina de junio de 2026 el importe real era 104,62. Las tarifas son editables en Precios (`COMP_LLAMADA_L` y `COMP_LLAMADA_F`).

**Horas extra (arts. 20.4 y 21, Anexo IV)** ✅ cobro / 📖 descanso: la persona elige cobrar o descansar con el recargo. Valor de la hora al 175 % en la tabla. Descanso compensatorio: horas extra en festivo o nocturnas, 120 minutos por cada 60 (2x); en laborable, 105 minutos por cada 60 (1,75x). Opción del art. 20.4.d: quien trabaja horas extra en su fiesta semanal o en una de las 17 fiestas intersemanales, cuando el día siguiente es laborable, puede cobrar el 175 % y además disfrutar un día de descanso **si las horas extra superan 5 h 30 min**; si el día siguiente no es laborable, cobra el 175 % o cobra el 75 % y hace un día de descanso. Modos de la app: `money` (cobrar 100 % de la tabla), `rest_total` (descansar 1,75x o 2x) y `mixed` (1 h de descanso por hora más 0,75 de la hora ordinaria). ⚠ La app decide el 2x por las horas nocturnas del día, no por si las horas extra son nocturnas.

**Descanso compensatorio por trabajar festivo (art. 20.4.d)** 📖: la app suma 7,5 h, 8,5 h u 8 h de descanso (según la jornada del día siguiente, intensiva, partida u otra) cuando se trabaja un festivo y el día siguiente es laborable. ⚠ No comprueba el umbral de 5 h 30 de horas extra.

**Nocturnidad (art. 34)** ✅: trabajo entre las 22:00 y las 06:00, importe por hora de la tabla. Valores por defecto de la app: S5 y R9, 8 h; R3, 0,5 h.

**Jornada partida (art. 20.3.d, Acta Adicional 7)** ✅: ayuda comida por día trabajado, incompatible con cualquier plus de turno rotativo. ⚠ Es 43,94 € (46,74 en 2026) el viernes **o la víspera de un festivo intersemanal**; la app solo mira el viernes.

**Dietas (art. 41, art. 20.1 a 3 y 4.e, Acta Adicional 9)** ✅ comida: 13 comidas × 40,69 coincidieron con la nómina. ⚠ Falta el desayuno (8,13) y las reglas de cuándo se devenga cada dieta (por ejemplo desayuno si se empieza antes de las 07:00; cena si se termina pasadas las 22:00).

**Kilometraje (art. 42, Acta Adicional 9)** ✅: 0,55 €/km. En la nómina de junio, 276 km = 6 días × 46 km base. El desplazamiento entre plantas se compensa con 116 km (máximo), más 20 km si hay salida a comer.

**Plus por trabajar en Navidad (art. 20.4.j)** ⚠: 134,50 € (143,08 en 2026) al día para quien trabaje las tardes y noches del 24-25/12, 31/12-1/1 y 5-6/1, y las mañanas del 25/12, 1/1 y 6/1. Quien trabaje parcialmente y más de dos horas lo cobra íntegro. No está en la app.

**Jornada normal y turno abierto (arts. 44 y 45)**: horario continuado de 7 h 30 min; partido de 8 h 30 min. En turno abierto la entrada de mañana es 06:45-07:15 y la de tarde 13:45-14:15 (de ahí I7). Máximo 12 h seguidas de reincorporación (art. 20.4.a): entre una jornada ampliada y la siguiente deben pasar al menos 12 horas.

**Retención (interruptor "% Ret")**: descuenta un porcentaje (el IRPF) de todos los importes en euros para ver una estimación en neto. No es cálculo fiscal.

## Fuera de la app, por ahora
Salario base, salario personal complementario, plus variable de integración, plus de quebrantamiento de moneda, paga de eficiencia, antigüedad, Seguridad Social, retribuciones en especie (luz, art. 60) y IRPF. La app calcula solo los conceptos variables por turno.
