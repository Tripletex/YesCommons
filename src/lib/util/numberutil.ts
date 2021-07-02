export const generateRandomIntInRange = (
  inclusiveMin: number,
  inclusiveMax: number
): number => {
  inclusiveMin = Math.ceil(inclusiveMin)
  inclusiveMax = Math.floor(inclusiveMax)
  return (
    Math.floor(Math.random() * (inclusiveMax - inclusiveMin + 1)) + inclusiveMin
  )
}
