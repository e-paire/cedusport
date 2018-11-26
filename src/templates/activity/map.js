import React from "react"
import MapGL, {Marker, SVGOverlay, NavigationControl} from "react-map-gl"
import WebMercatorViewport from "viewport-mercator-project"
import {Box, Input, Flex} from "reakit"
import {FiCircle, FiMaximize} from "react-icons/fi"

import theme from "~/utils/theme"

class Map extends React.PureComponent {
  constructor(props) {
    super()

    const viewport = {
      dragPan: false,
      scrollZoom: false,
      transitionDuration: 200,
      width: props.width,
      height: props.height,
    }

    const minLat = props.latlng.reduce(
      (min, [lat, lng]) => (lat < min ? lat : min),
      props.latlng[0][0]
    )

    const maxLat = props.latlng.reduce(
      (max, [lat, lng]) => (lat > max ? lat : max),
      props.latlng[0][0]
    )

    const minLng = props.latlng.reduce(
      (min, [lat, lng]) => (lng < min ? lng : min),
      props.latlng[0][1]
    )

    const maxLng = props.latlng.reduce(
      (max, [lat, lng]) => (lng > max ? lng : max),
      props.latlng[0][1]
    )

    const {longitude, latitude, zoom} = new WebMercatorViewport(
      viewport
    ).fitBounds([[minLng, minLat], [maxLng, maxLat]], {
      padding: 30,
    })

    this.bounds = {
      latitude,
      longitude,
      zoom,
    }
    this.state = {
      activeIndex: null,
      viewport: {
        ...viewport,
        latitude,
        longitude,
        zoom,
      },
    }
  }

  static getDerivedStateFromProps(props, state) {
    if (props.width !== state.viewport.width) {
      return {
        viewport: {
          ...state.viewport,
          width: props.width,
        },
      }
    }

    return null
  }

  fitBounds = () => {
    const {viewport} = this.state

    this.setState({
      viewport: {
        ...viewport,
        longitude: this.bounds.longitude,
        latitude: this.bounds.latitude,
        zoom: this.bounds.zoom,
      },
    })
  }

  redrawSVGOverlay = ({project}) => {
    const {latlng} = this.props
    const points = latlng.map(p => [p[1], p[0]]).map(project)
    return (
      <path
        stroke={theme.palette.primary}
        fill="none"
        strokeWidth={2}
        d={`M${points.join("L")}`}
      />
    )
  }

  handleRangeChange = index => {
    const {latlng, onRangeChange} = this.props
    const {viewport} = this.state

    if (!latlng[index]) {
      console.log(index)
    }
    this.setState({
      viewport: index
        ? {
            ...viewport,
            latitude: latlng[index][0],
            longitude: latlng[index][1],
          }
        : viewport,
    })

    if (onRangeChange) {
      onRangeChange(index)
    }
  }

  handleViewportChange = viewport => {
    this.setState({viewport})
  }

  render() {
    const {viewport} = this.state
    const {activeIndex, latlng} = this.props
    const percent = (activeIndex * 100) / latlng.length

    return (
      <Box>
        <MapGL
          doubleClickZoom={true}
          dragPan={true}
          dragRotate={true}
          keyboard={true}
          mapboxApiAccessToken={process.env.GATSBY_MAPBOX_TOKEN}
          mapStyle="mapbox://styles/xuopled/cjm8ybix98fu82ss1ovmll6i4"
          onViewportChange={this.handleViewportChange}
          scrollZoom={true}
          touchRotate={true}
          touchZoom={true}
          {...viewport}
        >
          <Box relative>
            <SVGOverlay redraw={this.redrawSVGOverlay} />
            <Marker
              latitude={latlng[latlng.length - 1][0]}
              longitude={latlng[latlng.length - 1][1]}
              offsetLeft={-8}
              offsetTop={-8}
            >
              <FiCircle fill="red" stroke="#fff" />
            </Marker>
            <Marker
              latitude={latlng[0][0]}
              longitude={latlng[0][1]}
              offsetLeft={-8}
              offsetTop={-8}
            >
              <FiCircle fill="green" stroke="#fff" />
            </Marker>
            {activeIndex && (
              <Marker
                latitude={latlng[activeIndex][0]}
                longitude={latlng[activeIndex][1]}
                offsetLeft={-8}
                offsetTop={-8}
              >
                <Flex>
                  <FiCircle fill={theme.palette.primary} stroke="#fff" />
                </Flex>
              </Marker>
            )}
            <Box absolute top="10px" left="10px">
              <NavigationControl onViewportChange={this.handleViewportChange} />
            </Box>
          </Box>
        </MapGL>
        <Flex
          p={3}
          height="50px"
          alignItems="center"
          background="#fff"
          borderTop={`1px solid ${theme.palette.gray[1]}`}
        >
          <Flex>
            <FiCircle
              fill="green"
              stroke="#fff"
              onClick={() => this.handleRangeChange(0)}
              cursor="pointer"
            />
          </Flex>
          <Flex flex="1" px={2}>
            <Input
              value={activeIndex || 0}
              type="range"
              min="0"
              max={latlng.length - 1}
              onChange={e => this.handleRangeChange(e.target.value)}
              backgroundSize={`${percent}% 100%`}
            />
          </Flex>
          <FiCircle
            fill="red"
            stroke="#fff"
            onClick={() => this.handleRangeChange(latlng.length - 1)}
            cursor="pointer"
          />
          <Flex ml={2}>
            <FiMaximize
              onClick={() => {
                this.handleRangeChange(null)
                this.fitBounds()
              }}
              cursor="pointer"
            />
          </Flex>
        </Flex>
      </Box>
    )
  }
}

export default Map
