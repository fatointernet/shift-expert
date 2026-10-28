// Pruebas del cálculo de pluses. Ejecutar con: npm test
// Referencias: docs/REGLAS_CONVENIO.md (valores 2026 = valores 2023 del V Convenio ANAV x 1,0638).

import test from 'node:test';
import assert from 'node:assert/strict';
import { calc, item, DEFAULT_GLOBAL_CONST, DEFAULT_SALARY_DATA, PROFILE } from './helpers.mjs';

const near = (actual, expected, msg, tol = 0.005) =>
    assert.ok(Math.abs(actual - expected) <= tol, `${msg}: esperado ${expected}, obtenido ${actual}`);

// Fechas de junio de 2026: 1 = lunes. 6 = sábado, 7 = domingo, 8 = lunes, 5 = viernes.
const SAB = '2026-06-06', DOM = '2026-06-07', LUN = '2026-06-08', VIE = '2026-06-05';

test('tablas: G V nivel 7 coincide con el Excel de 2026', () => {
    const r = DEFAULT_SALARY_DATA['G V']['1-9'];
    assert.deepEqual(r, { trc: 58.52, tra: 22.24, extra: 49.79, night: 8.89, call: 79.40, r_l: 55.48, r_f: 111.20, trc_comp: 14.63 });
});

test('complemento de llamada en festivo = 104,62 (corregido; antes usaba el retén festivo, 111,20)', () => {
    const r = calc(SAB, { shift: 'R7', activeConceptsCount: { comp_llamada: 1 } });
    near(item(r, 'call_comp')[0].value, 104.62, 'comp. llamada festivo');
});

test('complemento de llamada en laborable = 57,94 (art. 38)', () => {
    const r = calc(LUN, { shift: 'R1', activeConceptsCount: { comp_llamada: 1 } });
    near(item(r, 'call_comp')[0].value, 57.94, 'comp. llamada laborable');
});

test('3 complementos de llamada en festivo = 313,87 (nómina de junio 2026: 313,87)', () => {
    const r = calc(SAB, { shift: 'R7', activeConceptsCount: { comp_llamada: 3 } });
    near(item(r, 'call_comp')[0].value, 313.86, 'comp. llamada x3', 0.02);
});

test('no hay complemento de llamada si ese día se está de retén', () => {
    const r = calc(SAB, { shift: 'R7', isReten: true, activeConceptsCount: { comp_llamada: 1 } });
    assert.equal(item(r, 'call_comp').length, 0);
});

test('compatibilidad: tarifas guardadas en Firebase sin las claves nuevas siguen funcionando', () => {
    const viejas = { FOOD: 40.69, KM_PRICE: 0.55, P1_BASE: 32.90, P1_FRI: 46.74 };
    const r = calc(SAB, { shift: 'R7', activeConceptsCount: { comp_llamada: 1 } }, { globalRates: viejas });
    near(item(r, 'call_comp')[0].value, 104.62, 'comp. llamada con tarifas antiguas');
});

test('si el usuario edita la tarifa en Precios, se respeta', () => {
    const editadas = { ...DEFAULT_GLOBAL_CONST, COMP_LLAMADA_F: 110 };
    const r = calc(SAB, { shift: 'R7', activeConceptsCount: { comp_llamada: 1 } }, { globalRates: editadas });
    near(item(r, 'call_comp')[0].value, 110, 'comp. llamada editada');
});

test('plus de llamada = 79,40 por llamada (G V)', () => {
    const r = calc(SAB, { shift: 'R7', activeConceptsCount: { plus_llamada: 4 } });
    near(item(r, 'call_plus')[0].value, 317.60, 'plus llamada x4');
});

test('retén: 55,48 laborable y 111,20 festivo (G V)', () => {
    near(item(calc(LUN, { shift: 'R1', isReten: true }), 'reten')[0].value, 55.48, 'retén laborable');
    near(item(calc(SAB, { shift: 'R7', isReten: true }), 'reten')[0].value, 111.20, 'retén festivo');
});

test('multiplicadores de TRC por turno (Documento 7 del convenio)', () => {
    const trc = (shift, day) => item(calc(day, { shift, activeConceptsCount: { trc: 1 } }), 'trc')[0].value;
    near(trc('R7', LUN), 58.52 * 1.5, 'R7');
    near(trc('R9', LUN), 58.52 * 2.5, 'R9');
    near(trc('S1', LUN), 58.52 * 1, 'S1 laborable');
    near(trc('S1', SAB), 58.52 * 2, 'S1 festivo');
    near(trc('S5', LUN), 58.52 * 2, 'S5 laborable');
    near(trc('S5', SAB), 58.52 * 3, 'S5 festivo');
});

