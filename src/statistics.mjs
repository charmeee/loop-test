export function quoteStatistics(values) {
  if (!values.every(Number.isFinite)) throw new TypeError('finite values required');
  const total = values.reduce((a,b) => a+b, 0);
  return { count: values.length, total, average: values.length === 0 ? 0 : total / values.length };
}
