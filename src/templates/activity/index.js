import {graphql} from "gatsby"
import React from "react"
import styled from "styled-components"
import {ifProp, palette} from "styled-tools"
import {Inline, Flex, Grid, Heading, Table} from "reakit"
import Measure from "react-measure"
import format from "date-fns/format"
import frLocale from "date-fns/locale/fr"

import Layout from "~/layouts/index"

import Map from "./map"

import {getAnalyzedPaces, getAnalyzedHeartRates} from "~/utils/activity"
import {
  metersToKilometers,
  metersPerSecondToMinPerKm as mpsToMpk,
  metersPerSecondTokmPerHour as mpsToKph,
  hrssToHrssPerHour,
} from "~/utils/convertors"
import {secondsToString, secondsToHms} from "~/utils/formattors"
import theme from "~/utils/theme"

const Overview = styled(Grid)`
  @media ${theme.device.mobile} {
    display: block;

    & > ${Grid.Item}:first-child {
      height: 400px;
    }
  }

  @media ${theme.device.laptop} {
    display: grid;
    grid-template-areas: "map date duration distance" "map pace speed alt" ${ifProp(
        {hasHeartrate: true},
        '"map heartrate stress trimp"',
        ""
      )};
    grid-template-rows: 140px 140px ${ifProp({hasHeartrate: true}, "140px", "")};
    grid-template-columns: 3fr 1fr 1fr 1fr;
  }
`

const Stats = styled(Grid)`
  @media ${theme.device.mobile} {
    grid-auto-columns: 1fr;
  }

  @media ${theme.device.laptop} {
    grid-template-columns: ${ifProp(
      {hasHeartrate: true},
      "2fr 1fr 1fr",
      "1fr 1fr"
    )};
    grid-template-autorows: auto;
  }
`

const Item = styled(Flex)`
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  padding: 10px;
  &:nth-child(odd) {
    background: ${palette("gray")};
  }
  &:nth-child(even) {
    background: #fff;
  }
`

const Label = styled(Inline)`
  font-size: 20px;
`

const Data = styled(Inline)`
  font-size: 60px;
`

class Activity extends React.PureComponent {
  state = {
    activeIndex: null,
    mapSize: null,
  }

  handleRangeChange = activeIndex => {
    this.setState({activeIndex})
  }

  renderMap() {
    const {activeIndex, mapSize} = this.state
    const {
      data: {
        stravaActivity: {activity},
      },
    } = this.props
    return (
      <>
        <Measure
          bounds
          onResize={({bounds}) => {
            if (bounds) {
              this.setState({
                mapSize: bounds,
              })
            }
          }}
        >
          {({measureRef}) => (
            <div
              ref={measureRef}
              style={{width: "100%", height: "calc(100% - 50px)"}}
            >
              {mapSize && (
                <Map
                  activeIndex={activeIndex}
                  onRangeChange={this.handleRangeChange}
                  latlng={activity.streams.latlng}
                  width={mapSize.width}
                  height={mapSize.height}
                />
              )}
            </div>
          )}
        </Measure>
      </>
    )
  }

  renderDuration() {
    const {activeIndex} = this.state
    const {
      data: {
        stravaActivity: {activity},
      },
    } = this.props
    const timeObject = secondsToHms(
      activeIndex ? activity.streams.time[activeIndex] : activity.elapsed_time
    )
    return (
      <>
        <Label>{activeIndex ? "active time" : "Duration"}</Label>
        <Label>
          {timeObject.h > 0 && (
            <>
              <Data>{timeObject.h}</Data>
              <Label>h</Label>
            </>
          )}
          {timeObject.m > 0 && (
            <>
              <Data>{timeObject.m}</Data>
              <Label>m</Label>
            </>
          )}
          <Data>{timeObject.s}</Data>
          <Label>s</Label>
        </Label>
      </>
    )
  }

