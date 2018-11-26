import React from "react"

export const FrFlag = props => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
    <circle cx="256" cy="256" r="256" fill="#f0f0f0" />
    <path
      fill="#d80027"
      d="M512 256c0-110-69-204-167-240v480c98-36 167-130 167-240z"
    />
    <path
      fill="#0052b4"
      d="M0 256c0 110 69 204 167 240V16A256 256 0 0 0 0 256z"
    />
  </svg>
)

export const EnFlag = props => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" {...props}>
    <circle cx="256" cy="256" r="256" fill="#f0f0f0" />
    <g fill="#0052b4">
      <path d="M53 100c-20 26-35 56-44 89h133l-89-89zM503 189c-9-33-24-63-44-89l-89 89h133zM9 323c9 33 24 63 44 89l89-89H9zM412 53c-26-20-56-35-89-44v133l89-89zM100 459c26 20 56 35 89 44V370l-89 89zM189 9c-33 9-63 24-89 44l89 89V9zM323 503c33-9 63-24 89-44l-89-89v133zM370 323l89 89c20-26 35-56 44-89H370z" />
    </g>
    <g fill="#d80027">
      <path d="M510 223H289V2a259 259 0 0 0-66 0v221H2a259 259 0 0 0 0 66h221v221a259 259 0 0 0 66 0V289h221a259 259 0 0 0 0-66z" />
      <path d="M323 323l114 114 15-16-98-98h-31zM189 323L75 437l16 15 98-98v-31zM189 189L75 75 60 91l98 98h31zM323 189L437 75l-16-15-98 98v31z" />
    </g>
  </svg>
)
