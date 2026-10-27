// Utilidades de prueba para ShiftExpert.
//
// La app es un único index.html con React + Babel en el navegador, así que no se puede importar.
// Estas utilidades extraen del propio index.html el código REAL de cálculo (tablas, constantes,
// getPlanConcepts, rates y calcDay) y lo ejecutan en Node. Así las pruebas validan lo que se publica,
// no una copia. Si se cambian los marcadores de abajo en index.html, las pruebas fallan con un
// mensaje claro y hay que actualizar este archivo.

import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
export const INDEX_PATH = join(here, '..', 'index.html');
export const html = readFileSync(INDEX_PATH, 'utf8');

function between(startMarker, endMarker, { includeEnd = false } = {}) {
    const s = html.indexOf(startMarker);
    if (s < 0) throw new Error(`Marcador de inicio no encontrado en index.html: ${startMarker}`);
    const e = html.indexOf(endMarker, s);
    if (e < 0) throw new Error(`Marcador de fin no encontrado en index.html: ${endMarker}`);
    return html.slice(s, includeEnd ? e + endMarker.length : e);
}

const salarySrc = between('const DEFAULT_SALARY_DATA = {', 'const DEFAULT_GLOBAL_CONST');
const globalConstSrc = between('const DEFAULT_GLOBAL_CONST = {', 'const GLOBAL_LABELS');
const toISOSrc = between('const toISO = ', '\n');
const getPlanConceptsSrc = between('const getPlanConcepts = (planDay) => {', 'const calcDay = useCallback(');
const ratesMemoSrc = between('const rates = useMemo(() => {', '}, [profile, salaryMatrix]);', { includeEnd: true });
const calcDaySrc = between('const calcDay = useCallback(', '}, [rates, globalRates, profile.kmCount, profile.retention, isRetentionActive]);', { includeEnd: true });

const factory = new Function(`
    ${salarySrc}
    ${globalConstSrc}
    ${toISOSrc}
    const useMemo = (fn) => fn();
    const useCallback = (fn) => fn;
    const makeApp = ({ profile, globalRates, salaryMatrix = DEFAULT_SALARY_DATA, isRetentionActive = false }) => {
        ${ratesMemoSrc}
        ${getPlanConceptsSrc}
        ${calcDaySrc}
        return { calcDay, rates };
    };
    return { DEFAULT_SALARY_DATA, DEFAULT_GLOBAL_CONST, toISO, makeApp };
`);

export const { DEFAULT_SALARY_DATA, DEFAULT_GLOBAL_CONST, toISO, makeApp } = factory();

// Perfil por defecto de las pruebas: Grupo V, nivel 7, 46 km base, sin retención.
export const PROFILE = { group: 'G V', level: '7', kmCount: 46, retention: 0 };

export function calc(dateStr, data, { plan = {}, shifts = {}, profile = PROFILE, globalRates = DEFAULT_GLOBAL_CONST, isRetentionActive = false } = {}) {
    const { calcDay } = makeApp({ profile, globalRates, isRetentionActive });
    return calcDay(dateStr, data, plan, shifts);
}

export const item = (result, type) => result.items.filter(i => i.type === type);
