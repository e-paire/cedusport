import React from "react"
import styled from "styled-components"
import {space} from "styled-system"

const Wrapper = styled.select`
  font-family: inherit;
  font-size: inherit;
  color: inherit;
  background-color: transparent;
  border: none;
  border-bottom: 1px solid ${props => props.theme.palette.primary};
  border-radius: 0;
  cursor: pointer;
  ${space};

  &:focus {
    outline: none;
  }
`

const Select = ({children, ...props}) => (
  <Wrapper {...props}>{children}</Wrapper>
)

export default Select
