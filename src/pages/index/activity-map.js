import React from "react"
import {Image} from "reakit"

const ActivityMap = ({polyline}) => (
  <Image
    marginBottom={0}
    src={`
https://api.mapbox.com/styles/v1/xuopled/cjm8ybix98fu82ss1ovmll6i4/static/path+fc4c02(${encodeURIComponent(
      polyline
    )})/auto/260x300?access_token=${process.env.GATSBY_MAPBOX_TOKEN}
`}
  />
)

export default ActivityMap
