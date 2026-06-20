const OPEN_METEO = 'https://api.open-meteo.com/v1/forecast'
const WINDGURU_API = 'https://www.windguru.cz/int/iapi.php'

/**
 * Fetch live wind from a Windguru station.
 * Returns values in knots. The browser automatically sends a Referer, which
 * satisfies Windguru's check; CORS is open (access-control-allow-origin: *).
 *
 * @param {number} stationId
 * @returns {Promise<{speed: number, gusts: number, direction: number, time: string, source: string}>}
 */
export async function fetchWindguru(stationId) {
  const url = new URL(WINDGURU_API)
  url.searchParams.set('q', 'station_data_current')
  url.searchParams.set('id_station', stationId)

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Windguru: ${res.status}`)
  const d = await res.json()
  if (d.return === 'error') throw new Error(`Windguru: ${d.message}`)

  return {
    speed: Math.round(d.wind_avg * 10) / 10,
    gusts: Math.round(d.wind_max * 10) / 10,
    direction: d.wind_direction,
    time: d.datetime,
    source: 'Windguru',
  }
}

/**
 * Fetch current wind from Open-Meteo (free, no key, updates every 15 min).
 * Returns values in knots.
 *
 * @param {number} lat
 * @param {number} lon
 * @returns {Promise<{speed: number, gusts: number, direction: number, time: string, source: string}>}
 */
export async function fetchOpenMeteo(lat, lon) {
  const url = new URL(OPEN_METEO)
  url.searchParams.set('latitude', lat)
  url.searchParams.set('longitude', lon)
  url.searchParams.set('current', 'wind_speed_10m,wind_direction_10m,wind_gusts_10m')
  url.searchParams.set('wind_speed_unit', 'kn')
  url.searchParams.set('timezone', 'Europe/Paris')

  const res = await fetch(url)
  if (!res.ok) throw new Error(`Open-Meteo: ${res.status}`)
  const json = await res.json()
  const c = json.current

  return {
    speed: c.wind_speed_10m,
    gusts: c.wind_gusts_10m,
    direction: c.wind_direction_10m,
    time: c.time,
    source: 'Open-Meteo',
  }
}

/**
 * Unified wind fetch: uses a Windguru station if configured, falls back to Open-Meteo.
 *
 * @param {{ lat: number, lon: number, windguruStation?: number }} location
 */
export async function fetchWind(location) {
  if (location.windguruStation) {
    try {
      return await fetchWindguru(location.windguruStation)
    } catch {
      // silent fallback to model data
    }
  }
  return fetchOpenMeteo(location.lat, location.lon)
}

/**
 * Convert degrees to a compass label (in French).
 * @param {number} deg
 * @returns {string}
 */
export function degToCompass(deg) {
  const dirs = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSO', 'SO', 'OSO', 'O', 'ONO', 'NO', 'NNO']
  return dirs[Math.round(deg / 22.5) % 16]
}

/**
 * Beaufort scale from speed in knots.
 * @param {number} knots
 * @returns {number}
 */
export function beaufort(knots) {
  const thresholds = [1, 3, 6, 10, 16, 21, 27, 33, 40, 47, 55, 63]
  const idx = thresholds.findIndex(t => knots < t)
  return idx === -1 ? 12 : idx
}
