const path = require("path")

global.XMLHttpRequest = require("xhr2").XMLHttpRequest

module.exports.createPages = ({graphql, actions}) => {
  const {createPage} = actions
  return new Promise((resolve, reject) => {
    resolve(
      graphql(`
        {
          activities: allStravaActivity(
            filter: {activity: {map: {summary_polyline: {ne: null}}}}
            sort: {fields: [activity___start_date], order: DESC}
          ) {
            edges {
              node {
                activity {
                  id
                  map {
                    summary_polyline
                  }
                }
              }
            }
          }
        }
      `).then(result => {
        if (result.errors) {
          reject(new Error(result.errors[0].message))
        } else {
          const {activities} = result.data

          if (activities && activities.edges.length > 0) {
            activities.edges.forEach(({node}) => {
              createPage({
                path: `/activity/${node.activity.id}`,
                component: path.resolve("./src/templates/activity/index.js"),
                context: {
                  id: parseInt(node.activity.id),
                },
              })
            })
          }
        }
      })
    )
  })
}

// Remove eslint warnings from symlinked modules
module.exports.onCreateWebpackConfig = ({actions}) => {
  actions.setWebpackConfig({
    resolve: {
      symlinks: false,
      modules: [path.resolve("node_modules")],
    },
  })
}
