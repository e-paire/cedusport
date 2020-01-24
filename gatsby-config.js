const path = require("path")

// if (process.env.NODE_ENV === "development") {
require("dotenv").config({
  path: `.env`,
})
// }

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
        debug: true,
        config: {
          clientId: process.env.GATSBY_STRAVA_CLIENT_ID,
          clientSecret: process.env.GATSBY_STRAVA_CLIENT_SECRET,
        },
        activitiesOptions: {
          cacheDir: `${__dirname}/.strava`,
          after: process.env.GATSBY_STRAVA_AFTER || null,
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
        },
        athleteOptions: {
          computeHeartrateMax: true,
          withKoms: false,
          withRoutes: false,
          withStats: true,
          withZones: false,
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
