import React from "react"
import {graphql, Link} from "gatsby"
import {
  Backdrop,
  Box,
  Button,
  Flex,
  Heading,
  Inline,
  Overlay,
  styled,
  Table,
} from "reakit"
import CalendarHeatmap from "react-calendar-heatmap"
import {withNamespaces} from "react-i18next"
import startOfWeek from "date-fns/start_of_week"
import subWeeks from "date-fns/sub_weeks"
import ReactTooltip from "react-tooltip"

import Layout from "~/layouts/index"
import theme from "~/utils/theme"
import {metersToKilometers} from "~/utils/convertors"
import {generateColorsRange, getColorFromRange} from "~/utils/colors"

const Wrapper = styled(Box)`
  .react-calendar-heatmap {
    .color-filled:hover {
      cursor: pointer;
    }
  }
`

const weeksCount = 32
const endDate = new Date()
const startDate = startOfWeek(subWeeks(endDate, weeksCount))

const Dialog = withNamespaces()(({t, day}) => (
  <Table>
    <caption>{t("heatmap.dialog.date", {date: day.date})}</caption>
    <thead>
      <tr>
        <th>{t("heatmap.dialog.label.title")}</th>
        <th>{t("heatmap.dialog.label.time")}</th>
        <th>{t("heatmap.dialog.label.distance")}</th>
        <th />
      </tr>
    </thead>
    <tbody>
      {day.activities.map(activity => (
        <tr key={activity.id}>
          <td>{activity.name}</td>
          <td>
            {t("heatmap.dialog.activity.time", {date: activity.start_date})}
          </td>
          <td>
            {t("heatmap.dialog.activity.distance", {
              distance: activity.distance,
            })}
          </td>
          <td>
            <Link to={`/${activity.id}`}>
              <Button>{t("heatmap.dialog.activity.see")}</Button>
            </Link>
          </td>
        </tr>
      ))}
    </tbody>
  </Table>
))

class Heatmap extends React.Component {
  state = {activeDay: null}
  render() {
    const {activeDay} = this.state
    const {activities} = this.props
    const activitiesByDate = activities
      .filter(activity => new Date(activity.start_date) > startDate)
      .reduce((acc, activity) => {
        const date = activity.start_date.slice(0, 10)
        if (!acc[date]) {
          acc[date] = {
            date,
            distance: 0,
            activities: [],
          }
        }

        acc[date].distance += activity.distance
        acc[date].activities.push(activity)

        return acc
      }, {})
    const distanceMaxForOneDay =
      Object.values(activitiesByDate).length > 0
        ? Math.max(...Object.values(activitiesByDate).map(d => d.distance))
        : 0

    const colorsRange = generateColorsRange({
      colors: [theme.palette.gray[0], theme.palette.primary],
      min: 0,
      max: distanceMaxForOneDay,
    })

    return (
      <Overlay.Container>
        {overlay => (
          <>
            <CalendarHeatmap
              horizontal={true}
              startDate={startDate}
              endDate={endDate}
              values={Object.values(activitiesByDate)}
              showWeekdayLabels={false}
              showMonthLabels={false}
              titleForValue={value =>
                value && value.date
                  ? `${value.date.slice(0, 10)}: ${metersToKilometers(
                      value.distance
                    )}km`
                  : ""
              }
              tooltipDataAttrs={value => ({
                "data-tip":
                  value && value.date
                    ? `${value.date.slice(0, 10)}: ${metersToKilometers(
                        value.distance
                      )}km`
                    : "",
              })}
              onClick={value =>
                value && this.setState({activeDay: value}, overlay.show)
              }
              transformDayElement={(element, value, index) => {
                const distance = value ? value.distance : 0
                return React.cloneElement(element, {
                  style: {
                    fill: getColorFromRange(colorsRange, distance),
                  },
                })
              }}
            />
            <Backdrop fade use={Overlay.Hide} {...overlay} />
            <Overlay fade slide {...overlay}>
              {activeDay && <Dialog day={activeDay} />}
            </Overlay>
          </>
        )}
      </Overlay.Container>
    )
  }
}

const HeatmapCalendarPage = withNamespaces()(
  ({t, data: {activities, site}}) => (
    <Layout>
      <Wrapper>
        <Flex
          backgroundColor={theme.palette.gray[0]}
          fontSize={25}
          py={3}
          px={2}
          justifyContent="center"
        >
          <Inline>{t("heatmap.description", {count: weeksCount})}</Inline>
        </Flex>
        <Box padding={20} textAlign="center">
          <Heading use="h2">{t("heatmap.running")}</Heading>
        </Box>
        <Heatmap
          activities={activities.edges
            .filter(({node: {activity}}) => activity.type === "Run")
            .map(({node: {activity}}) => activity)}
        />
        <Box fontSize={30} padding={20} textAlign="center">
          {t("heatmap.bike")}
        </Box>
        <Heatmap
          activities={activities.edges
            .filter(({node: {activity}}) => activity.type === "Ride")
            .map(({node: {activity}}) => activity)}
        />
        <Box fontSize={30} padding={20} textAlign="center">
          {t("heatmap.swimming")}
        </Box>
        <Heatmap
          activities={activities.edges
            .filter(({node: {activity}}) => activity.type === "Swimm")
            .map(({node: {activity}}) => activity)}
        />
        <ReactTooltip />
      </Wrapper>
    </Layout>
  )
)

export default HeatmapCalendarPage

export const pageQuery = graphql`
  {
    activities: allStravaActivity(
      filter: {activity: {distance: {ne: null}}}
      sort: {fields: [activity___start_date], order: DESC}
    ) {
      edges {
        node {
          activity {
            id
            name
            type
            start_date
            distance
          }
        }
      }
    }
  }
`
