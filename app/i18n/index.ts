import en from "./lang_en.json";
import oz from "./lang_oz.json";
import ru from "./lang_ru.json";
import uz from "./lang_uz.json";

export const LANGUAGES = ["uz", "oz", "ru", "en"] as const;

export type LanguageCode = (typeof LANGUAGES)[number];

export type Translations = Record<string, string>;

export const TRANSLATIONS: Record<LanguageCode, Translations> = {
  uz,
  oz,
  ru,
  en,
};

export const DEFAULT_LANGUAGE: LanguageCode = "uz";