  renderDistance() {
    const {activeIndex} = this.state
    const {
      data: {
        stravaActivity: {activity},
      },
    } = this.props
    return (
      <>
        <Label>{activeIndex ? "active distance" : "total distance"}</Label>
        <Label>
          <Data>
            {activeIndex
              ? metersToKilometers(activity.streams.distance[activeIndex])
              : metersToKilometers(activity.distance)}
          </Data>
          {"km"}
        </Label>
      </>
    )
  }

  renderHeartrate() {
    const {activeIndex} = this.state
    const {
      data: {
        stravaActivity: {activity},
      },
    } = this.props
    return (
      <>
        <Label>
          {activeIndex ? "active heart beat" : "average heart beat"}
        </Label>
        <Label>
          <Data>
            {activeIndex
              ? Math.round(activity.streams.heartrate[activeIndex])
              : Math.round(activity.average_heartrate)}
          </Data>
          {"bpm"}
        </Label>
      </>
    )
  }

  renderPace() {
    const {activeIndex} = this.state
    const {
      data: {
        stravaActivity: {activity},
      },
    } = this.props
    return (
      <>
        <Label>{activeIndex ? "active pace" : "average pace"}</Label>
        <Label>
          <Data>
            {activeIndex
              ? mpsToMpk(activity.streams.velocity_smooth[activeIndex])
              : mpsToMpk(activity.average_speed)}
          </Data>
          {"min/km"}
        </Label>
      </>
    )
  }

  renderDate() {
    const {activeIndex} = this.state
    const {
      data: {
        stravaActivity: {activity},
      },
    } = this.props
    const date = new Date(activity.start_date)

    if (activeIndex) {
      date.setSeconds(date.getSeconds() + Number.parseInt(activeIndex))
    }

    return (
      <>
        <Label>
          {format(new Date(activity.start_date), "DD MMMM YYYY", {
            locale: frLocale,
          })}
        </Label>
        <Label>
          <Data>{date.getHours()}</Data>
          <Label>h</Label>
          <Data>{date.getMinutes()}</Data>
          <Label>m</Label>
          <Data>{date.getSeconds()}</Data>
          <Label>s</Label>
        </Label>
      </>
    )
  }

  renderAltitude() {
    const {activeIndex} = this.state
    const {
      data: {
        stravaActivity: {activity},
      },
    } = this.props
    return (
      <>
        <Label>{activeIndex ? "active alt" : "Dénivellé"}</Label>
        <Label>
          <Data>
            {activeIndex
              ? Math.round(activity.streams.altitude[activeIndex])
              : Math.round(
                  activity.laps.reduce(
                    (acc, lap) => acc + lap.total_elevation_gain,
                    0
                  )
                )}
          </Data>
        </Label>
      </>
    )
  }

  renderSpeed() {
    const {activeIndex} = this.state
    const {
      data: {
        stravaActivity: {activity},
      },
    } = this.props
    return (
      <>
        <Label>{activeIndex ? "Active speed" : "Average speed"}</Label>
        <Label>
          <Data>
            {activeIndex
              ? mpsToKph(activity.streams.velocity_smooth[activeIndex])
              : mpsToKph(activity.average_speed)}
          </Data>
          {"km/h"}
        </Label>
      </>
    )
  }

