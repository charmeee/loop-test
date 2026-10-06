export function roundMoney(value) {
  if (!Number.isFinite(value)) throw new TypeError('finite value required');
  return Math.round(value * 100 + Number.EPSILON) / 100;
}
