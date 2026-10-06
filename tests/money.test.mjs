import test from 'node:test';
import assert from 'node:assert/strict';
import { roundMoney } from '../src/money.mjs';
test('rounds decimal half-cent values away from zero', () => {
  for (const [input, expected] of [[1.005,1.01],[2.675,2.68],[-1.005,-1.01],[-2.675,-2.68],[0,0]]) assert.equal(roundMoney(input),expected);
});
test('checker-discovered decimal ties stay fixed', () => {
  for (const [input, expected] of [[10.075,10.08],[-10.075,-10.08],[4.015,4.02],[-4.015,-4.02],[0.005,0.01],[-0.005,-0.01]]) assert.equal(roundMoney(input),expected);
});
test('rounding supports scientific notation and finite extremes', () => {
  for (const input of [1e-7,-1e-7,Number.MIN_VALUE,-Number.MIN_VALUE,-0]) assert.equal(roundMoney(input),0);
  for (const input of [1e21,-1e21,Number.MAX_VALUE,-Number.MAX_VALUE]) assert.equal(roundMoney(input),input);
});
