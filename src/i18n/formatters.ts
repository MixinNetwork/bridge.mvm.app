import type { FormattersInitializer } from 'typesafe-i18n';
import type { Locales, Formatters } from './i18n-types';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const initFormatters: FormattersInitializer<Locales, Formatters> = (locale: Locales) => {
	const formatters: Formatters = {};

	return formatters;
};
