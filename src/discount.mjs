export function discountedTotal(amount, percent) {
  if (!Number.isFinite(amount) || amount < 0 || !Number.isFinite(percent) || percent < 0 || percent > 100) {
    throw new RangeError('non-negative finite amount and percent between 0 and 100 required');
  }
  return Math.round(amount * (1 - percent / 100) * 100) / 100;
}
