export function roundMoney(value) {
  if (!Number.isFinite(value)) throw new TypeError('finite value required');
  const rounded = Math.round((Math.abs(value) + Number.EPSILON) * 100) / 100;
  return value < 0 && rounded !== 0 ? -rounded : rounded;
}
