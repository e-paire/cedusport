const {renderToString} = require("react-dom/server")
const React = require("react")
const SyncFsBackend = require("i18next-sync-fs-backend")

global.XMLHttpRequest = require("xhr2").XMLHttpRequest

const i18n = require("./src/utils/i18n")

module.exports.replaceRenderer = ({bodyComponent, replaceBodyHTMLString}) => {
  i18n.use(SyncFsBackend).init({
    initImmediate: false,
    backend: {
      loadPath: "src/locales/{{lng}}/{{ns}}.json",
    },
  })
  // .loadNamespaces(["app", "index", "activity", "sidebar"], () => {
  //   replaceBodyHTMLString(renderToString(bodyComponent))
  // })
}
