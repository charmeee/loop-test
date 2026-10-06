export function roundMoney(value) {
  if (!Number.isFinite(value)) throw new TypeError('finite value required');

  // Round the number's decimal representation with exact integer arithmetic.
  const [mantissa, exponent = '0'] = Math.abs(value).toString().split('e');
  const [whole, fraction = ''] = mantissa.split('.');
  const coefficient = BigInt(whole + fraction);
  const shift = Number(exponent) - fraction.length + 2;
  let cents;
  if (shift >= 0) {
    cents = coefficient * 10n ** BigInt(shift);
  } else {
    const divisor = 10n ** BigInt(-shift);
    cents = coefficient / divisor;
    if ((coefficient % divisor) * 2n >= divisor) cents += 1n;
  }

  // Parse at the final scale so large finite values do not overflow in cents.
  const rounded = Number(`${cents}e-2`);
  return value < 0 && rounded !== 0 ? -rounded : rounded;
}
