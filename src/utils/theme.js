import {css} from "reakit"
import defaultTheme from "reakit-theme-default"
import {palette} from "styled-tools"
import {space, width, fontSize, color} from "styled-system"

const bold = props => ({fontWeight: props.bold ? "bold" : "normal"})
const sizes = {
  mobile: 320,
  tablet: 768,
  laptop: 1024,
  desktop: 2560,
}
export default {
  ...defaultTheme,
  fontFamily: "Roboto",
  palette: {
    ...defaultTheme.palette,
    primary: "#fc4c02",
    primaryText: "#fff",
    text: "#5f6368",
    gray: ["rgb(245, 245, 245)", "rgba(224, 224, 224, 1)"],
  },
  space: [0, 8, 16, 32, 64],
  sizes,
  device: {
    mobile: `(min-width: ${sizes.mobile}px) and (max-width: ${sizes.tablet -
      1}px)`,
    tablet: `(min-width: ${sizes.tablet}px) and (max-width: ${sizes.laptop -
      1}px)`,
    laptop: `(min-width: ${sizes.laptop}px) and (max-width: ${sizes.desktop -
      1}px)`,
    desktop: `(min-width: ${sizes.desktop}px)`,
  },

  Heading: css`
    ${defaultTheme.Heading};
    ${bold};
  `,
  Inline: css`
    ${bold};
    ${fontSize};
    ${color};
  `,
  Box: css`
    ${defaultTheme.Box};
    ${space};
    ${width};
    ${fontSize};
    ${color};
  `,
  Button: css`
    ${defaultTheme.Button};
    text-decoration: none;
  `,

  Card: css`
    max-width: 400px;
    background-color: #fff;
    border-radius: 4px;
    box-shadow: 0 1px 1px 0 rgba(60, 64, 67, 0.08),
      0 1px 3px 1px rgba(60, 64, 67, 0.16);
  `,

  Overlay: css`
    overflow: hidden;
  `,

  Table: css`
    width: 100%;
    border: 0;
    table-layout: fixed;
    border-collapse: collapse;
    background: #fff;

    caption {
      background: #fff;
    }

    tbody,
    td,
    th,
    tfoot,
    thead,
    tr {
      border: inherit;
    }
    caption,
    tr {
      border-bottom: 1px solid ${palette("gray", 1)};
    }

    thead th {
      border-bottom: 1px solid ${palette("gray", 1)};
    }
    td,
    th,
    caption {
      padding: 15px;
      vertical-align: middle;
      text-align: center;
    }
    td:not(:last-child),
    th:not(:last-child) {
      border-right: 1px solid ${palette("gray", 1)};
    }
    thead td,
    th {
      font-weight: bold;
    }
    th {
      background: ${palette("gray")};
    }
  `,
  Input: css`
    &[type="range"] {
      outline: none;
      height: 3px;
      width: 100%;
      color: ${palette("primary")};
      background-color: ${palette("gray")};
      background-image: linear-gradient(currentColor, currentColor);
      background-repeat: no-repeat;
      cursor: pointer;
      appearance: none;
      padding: 0;

      &::-webkit-slider-thumb {
        width: 16px;
        height: 16px;
        border: 0;
        background: currentColor;
        border-radius: 50% 50%;
        appearance: none;
        border-radius: 50% 50%;
      }
      &::-moz-range-thumb {
        width: 16px;
        height: 16px;
        border: 0;
        background: currentColor;
        border-radius: 50% 50%;
        appearance: none;
        border-radius: 50% 50%;
      }

      &:hover::-webkit-slider-thumb {
        box-shadow: 0 0 0 1px #fff, 0 0 0 0.2rem ${palette("primary")};
      }

      &:hover::-moz-range-thumb {
        box-shadow: 0 0 0 1px #fff, 0 0 0 0.2rem ${palette("primary")};
      }

      &:focus {
        outline: none;
      }
    }
  `,
}
