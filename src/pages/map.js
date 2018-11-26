import polyline from "@mapbox/polyline"
import cityReverseGeocoder from "city-reverse-geocoder"
import DeckGL, {GeoJsonLayer} from "deck.gl"
import {graphql} from "gatsby"
import React from "react"
import {FlyToInterpolator, StaticMap} from "react-map-gl"
import {Inline, Box, Flex} from "reakit"
import {Trans} from "react-i18next"

import Select from "~/components/select"
import Layout from "~/layouts/index"
import theme from "~/utils/theme"
import {getRgbFromHex} from "~/utils/colors"

import "mapbox-gl/dist/mapbox-gl.css"

const sortByPopularity = (a, b) => b.count - a.count

const CountrySelect = ({t, onChange, value, countries}) => (
  <Select onChange={e => onChange(e.target.value)} value={value}>
    {countries.map(country => (
      <option key={country.name} value={country.name}>{`${country.name} (${
        country.count
      })`}</option>
    ))}
  </Select>
)

const CitySelect = ({t, onChange, value, cities}) => (
  <Select onChange={e => onChange(e.target.value)} value={value}>
    {cities.map(city => (
      <option key={city.name} value={city.name}>{`${city.name} (${
        city.count
      })`}</option>
    ))}
  </Select>
)

class HeatmapPage extends React.Component {
  constructor(props) {
    super()

    const viewState = {}
    const cities = {}
    const countries = {}

    if (typeof window !== "undefined") {
      const width = window.innerWidth
      const height = window.innerHeight
      const activities = props.data.activities.edges

      activities.forEach(({node: {activity}}) => {
        const nearestCities = cityReverseGeocoder(
          activity.start_latlng[0],
          activity.start_latlng[1]
        )

        const {city, country, latitude, longitude} = nearestCities[0]
        if (!cities[city]) {
          cities[city] = {name: city, country, latitude, longitude, count: 0}
        }

        if (!countries[country]) {
          countries[country] = {name: country, count: 0}
        }

        cities[city].count++
        countries[country].count++
      })

      const city = Object.values(cities)
        .sort(sortByPopularity)
        .shift()
      const country = Object.values(countries)
        .sort(sortByPopularity)
        .shift()

      this.state = {
        viewState: {
          ...viewState,
          width,
          height,
          latitude: city.latitude,
          longitude: city.longitude,
          zoom: 11.99,
        },
        cities,
        countries,
        country: country.name,
        city: city.name,
      }
    } else {
      this.state = {cities, countries, viewState}
    }
  }

  renderLayers = () => {
    const {
      data: {activities},
    } = this.props
    const data = {
      type: "FeatureCollection",
      features: activities.edges.map(({node: {activity}}) => ({
        type: "Feature",
        geometry: polyline.toGeoJSON(activity.map.summary_polyline),
      })),
    }

    return new GeoJsonLayer({
      data,
      getLineColor: f => getRgbFromHex(theme.palette.primary),
      opacity: 0.1,
      lineWidthMinPixels: 1,
    })
  }

  handleViewStateChange = ({viewState}) => {
    this.setState({viewState})
  }

  handleCityChange = value => {
    const {viewState, cities} = this.state
    const city = cities[value]

    this.setState({
      city: city.name,
      viewState: {
        ...viewState,
        longitude: city.longitude,
        latitude: city.latitude,
        transitionDuration: 2000,
        transitionInterpolator: new FlyToInterpolator(),
      },
    })
  }

  handleCountryChange = country => {
    const {viewState, cities} = this.state
    const city = Object.values(cities)
      .filter(city => city.country === country)
      .sort(sortByPopularity)
      .shift()

    this.setState({
      country,
      city: city.name,
      viewState: {
        ...viewState,
        longitude: city.longitude,
        latitude: city.latitude,
        transitionDuration: 2000,
        transitionInterpolator: new FlyToInterpolator(),
      },
    })
  }

  render() {
    const {viewState, countries, country, cities, city} = this.state
    return (
      <Layout>
        <Flex
          alignItems="center"
          justifyContent="center"
          fontSize={25}
          backgroundColor={theme.palette.gray[0]}
          p={2}
          borderBottom={`2px solid ${theme.palette.primary}`}
        >
          <Inline>
            <Trans i18nKey="map.description">
              Activities in
              <CountrySelect
                onChange={this.handleCountryChange}
                value={country}
                countries={Object.values(countries).sort(sortByPopularity)}
              />
              near
              <CitySelect
                onChange={this.handleCityChange}
                value={city}
                cities={Object.values(cities)
                  .filter(city => city.country === country)
                  .sort(sortByPopularity)}
              />
            </Trans>
          </Inline>
        </Flex>
        <Box minHeight="inherit" relative>
          <DeckGL
            layers={this.renderLayers()}
            controller={true}
            viewState={viewState}
            onViewStateChange={this.handleViewStateChange}
          >
            <StaticMap
              mapboxApiAccessToken={process.env.GATSBY_MAPBOX_TOKEN}
              mapStyle="mapbox://styles/xuopled/cjm8ybix98fu82ss1ovmll6i4"
              reuseMaps
              preventStyleDiffing={true}
            />
          </DeckGL>
        </Box>
      </Layout>
    )
  }
}

export default HeatmapPage

export const pageQuery = graphql`
  {
    activities: allStravaActivity(
      filter: {activity: {map: {summary_polyline: {ne: null}}}}
    ) {
      edges {
        node {
          activity {
            id
            type
            start_latlng
            map {
              summary_polyline
            }
          }
        }
      }
    }
  }
`
