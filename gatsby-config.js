const path = require("path")

require("dotenv").config({
  path: `.env`,
})

module.exports = {
  siteMetadata: {
    title: "Ced in Sport",
  },
  plugins: [
    {
      resolve: "gatsby-plugin-netlify-cache",
      options: {
        extraDirsToCache: [".strava"],
      },
    },
    {
      resolve: "gatsby-plugin-root-import",
      options: {
        "~": path.join(__dirname, "src"),
      },
    },
    {
      resolve: `gatsby-plugin-styled-components`,
      options: {
        displayName: true,
        fileName: false,
      },
    },
    {
      resolve: "gatsby-plugin-google-fonts",
      options: {
        fonts: ["Quicksand"],
      },
    },
    {
      resolve: "gatsby-source-strava",
      options: {
        debug: process.env.GATSBY_SOURCE_STRAVA_DEBUG || false,
        activities: {
          after: process.env.GATSBY_SOURCE_STRAVA_AFTER || null,
          streamsTypes: [
            "time",
            "distance",
            "latlng",
            "heartrate",
            "velocity_smooth",
            "altitude",
          ],
          withComments: false,
          withKudos: true,
          withLaps: true,
          withPhotos: true,
          withRelated: false,
          withStreams: true,
          withZones: false,
          extend: ({activity}) => {
            activity.extendd = true
          },
        },
        athlete: {
          withKoms: false,
          withRoutes: false,
          withStats: true,
          withZones: false,
          extend: ({activities, athlete}) => {
            let heartrateMax
            activities.forEach(activity => {
              if (activity.has_heartrate) {
                if (!heartrateMax || activity.max_heartrate > heartrateMax) {
                  heartrateMax = activity.max_heartrate
                }
              }
            })

            athlete.heartrateMax = heartrateMax
          },
        },
      },
    },
    {
      resolve: `gatsby-source-filesystem`,
      options: {
        name: `locales`,
        path: `${__dirname}/src/locales/`,
      },
    },
    {
      resolve: "gatsby-plugin-copy-files",
      options: {
        source: `${__dirname}/src/locales`,
        destination: `/locales`,
      },
    },
    {
      resolve: "gatsby-transformer-remark",
      options: {
        plugins: [],
      },
    },
    "gatsby-plugin-slug",
  ],
}
