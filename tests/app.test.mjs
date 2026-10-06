import test from 'node:test';
import assert from 'node:assert/strict';
import { roundMoney } from '../src/money.mjs';
test('money rounds ordinary values', () => { assert.equal(roundMoney(12.345), 12.35); });
test('money rejects non-finite values', () => { assert.throws(() => roundMoney(Infinity), TypeError); });
