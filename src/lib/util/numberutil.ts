export const generateRandomIntInRange = (
  inclusiveMin: number,
  inclusiveMax: number
): number => {
  inclusiveMin = Math.ceil(inclusiveMin)
  inclusiveMax = Math.floor(inclusiveMax) + 1
  return (
    Math.floor(Math.random() * (inclusiveMax - inclusiveMin + 1)) + inclusiveMin
  )
}
