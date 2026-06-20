// Harmonic tide prediction — no API key needed.
// Uses SHOM published constants + standard astronomical formulae (Schureman 1958).

const DEG = Math.PI / 180

// Angular speeds in degrees/hour
const SPEEDS = {
  M2: 28.9841042,
  S2: 30.0000000,
  N2: 28.4397295,
  K2: 30.0821373,
  K1: 15.0410686,
  O1: 13.9430356,
  P1: 14.9589314,
  Q1: 13.3986609,
}

// SHOM harmonic constants [amplitude m, phase lag °] + Z0 above LAT.
// Source: SHOM Annuaire des Marées (publicly available reference data).
const PORTS = {
  concarneau: {
    Z0: 2.35,
    M2: [2.197, 110.3], S2: [0.748, 155.5], N2: [0.476,  86.3],
    K2: [0.204, 157.7], K1: [0.126, 224.2], O1: [0.094, 202.0],
    P1: [0.042, 222.0], Q1: [0.017, 179.0],
  },
  lorient: {
    Z0: 2.72,
    M2: [2.297, 114.0], S2: [0.789, 161.0], N2: [0.498,  89.5],
    K2: [0.215, 163.0], K1: [0.133, 224.0], O1: [0.099, 203.0],
    P1: [0.044, 222.0], Q1: [0.018, 180.0],
  },
  lecroisic: {
    Z0: 2.70,
    M2: [2.272, 115.9], S2: [0.782, 163.4], N2: [0.491,  91.4],
    K2: [0.213, 165.7], K1: [0.132, 222.6], O1: [0.099, 202.0],
    P1: [0.044, 221.0], Q1: [0.018, 179.0],
  },
  brest: {
    Z0: 4.02,
    M2: [2.431, 107.0], S2: [0.839, 152.5], N2: [0.527,  82.5],
    K2: [0.228, 154.2], K1: [0.164, 222.0], O1: [0.124, 200.0],
    P1: [0.054, 220.0], Q1: [0.023, 177.0],
  },
}

function mod360(x) { return ((x % 360) + 360) % 360 }

function julianDay(date) {
  let y = date.getUTCFullYear()
  let m = date.getUTCMonth() + 1
  if (m <= 2) { y--; m += 12 }
  const A = Math.floor(y / 100)
  const B = 2 - A + Math.floor(A / 4)
  const d = date.getUTCDate()
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + d + B - 1524.5
}

// Compute V₀ (astronomical arguments at midnight UTC) and nodal corrections f, u.
// At midnight UTC the mean solar hour angle T₀ = 0, so V₀ simplifies to pure
// combinations of s, h, p, N evaluated at midnight.
function astronomyAtMidnight(date) {
  const midnight = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  const JD = julianDay(midnight)
  const T = (JD - 2451545.0) / 36525

  const s  = mod360(218.3164477 + 481267.88123421 * T)
  const h  = mod360(280.4664774 + 36000.76982779  * T)
  const p  = mod360(83.3532465  + 4069.01363604   * T)
  const N  = mod360(125.0445479 - 1934.13626197   * T)
  const NR = N * DEG

  const cosN  = Math.cos(NR)
  const sinN  = Math.sin(NR)
  const cos2N = Math.cos(2 * NR)
  const sin2N = Math.sin(2 * NR)

  const f_M2 = 1.0004 - 0.0373 * cosN + 0.0002 * cos2N
  const f_O1 = 1.0089 + 0.1871 * cosN - 0.0147 * cos2N
  const f_K1 = 1.0060 + 0.1150 * cosN - 0.0088 * cos2N
  const f_K2 = 1.0241 + 0.2863 * cosN + 0.0083 * cos2N

  const nodal = {
    M2: { f: f_M2, u: -2.14 * sinN },
    S2: { f: 1.0,  u: 0.0 },
    N2: { f: f_M2, u: -2.14 * sinN },
    K2: { f: f_K2, u: -17.74 * sinN / f_K2 },
    K1: { f: f_K1, u:  -8.86 * sinN / f_K1 },
    O1: { f: f_O1, u:  10.80 * sinN - 1.34 * sin2N },
    P1: { f: 1.0,  u: 0.0 },
    Q1: { f: f_O1, u:  10.80 * sinN - 1.34 * sin2N },
  }

  const V0 = {
    M2: mod360(2 * (h - s)),
    S2: 0,
    N2: mod360(2 * h - 3 * s + p),
    K2: mod360(2 * h),
    K1: mod360(h + 90),
    O1: mod360(h - 2 * s + 270),
    P1: mod360(270 - h),
    Q1: mod360(h - 3 * s + p + 270),
  }

  return { V0, nodal }
}

// Tide height in metres at t hours after midnight UTC for the given port.
function heightAt(portKey, t, V0, nodal) {
  const port = PORTS[portKey]
  let height = port.Z0
  for (const [name, speed] of Object.entries(SPEEDS)) {
    const consts = port[name]
    if (!consts) continue
    const [H, g] = consts
    const { f, u } = nodal[name]
    const angle = V0[name] + u + speed * t - g
    height += f * H * Math.cos(angle * DEG)
  }
  return height
}

// Sample the tide every STEP_MIN and extract PM/BM extrema over 24h.
const STEP_MIN = 10

function findExtrema(portKey, date, V0, nodal) {
  const steps = (24 * 60) / STEP_MIN
  const series = Array.from({ length: steps + 1 }, (_, i) => ({
    t: i * STEP_MIN / 60,
    h: heightAt(portKey, i * STEP_MIN / 60, V0, nodal),
  }))

  const midnight = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()))
  const results = []

  for (let i = 1; i < series.length - 1; i++) {
    const prev = series[i - 1].h
    const curr = series[i].h
    const next = series[i + 1].h
    if (curr > prev && curr > next) {
      results.push({ type: 'PM', time: new Date(midnight.getTime() + series[i].t * 3_600_000), height: curr })
    } else if (curr < prev && curr < next) {
      results.push({ type: 'BM', time: new Date(midnight.getTime() + series[i].t * 3_600_000), height: curr })
    }
  }

  return results
}

// French tidal coefficient from Brest predicted range.
// Linear mapping calibrated to SHOM reference: range 0.8m → coef 20, range 7.0m → coef 120.
function coefficientFromBrest(date) {
  const { V0, nodal } = astronomyAtMidnight(date)
  const extrema = findExtrema('brest', date, V0, nodal)
  const pm = extrema.filter(e => e.type === 'PM')
  const bm = extrema.filter(e => e.type === 'BM')
  if (!pm.length || !bm.length) return null
  const range = pm[0].height - bm[0].height
  return Math.round(Math.max(20, Math.min(120, 20 + (range - 0.8) / 6.2 * 100)))
}

// Public API — synchronous, no network call.
export function getDayTides(portKey) {
  const date = new Date()
  const { V0, nodal } = astronomyAtMidnight(date)
  const extrema = findExtrema(portKey, date, V0, nodal)
  const coef = coefficientFromBrest(date)
  return { extrema, coef }
}
