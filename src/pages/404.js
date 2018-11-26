import React from "react"
import {Trans} from "react-i18next"

import Layout from "~/layouts/index"

const NotFoundPage = () => (
  <Layout alignItems="center">
    <h2>
      <Trans i18nKey="404.title" />
    </h2>
    <p>
      <Trans i18nKey="404.description" />
    </p>
  </Layout>
)

export default NotFoundPage
