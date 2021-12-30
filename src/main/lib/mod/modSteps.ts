export const luhn_step1 = (base: string, length: number): string => {
  let ret = base
  const iterations = length - ret.length - 1
  for (let i = 0; i < iterations; i++) {
    ret = ret.concat(Math.floor(Math.random() * 10).toString())
  }
  return ret.replace(/[^0-9]+/g, '')
}

export const luhn_step2 = (base: string): number[] => {
  return base
    .split('')
    .map((i) => +i)
    .reverse()
}

export const luhn_step3_mod10 = (digits: number[]): number[] => {
  const step3: number[] = []
  let shouldDouble = true
  for (let i = 0; i < digits.length; i++) {
    if (shouldDouble) {
      const doubled = digits[i] * 2
      if (doubled > 9) {
        // We convert the number to a string to get the digits, because JS :)
        const doubledString = doubled.toString()
        const summed = parseInt(doubledString[0]) + parseInt(doubledString[1])
        step3.push(summed)
      } else {
        step3.push(doubled)
      }
    } else {
      step3.push(digits[i])
    }
    shouldDouble = !shouldDouble
  }
  return step3
}

export const luhn_step3_mod11 = (digits: number[]): number[] => {
  const step3: number[] = []

  for (let i = 0; i < digits.length; i++) {
    const toMultiply = (i % 6) + 2
    const multiplied = digits[i] * toMultiply
    step3.push(multiplied)
  }

  return step3
}

export const luhn_step4 = (digits: number[]): number => {
  return digits.reduce((a, b) => a + b, 0)
}

export const luhn_step5_mod10 = (n: number): string => {
  const overflow = n % 10
  const fix = 10 - overflow
  if (fix == 10) return '0'
  return fix.toString()
}

export const luhn_step5_mod11 = (n: number): string => {
  const overflow = n % 11
  const fix = 11 - overflow
  if (fix === 10) {
    return '-'
  }
  if (fix === 11) {
    return '0'
  }
  return fix.toString()
}
