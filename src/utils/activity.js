import {metersPerSecondToMinPerKm as mpsToMpk} from "./convertors"

const LactateThresholdHearRate = 171
const TRIMPGenderFactor = 1.92 // Woman: 1.67;

const average = arr => arr.reduce((p, c) => p + c, 0) / arr.length

const computeHeartRateStressScore = (userMaxHr, userMinHr, trainingImpulse) => {
  const lactateThresholdReserve =
    (LactateThresholdHearRate - userMinHr) / (userMaxHr - userMinHr)

  const lactateThresholdTrainingImpulse =
    60 *
    lactateThresholdReserve *
    0.64 *
    Math.exp(TRIMPGenderFactor * lactateThresholdReserve)
  return (trainingImpulse / lactateThresholdTrainingImpulse) * 100
}

const computeRunningStressScore = (
  movingTime,
  gradeAdjustedAvgPace,
  runningThresholdPace
) => {
  // Convert pace to speed (km/s)
  const gradeAdjustedAvgSpeed = 1 / gradeAdjustedAvgPace
  const runningThresholdSpeed = 1 / runningThresholdPace
  const intensityFactor = gradeAdjustedAvgSpeed / runningThresholdSpeed
  return (
    ((movingTime * gradeAdjustedAvgSpeed * intensityFactor) /
      (runningThresholdSpeed * 3600)) *
    100
  )
}

const heartRateReserveFromHeartrate = (hr, maxHr, restHr) => {
  return (hr - restHr) / (maxHr - restHr)
}

const getAnalyzedPaces = pacesArray => {
  const paces = {
    z1: {seconds: 0, formatted: "", percent: ""},
    z2: {seconds: 0, formatted: "", percent: ""},
    z3: {seconds: 0, formatted: "", percent: ""},
    z4: {seconds: 0, formatted: "", percent: ""},
    z5: {seconds: 0, formatted: "", percent: ""},
    z6: {seconds: 0, formatted: "", percent: ""},
  }

  const velocity = pacesArray.filter(v => mpsToMpk(v) > 3 && mpsToMpk(6))
  const paceCount = velocity.length

  const smoothSec = 30
  for (let i = 0; i <= paceCount + smoothSec; i += smoothSec) {
    const nextPaces = velocity.slice(i, i + smoothSec)
    const avgPace = average(nextPaces)

    // if (avgPace < 3.01405148751741) {
    //   paces["z6"].seconds += smoothSec
    // } else if (avgPace < 3.5459429264910702) {
    //   paces["z5"].seconds += smoothSec
    // } else if (avgPace < 3.952569169960474) {
    //   paces["z4"].seconds += smoothSec
    // } else if (avgPace < 4.535147392290249) {
    //   paces["z3"].seconds += smoothSec
    // } else {
    //   paces["z2"].seconds += smoothSec
    // }
    // Basé sur un temps de 20:00 pour une course de type 5 km
    if (mpsToMpk(avgPace) > 5.36) {
      // Récupération active
      paces["z1"].seconds += smoothSec
    } else if (mpsToMpk(avgPace) > 4.49) {
      // Endurance
      paces["z2"].seconds += smoothSec
    } else if (mpsToMpk(avgPace) > 4.19) {
      // En cadence
      paces["z3"].seconds += smoothSec
    } else if (mpsToMpk(avgPace) > 4.03) {
      // Seuil
      paces["z4"].seconds += smoothSec
    } else if (mpsToMpk(avgPace) > 3.48) {
      // VO2 Max
      paces["z5"].seconds += smoothSec
    } else {
      // Anaérobie
      paces["z6"].seconds += smoothSec
    }

    //   // Basé sur un temps de 21:00 pour une course de type 5 km
    //   if (mpsToMpk(v) > 5.51) {
    //     paces["z1"].seconds += 1
    //   } else if (mpsToMpk(v) > 5.02) {
    //     paces["z2"].seconds += 1
    //   } else if (mpsToMpk(v) > 4.31) {
    //     paces["z3"].seconds += 1
    //   } else if (mpsToMpk(v) > 4.14) {
    //     paces["z4"].seconds += 1
    //   } else if (mpsToMpk(v) > 3.59) {
    //     paces["z5"].seconds += 1
    //   } else {
    //     paces["z6"].seconds += 1
    //   }
  }

  Object.keys(paces).forEach(z => {
    paces[z].percent = ((paces[z].seconds / paceCount) * 100).toFixed(1)
  })

  return paces
}

const getAnalyzedHeartRates = hrArray => {
  const heartRates = {
    z1: {seconds: 0, formatted: "", percent: ""}, // Endurance
    z2: {seconds: 0, formatted: "", percent: ""}, // Modéré
    z3: {seconds: 0, formatted: "", percent: ""}, // Allure constante
    z4: {seconds: 0, formatted: "", percent: ""}, // Seuil
    z5: {seconds: 0, formatted: "", percent: ""}, // Anaérobie
  }

  let trainingImpulse = 0

  const heartrateCount = hrArray.length

  for (let i = 1; i < heartrateCount; i++) {
    const hr = (hrArray[i] + hrArray[i - 1]) / 2
    const heartRateReserveAvg = heartRateReserveFromHeartrate(hr, 180, 60)

    trainingImpulse +=
      (1 / 60) *
      heartRateReserveAvg *
      0.64 *
      Math.exp(TRIMPGenderFactor * heartRateReserveAvg)

    if (hr < 117) {
      heartRates["z1"].seconds += 1
    } else if (hr < 145) {
      heartRates["z2"].seconds += 1
    } else if (hr < 160) {
      heartRates["z3"].seconds += 1
    } else if (hr < 175) {
      heartRates["z4"].seconds += 1
    } else {
      heartRates["z5"].seconds += 1
    }

    Object.keys(heartRates).forEach(z => {
      heartRates[z].percent = (
        (heartRates[z].seconds / heartrateCount) *
        100
      ).toFixed(1)
    })
  }

  const heartRateStressScore = computeHeartRateStressScore(
    180,
    60,
    trainingImpulse
  ).toFixed(0)

  return {
    heartRates,
    heartRateStressScore,
    trainingImpulse: trainingImpulse.toFixed(0),
  }
}

export {
  computeHeartRateStressScore,
  computeRunningStressScore,
  getAnalyzedPaces,
  getAnalyzedHeartRates,
}
