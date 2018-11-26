import React from "react"
import {Box, Flex, Table} from "reakit"
import {withNamespaces} from "react-i18next"

const ActivityDetails = withNamespaces()(({activity, t}) =>
  activity ? (
    <Flex
      height="100%"
      width="100%"
      alignItems="center"
      justifyContent="center"
      flexDirection="column"
      background="#fff"
    >
      <Table fontSize={10}>
        <caption>
          <Box fontSize={14}>
            {t("activity.date", {
              date: new Date(activity.start_date),
            })}
          </Box>
        </caption>
        <tbody>
          <tr>
            <th>
              {t("activity.duration", {
                duration: activity.moving_time,
              })}
            </th>
            <th>
              {t("activity.distance", {
                distance: activity.distance,
              })}
            </th>
          </tr>
          <tr>
            <th>
              {t("activity.min_per_km", {
                speed: activity.average_speed,
              })}
            </th>
            <th>
              {t("activity.km_per_hour", {
                speed: activity.average_speed,
              })}
            </th>
          </tr>
        </tbody>
      </Table>
    </Flex>
  ) : null
)

export default ActivityDetails
