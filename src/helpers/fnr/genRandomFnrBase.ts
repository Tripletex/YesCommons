import gen from '../gen'

/**
 * @returns {number[]} array of month ciphers
 */
function genMonth(): number[] {
  const m1 = Math.floor(Math.random() * 2)
  const m2 = Math.floor(Math.random() * 10)
  if (m1 === 1 && m2 > 2) {
    return genMonth()
  }
  return [m1, m2]
}

/**
 * @returns {number[]} array of day ciphers
 */
function genDay(): number[] {
  const d1 = Math.floor(Math.random() * 4)
  const d2 = Math.floor(Math.random() * 10)
  if (d1 === 3 && d2 > 2) {
    return genDay()
  }
  return [d1, d2]
}

export function genRandomFnrBase(): number[] {
  const individualCiphers = gen(3)
  const year = gen(2)
  const month = genMonth()
  const day = genDay()
  return [...day, ...month, ...year, ...individualCiphers]
}
