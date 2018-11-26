import React from "react"
import styled from "styled-components"

import theme from "../utils/theme"

const Wrapper = styled.div`
  & > *:not(picture):not(figure) {
    margin-left: auto;
    margin-right: auto;
    max-width: 1000px;
  }

  h1,
  h2,
  h3,
  h4,
  h5 {
    margin-top: 30px;
  }

  img {
    width: 100%;
  }

  p {
    text-align: justify;

    a {
      color: ${theme.palette.primary};
      font-weight: bold;
      text-decoration: none;
    }
  }
`

const Html = ({children}) => (
  <Wrapper dangerouslySetInnerHTML={{__html: children}} />
)
export default Html
