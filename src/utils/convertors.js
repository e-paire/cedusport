const metersPerSecondToMinPerKm = mps => {
  const mpkm = 16.666666666667 / mps
  const [min, s] = mpkm.toString().split(".")
  return (Number(min) + (60 * Number(`0.${s}`)) / 100).toFixed(2)
}
const metersPerSecondTokmPerHour = mps => (3.6 * mps).toFixed(2)
const metersToKilometers = m => (m / 1000).toFixed(1)
const hrssToHrssPerHour = (hrss, duration) =>
  ((hrss / duration) * 60 * 60).toFixed(0)

export {
  metersToKilometers,
  hrssToHrssPerHour,
  metersPerSecondToMinPerKm,
  metersPerSecondTokmPerHour,
}