test('TRA: 2 pluses en laborable y 3 en festivo', () => {
    const tra = (day) => item(calc(day, { shift: 'R1', activeConceptsCount: { tra: 1 } }), 'tra')[0].value;
    near(tra(LUN), 22.24 * 2, 'TRA laborable');
    near(tra(SAB), 22.24 * 3, 'TRA festivo');
});

test('I7: 1 plus TRA por día trabajado, sin multiplicar (art. 31; nómina junio 2026: "TURNO ABIERTO 1 22,24")', () => {
    const tra = (day) => item(calc(day, { shift: 'I7', activeConceptsCount: { tra: 1 } }), 'tra')[0].value;
    near(tra(LUN), 22.24, 'I7 TRA laborable');
    near(tra(SAB), 22.24, 'I7 TRA festivo (sin multiplicar, a diferencia de R1/R3)');
});

test('el contador de Balance de TRA suma unidades ponderadas por el multiplicador, igual que TRC (para que x unidades × tarifa base cuadre con la nómina)', () => {
    const qty = (day, shift) => item(calc(day, { shift, activeConceptsCount: { tra: 1 } }), 'tra')[0].qty;
    assert.equal(qty(LUN, 'R1'), 2, 'R1 laborable: 1 unidad x2 = 2');
    assert.equal(qty(SAB, 'R1'), 3, 'R1 festivo: 1 unidad x3 = 3');
    assert.equal(qty(LUN, 'I7'), 1, 'I7: 1 unidad x1 = 1');
});

test('plus P1: 32,90 de lunes a jueves y 46,74 el viernes', () => {
    near(item(calc(LUN, { shift: 'P1' }), 'p1')[0].value, 32.90, 'P1 lunes');
    near(item(calc(VIE, { shift: 'P1' }), 'p1')[0].value, 46.74, 'P1 viernes');
});

test('kilometraje: km base x 0,55 + km extra', () => {
    near(item(calc(LUN, { shift: 'R1', activeConceptsCount: { comp_km: 1 }, extraKm: 0 }), 'km')[0].value, 46 * 0.55, 'km base');
    near(item(calc(LUN, { shift: 'R1', activeConceptsCount: { comp_km: 1 }, extraKm: 10 }), 'km')[0].value, 56 * 0.55, 'km base + extra');
});

test('comida: 40,69 por unidad', () => {
    near(item(calc(LUN, { shift: 'R7', activeConceptsCount: { comida: 1 } }), 'food')[0].value, 40.69, 'comida');
});

test('nocturnidad: horas x 8,89', () => {
    near(item(calc(LUN, { shift: 'S5', horasNocturnas: 8 }), 'night')[0].value, 8 * 8.89, 'nocturnidad');
});

test('horas extra: cobrar paga horas x 49,79', () => {
    near(item(calc(LUN, { shift: 'R1', extras: 2, extraCompMode: 'money' }), 'he')[0].value, 2 * 49.79, 'HE cobro');
});

test('horas extra: descansar da 1,75x en laborable y 2x en festivo', () => {
    const lab = calc(LUN, { shift: 'R1', extras: 2, extraCompMode: 'rest_total' });
    near(lab.restHours, 2 * 1.75, 'descanso laborable');
    const fes = calc(SAB, { shift: 'R1', extras: 2, extraCompMode: 'rest_total' });
    near(fes.restHours, 2 * 2.0, 'descanso festivo');
});

test('descanso compensatorio: trabajar domingo con el lunes laborable (jornada intensiva) suma 7,5 h', () => {
    const plan = { '2026-06-08': { base: 'intensiva', concepts: {} } };
    const r = calc(DOM, { shift: 'R1' }, { plan });
    near(r.restHours, 7.5, 'descanso domingo');
});

test('retención: el interruptor % Ret descuenta el porcentaje de los importes', () => {
    const profile = { ...PROFILE, retention: 32.22 };
    const r = calc(LUN, { shift: 'P1' }, { profile, isRetentionActive: true });
    near(item(r, 'p1')[0].value, 32.90 * (1 - 0.3222), 'P1 con retención');
});

test('un día de descanso (D) no genera importes', () => {
    const r = calc(SAB, { shift: 'D' });
    assert.equal(r.total, 0);
});

test('perfil por defecto de las pruebas es G V nivel 7', () => {
    assert.equal(PROFILE.group, 'G V');
});
