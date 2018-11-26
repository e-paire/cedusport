const secondsToString = d => {
  d = Number(d)
  const h = Math.floor(d / 3600)
  const m = Math.floor((d % 3600) / 60)
  const s = Math.floor((d % 3600) % 60)

  const hDisplay = h > 0 ? (h < 10 ? "0" : "") + h + "h" : ""
  const mDisplay = m > 0 ? (m < 10 ? "0" : "") + m + "m" : ""
  const sDisplay = s + "s"
  return hDisplay + mDisplay + sDisplay
}

const secondsToHms = d => {
  d = Number(d)
  const h = Math.floor(d / 3600)
  const m = Math.floor((d % 3600) / 60)
  const s = Math.floor((d % 3600) % 60)

  return {h, m, s}
}

export {secondsToString, secondsToHms}
