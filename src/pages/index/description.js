import React from "react"
import {withNamespaces, Trans} from "react-i18next"
import parse from "date-fns/parse"

import Select from "~/components/select"

const MonthSwitcher = withNamespaces()(({t, value, months, date, onChange}) => (
  <Select
    value={value}
    onChange={e => onChange(parse(e.target.value, "YYYY-MM"))}
  >
    {months.map(month => {
      const date = parse(month, "YYYY-MM")
      return (
        <option key={month} value={month}>
          {t("index.select.month", {date})}
        </option>
      )
    })}
  </Select>
))

const TypeSwitcher = withNamespaces()(({t, value, onChange}) => (
  <Select value={value} onChange={e => onChange(e.target.value)}>
    <option value="run">{t("index.select.run")}</option>
    <option value="ride">{t("index.select.ride")}</option>
  </Select>
))

const Description = withNamespaces()(
  ({t, date, onDateChange, onTypeChange, month, type, activities, months}) => {
    if (!activities) {
      return null
    }

    const monthDuration = activities.reduce(
      (total, edge) => total + edge.node.activity.moving_time,
      0
    )
    const monthDistance = activities.reduce(
      (total, edge) => total + edge.node.activity.distance,
      0
    )

    const distance = t("index.distance", {distance: monthDistance})
    const duration = t("index.duration", {duration: monthDuration})
    const count = activities.length

    return (
      <Trans i18nKey="index.description">
        During
        <MonthSwitcher
          months={months}
          date={date}
          value={month}
          onChange={onDateChange}
        />
        you
        <TypeSwitcher value={type} onChange={onTypeChange} />
        <b>{{count}}</b> times for a total of
        <b>{{distance}}</b> km in
        <b>{{duration}}</b>
      </Trans>
    )
  }
)

export default Description
