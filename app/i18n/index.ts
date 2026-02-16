import en from "./lang_en.json";
import ko from "./lang_ko.json";
import ru from "./lang_ru.json";
import uz from "./lang_uz.json";

export const LANGUAGES = ["uz", "en", "ru", "ko"] as const;

export type LanguageCode = (typeof LANGUAGES)[number];

export type Translations = Record<string, string>;

export const TRANSLATIONS: Record<LanguageCode, Translations> = {
  uz,
  en,
  ru,
  ko,
};

export const DEFAULT_LANGUAGE: LanguageCode = "uz";

