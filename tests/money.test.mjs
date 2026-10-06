import test from 'node:test';
import assert from 'node:assert/strict';
import { roundMoney } from '../src/money.mjs';
test('rounds decimal half-cent values away from zero', () => {
  for (const [input, expected] of [[1.005,1.01],[2.675,2.68],[-1.005,-1.01],[-2.675,-2.68],[0,0]]) assert.equal(roundMoney(input),expected);
});
