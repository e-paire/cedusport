import {Inline, Flex, Box, styled} from "reakit"
import {graphql, Link} from "gatsby"
import format from "date-fns/format"
import groupBy from "lodash/groupBy"
import Hexagon from "react-svg-hexagon"
import HexagonFlip from "react-svg-hexagon-flip"
import HexagonsGrid from "react-svg-hexagon-grid"
import React from "react"

import Layout from "~/layouts/index"
import theme from "~/utils/theme"

import ActivityDetails from "./index/activity-details"
import ActivityMap from "./index/activity-map"
import Description from "./index/description"

const MONTH_FORMAT = "YYYY-MM"

const HexagonWrapper = styled(Box)`
  filter: drop-shadow(0px 1px 4px 0 rgba(0, 0, 0, 0.37));
`

const HexagonCustom = ({children, ...props}) => (
  <HexagonWrapper>
    <Hexagon
      radius={8}
      fill="#fff"
      stroke={theme.palette.primary}
      strokeWidth={3}
      {...props}
    >
      {children}
    </Hexagon>
  </HexagonWrapper>
)

class IndexPage extends React.Component {
  state = {
    activeType: "run",
    activeDate: new Date(),
  }

  handleTypeChange = type => {
    this.setState({activeType: type})
  }

  handleDateChange = date => {
    this.setState({activeDate: date})
  }

  getActivitiesByMonth = () => {
    const {activeType} = this.state
    const {
      data: {rides, runs},
    } = this.props

    const activities = activeType === "ride" ? rides : runs
    const groupByMonth = activity => format(activity.start_date, MONTH_FORMAT)
    const groupFunction = edge => groupByMonth(edge.node.activity)
    const activitiesByMonth = groupBy(activities.edges, groupFunction)
    return activitiesByMonth
  }

  render() {
    const {activeDate, activeType} = this.state
    const activeMonth = format(activeDate, MONTH_FORMAT)
    const activitiesByMonth = this.getActivitiesByMonth()
    const monthActivities = activitiesByMonth[activeMonth] || []
    return (
      <Layout>
        <Flex
          backgroundColor={theme.palette.gray[0]}
          fontSize={25}
          py={3}
          px={2}
          justifyContent="center"
        >
          <Inline>
            <Description
              activities={monthActivities}
              months={Object.keys(activitiesByMonth)}
              date={activeDate}
              month={activeMonth}
              type={activeType}
              onDateChange={this.handleDateChange}
              onTypeChange={this.handleTypeChange}
            />
          </Inline>
        </Flex>
        <Flex justifyContent="center" my={3}>
          <HexagonsGrid gap={20}>
            {monthActivities.map(({node: {activity}}) => (
              <HexagonFlip key={activity.id} clipPath={null}>
                <HexagonCustom>
                  <ActivityMap polyline={activity.map.summary_polyline} />
                </HexagonCustom>
                <HexagonCustom
                  render={({ClipPath, Polygon, Content, Svg}) => {
                    return (
                      <Svg>
                        <Link to={`/activity/${activity.id}`}>
                          <ClipPath />
                          <Polygon />
                          <Content>
                            <ActivityDetails activity={activity} />
                          </Content>
                        </Link>
                      </Svg>
                    )
                  }}
                />
              </HexagonFlip>
            ))}
          </HexagonsGrid>
        </Flex>
      </Layout>
    )
  }
}

export default IndexPage

export const pageQuery = graphql`
  {
    rides: allStravaActivity(
      filter: {
        activity: {map: {summary_polyline: {ne: null}}, type: {eq: "Ride"}}
      }
      sort: {fields: [activity___start_date], order: DESC}
    ) {
      edges {
        node {
          ...strava
        }
      }
    }
    runs: allStravaActivity(
      filter: {
        activity: {map: {summary_polyline: {ne: null}}, type: {eq: "Run"}}
      }
      sort: {fields: [activity___start_date], order: DESC}
    ) {
      edges {
        node {
          ...strava
        }
      }
    }
  }
  fragment strava on StravaActivity {
    activity {
      id
      name
      type
      start_date
      moving_time
      distance
      average_speed
      map {
        summary_polyline
      }
    }
  }
`
