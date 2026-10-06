export function discountedTotal(amount, percent) {
  return Math.round(amount * (1 - percent / 100) * 100) / 100;
}
