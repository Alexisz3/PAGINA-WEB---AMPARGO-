/** Stable draft values; older translated drafts remain readable after deployment. */
export const QUOTE_SOURCES = ["Google", "Facebook", "Instagram", "Referral", "Previous", "Other"] as const;
export type QuoteSource = typeof QUOTE_SOURCES[number];

export function normalizeQuoteSource(value: string): string {
  const legacy: Record<string, QuoteSource> = {
    "Recomendación": "Referral", "Cliente anterior": "Previous",
    "Previous client": "Previous", "Otro": "Other",
  };
  return legacy[value] ?? value;
}

export function quoteSourceKey(value: string): QuoteSource | null {
  const normalized = normalizeQuoteSource(value);
  return QUOTE_SOURCES.find((source) => source === normalized) ?? null;
}
