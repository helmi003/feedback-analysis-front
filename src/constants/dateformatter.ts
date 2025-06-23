import { createIntl, createIntlCache } from "react-intl";

const cache = createIntlCache();

export const intl = createIntl(
  {
    locale: 'en',
    messages: {},
  },
  cache,
);

export function formatDateTimeString(
  value: Date | string | number,
  options: Intl.DateTimeFormatOptions = {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
  },
) {
  return intl.formatDate(new Date(value), options);
}