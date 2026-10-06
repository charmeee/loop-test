export function quoteStatistics(values) {
  const total = values.reduce((a,b) => a+b, 0);
  return { count: values.length, total, average: total / values.length };
}
