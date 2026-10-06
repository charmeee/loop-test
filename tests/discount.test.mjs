import test from 'node:test';
import assert from 'node:assert/strict';
import { discountedTotal } from '../src/discount.mjs';
test('discount computes total', () => assert.equal(discountedTotal(200, 25), 150));
test('discount rejects invalid inputs', () => {
  for (const args of [[100,101],[100,-1],[-1,20],[Infinity,10],[100,NaN]]) assert.throws(() => discountedTotal(...args), RangeError);
});
test('discount supports full and zero discount', () => { assert.equal(discountedTotal(100,100),0); assert.equal(discountedTotal(100,0),100); });
