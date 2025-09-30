import i18n from "i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Backend from "i18next-http-backend";
import { initReactI18next } from "react-i18next";

// NOTE: We store one JSON per language at /public/locales/{lng}.json (no namespace folders)
// Adjust backend loadPath accordingly so keys like "header.disconnect" resolve properly.
i18n
  .use(Backend)
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    fallbackLng: "en",
    debug: process.env.NODE_ENV === "development",
    defaultNS: "translation",
    ns: ["translation"],
    detection: {
      order: [
        "querystring",
        "cookie",
        "localStorage",
        "sessionStorage",
        "navigator",
        "htmlTag",
        "path",
        "subdomain",
      ],
      caches: ["cookie", "localStorage"],
      cookieMinutes: 60 * 24 * 365, // one year
    },
    interpolation: {
      escapeValue: false,
    },
    backend: {
      loadPath: "/locales/{{lng}}.json",
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
