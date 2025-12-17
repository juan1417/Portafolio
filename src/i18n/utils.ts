import en from './en.json';
import es from './es.json';

export const languages = {
  en,
  es
};

export type Language = keyof typeof languages;

export function getTranslations(lang: Language = 'en') {
  return languages[lang] || languages.en;
}
