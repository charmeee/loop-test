import test from 'node:test';
import assert from 'node:assert/strict';
import { quoteStatistics } from '../src/statistics.mjs';
test('statistics calculates count total and average', () => assert.deepEqual(quoteStatistics([10,20,30]),{count:3,total:60,average:20}));
test('statistics handles empty input', () => assert.deepEqual(quoteStatistics([]),{count:0,total:0,average:0}));
test('statistics rejects non-finite values', () => assert.throws(() => quoteStatistics([10,NaN]), TypeError));
