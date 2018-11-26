const format = require("date-fns/format")
const frLocale = require("date-fns/locale/fr")
const enLocale = require("date-fns/locale/en")
const i18n = require("i18next")
const XHRBackend = require("i18next-xhr-backend")
const LanguageDetector = require("i18next-browser-languagedetector")
const {reactI18nextModule} = require("react-i18next")

const {
  metersToKilometers,
  metersPerSecondToMinPerKm,
  metersPerSecondTokmPerHour,
} = require("./convertors")
const {secondsToString} = require("./formattors")

i18n
  .use(XHRBackend)
  .use(LanguageDetector)
  .use(reactI18nextModule)
  .init({
    debug: process.env.NODE_ENV === "development" ? true : false,
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
      format: function(value, formatting, lng) {
        if (value instanceof Date) {
          return format(value, formatting, {
            locale: lng === "fr" ? frLocale : enLocale,
          })
        } else if (formatting === "km") {
          return metersToKilometers(value)
        } else if (formatting === "kmPerHour") {
          return metersPerSecondTokmPerHour(value)
        } else if (formatting === "minPerKm") {
          return metersPerSecondToMinPerKm(value)
        } else if (formatting === "hourMinSecond") {
          return secondsToString(value)
        }
        return value
      },
    },
    react: {
      wait: false,
    },
  })

module.exports = i18n
