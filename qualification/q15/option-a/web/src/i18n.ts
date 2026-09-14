import catalog from "../../../shared/fixtures/locales.json";
import type { Locale } from "./types";

export const messages = catalog as Record<Locale, Record<string, string>>;
export type MessageKey = keyof (typeof catalog)["en"];

export const t = (locale: Locale, key: MessageKey): string =>
  messages[locale]?.[key] ?? messages.en[key] ?? key;
