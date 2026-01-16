export function roundToThreeDecimals(value: number, decimals = 3) {
  const p = 10 ** decimals;
  return Math.round(value * p) / p;
} //소수점 세자리는 대략 100m 이내의 오차를 의미
