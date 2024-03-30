export function round(value = 0, decimals = 2) {
  return Number(Math.round(Number(value + "e" + decimals)) + "e-" + decimals);
}

export function formatNumber(
  value: number | bigint,
  options?: {
    notation?: "standard" | "compact";
    decimals?: number;
  }
) {
  return new Intl.NumberFormat("ro-MD", {
    notation: options?.notation,
    minimumFractionDigits: options?.decimals,
    maximumFractionDigits: options?.decimals,
    localeMatcher: "lookup",
  })
    .format(value)
    .replaceAll(".", " ")
    .replaceAll(",", ".");
}