  render() {
    const {
      data: {
        stravaActivity: {activity},
      },
    } = this.props

    const {heartrate: hrArray, velocity_smooth: pacesArray} = activity.streams
    const analyzedPaces = getAnalyzedPaces(pacesArray)
    const {
      heartRates: analyzedHR,
      heartRateStressScore,
      trainingImpulse,
    } = activity.has_heartrate ? getAnalyzedHeartRates(hrArray) : {}
    return (
      <Layout>
        <Heading use="h1" textAlign="center">
          {`${activity.name}`}
        </Heading>
        <Grid
          gap={1}
          background={theme.palette.gray[1]}
          borderTop={`3px solid ${theme.palette.primary}`}
          use={Overview}
          hasHeartrate={activity.has_heartrate}
        >
          <Grid.Item area="map">{this.renderMap()}</Grid.Item>
          <Grid.Item area="date" use={Item}>
            {this.renderDate()}
          </Grid.Item>
          <Grid.Item area="duration" use={Item}>
            {this.renderDuration()}
          </Grid.Item>
          <Grid.Item area="distance" use={Item}>
            {this.renderDistance()}
          </Grid.Item>
          <Grid.Item area="pace" use={Item}>
            {this.renderPace()}
          </Grid.Item>
          <Grid.Item area="speed" use={Item}>
            {this.renderSpeed()}
          </Grid.Item>
          <Grid.Item area="alt" use={Item}>
            {this.renderAltitude()}
          </Grid.Item>
          {activity.has_heartrate && (
            <>
              <Grid.Item area="heartrate" use={Item}>
                {this.renderHeartrate()}
              </Grid.Item>
              <Grid.Item area="stress" use={Item}>
                <Label>Stress score / per h</Label>
                <Label>
                  <Data>{heartRateStressScore}</Data>
                  {" / "}
                  <Data>
                    {hrssToHrssPerHour(
                      heartRateStressScore,
                      activity.elapsed_time
                    )}
                  </Data>
                </Label>
              </Grid.Item>
              <Grid.Item area="trimp" use={Item}>
                <Label>Training impulse</Label>
                <Data>{trainingImpulse}</Data>
              </Grid.Item>
            </>
          )}
        </Grid>
        <Grid
          use={Stats}
          borderTop={`3px solid #fc4c02`}
          gap={1}
          background={theme.palette.gray[1]}
          hasHeartrate={activity.has_heartrate}
        >
          <Grid.Item background="#fff">
            <Table>
              <thead>
                <tr>
                  <td>Splits</td>
                  <th>Time</th>
                  <th>Pace</th>
                  <th>HR</th>
                </tr>
              </thead>
              <tbody>
                {activity.laps.map(lap => (
                  <tr key={lap.split}>
                    <th>{lap.split}</th>
                    <td>{secondsToString(lap.moving_time)}</td>
                    <td>
                      {mpsToMpk(lap.average_speed)}
                      /km
                    </td>
                    <td>
                      {Math.round(lap.average_heartrate)}
                      bpm
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Grid.Item>
          {activity.has_heartrate && (
            <Grid.Item background="#fff">
              <Table borderLeft={0}>
                <thead>
                  <tr>
                    <td>Heartrate</td>
                    <th>Time</th>
                    <th>%</th>
                  </tr>
                </thead>
                <tbody>
                  {Object.keys(analyzedHR).map(z => (
                    <tr key={z}>
                      <th>{z}</th>
                      <td>{secondsToString(analyzedHR[z].seconds)}</td>
                      <td>{analyzedHR[z].percent} %</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Grid.Item>
          )}
          <Grid.Item background="#fff">
            <Table borderLeft={0}>
              <thead>
                <tr>
                  <td>Pace</td>
                  <th>Time</th>
                  <th>%</th>
                </tr>
              </thead>
              <tbody>
                {Object.keys(analyzedPaces).map(z => (
                  <tr key={z}>
                    <th>{z}</th>
                    <td>{secondsToString(analyzedPaces[z].seconds)}</td>
                    <td>{analyzedPaces[z].percent} %</td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Grid.Item>
        </Grid>
      </Layout>
    )
  }
}
export default Activity

export const pageQuery = graphql`
  query($id: Float) {
    stravaActivity(activity: {id: {eq: $id}}) {
      activity {
        id
        name
        type
        elapsed_time
        moving_time
        start_date
        distance
        has_heartrate
        average_heartrate
        average_cadence
        average_speed
        elev_high
        elev_low
        map {
          summary_polyline
        }
        streams {
          latlng
          heartrate
          distance
          velocity_smooth
          time
          altitude
        }
        laps {
          id
          split
          name
          resource_state
          elapsed_time
          moving_time
          distance
          average_speed
          average_cadence
          average_heartrate
          total_elevation_gain
        }
      }
    }
  }
`
