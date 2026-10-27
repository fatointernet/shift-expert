// Comprueba que el JSX de index.html compila con Babel (la misma versión que carga la web).
// Un error de sintaxis dejaría la web en blanco, así que esta prueba debe pasar siempre antes de subir cambios.

import test from 'node:test';
import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { html } from './helpers.mjs';

const require = createRequire(import.meta.url);
const Babel = require('@babel/standalone');

test('el bloque <script type="text/babel"> compila sin errores', () => {
    const m = html.match(/<script type="text\/babel"[^>]*>([\s\S]*?)<\/script>/);
    assert.ok(m, 'No se encontró el bloque <script type="text/babel"> en index.html');
    const out = Babel.transform(m[1], { presets: ['react'], sourceType: 'module' });
    assert.ok(out.code.length > 1000);
});

test('index.html conserva el DOCTYPE y el contenedor raíz', () => {
    assert.match(html, /^<!DOCTYPE html>/i);
    assert.match(html, /<div id="root"><\/div>/);
});
