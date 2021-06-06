import { MAX_KID_LENGTH, MIN_KID_LENGTH } from "../types/types";

// This file gave me a headache, so I re-wrote it.

/**
 * Validates the input before calculating a new kid
 * based on the input and the MOD10-algorithm
 * @see mod10
 *
 * @param base The base of the kid.
 * @param length The total length of the kid.
 * @return kid A new randomly generated kid, based on the MOD10-algorithm.
 *
 * @author Henrik Klev
 * @date 2021-06-05
 */
export const generateKidMod10 = (base: string, length: number) => {
  kidInputValidation(base, length)
  return mod10(base, length)
}

/**
 * Validates the input before calculating a new kid
 * based on the input and the MOD11-algorithm
 * @see mod11
 *
 * @param base The base of the kid.
 * @param length The total length of the kid.
 * @return kid A new randomly generated kid, based on the MOD11-algorithm.
 *
 * @author Henrik Klev
 * @date 2021-06-06
 */
export const generateKidMod11 = (base: string, length: number) => {
  kidInputValidation(base, length)
  return mod11(base, length)
}

/**
 * Checks if a kid is valid based on the MOD10-algorithm.
 * It works similarly to {@link mod10}; except instead of calculating
 * the control digit and appending it, the control digit is calculated
 * and checked to be equal to the control digit in the kid.
 *
 * @param kid The kid to be validated.
 * @return isValidKid <code>true</code> iff valid kid, otherwise <code>false</code>.
 *
 * @author Henrik Klev
 * @date 2021-06-06
 */
export const validateKid_mod10 = (kid: string): boolean => {
  if (kid.length < MIN_KID_LENGTH || kid.length > MAX_KID_LENGTH)
    return false

  const controlDigit = +kid.slice(-1)
  const restOfKid = kid.substring(0, kid.length - 1);
  const reversed = luhn_step2(restOfKid)
  const weighted = luhn_step3_mod10(reversed)
  const sum = luhn_step4(weighted)
  return 10 - (sum % 10) === controlDigit
}


/**
 * Checks if a kid is valid based on the MOD10-algorithm.
 * It works similarly to {@link mod11}; except instead of calculating
 * the control digit and appending it, the control digit is calculated
 * and checked to be equal to the control digit in the kid.
 *
 * @param kid The kid to be validated.
 * @return isValidKid <code>true</code> iff valid kid, otherwise <code>false</code>.
 *
 * @author Henrik Klev
 * @date 2021-06-06
 */
export const validateKid_mod11 = (kid: string): boolean => {
  if (kid.length < MIN_KID_LENGTH || kid.length > MAX_KID_LENGTH)
    return false

  const controlDigit = kid.slice(-1)
  const restOfKid = kid.substring(0, kid.length - 1);
  const reversed = luhn_step2(restOfKid)
  const weighted = luhn_step3_mod11(reversed)
  const sum = luhn_step4(weighted)

  if (controlDigit === '-')
    return 11 - (sum % 11) === 10
  else
    return 11 - (sum % 11) === +controlDigit
}

const kidInputValidation = (base: string, length: number): void => {
  if (base.length >= length)
    throw new Error('Base-length of kid cannot be greater than, or equal to, total length of kid.')

  if (length < MIN_KID_LENGTH || length > MAX_KID_LENGTH)
    throw new Error(`Length of kid must be between ${MIN_KID_LENGTH} and ${MAX_KID_LENGTH}`)
}

/**
 * @desc Algorithm is based on {@link https://en.wikipedia.org/wiki/Luhn_algorithm Luhn}. Summarized:
 *  <ol>
 *    <li>Add random digits to the base until kid is at length - 1, and remove all NaN from kid.</li>
 *    <li>Split it into a number-array, and reverse it.</li>
 *    <li>From the right-most digit, and moving left, double the value of every second digit.
 *        If doubling the digits end up in a two-digit number, then swap the number for the sum of the individual digits.</li>
 *    <li>Sum together all the resulting digits.</li>
 *    <li>Find a number that, when added to the result of the previous step, makes the sum divisible by 10. Append that number to the base.</li>
 *  </ol>
 * @param base The base of the kid.
 * @param length The total length of the kid.
 * @return kid A new randomly generated kid, based on the MOD10-algorithm.
 *
 * @author Henrik Klev
 * @date 2021-06-05
 */
const mod10 = (base: string, length: number): string => {
  const step1: string = luhn_step1(base, length)
  const step2: number[] = luhn_step2(step1)
  const step3: number[] = luhn_step3_mod10(step2)
  const step4: number = luhn_step4(step3)
  const step5: string = luhn_step5_mod10(step4)
  return step1.concat(step5)
}

/**
 * @desc Algorithm is based on {@link https://en.wikipedia.org/wiki/Luhn_algorithm Luhn}, altered to be {@link https://no.wikipedia.org/wiki/MOD11 MOD11-based}.
 * Summarized:
 *  <ol>
 *    <li>Add random digits to the base until kid is at length - 1, and remove all NaN from kid.</li>
 *    <li>Split it into a number-array, and reverse it.</li>
 *    <li>From the right-most digit, and moving left, multiply the digit with the next number in the weight-list [2, 3, ..., 7, 2, 3, ...].</li>
 *    <li>Sum together all the resulting digits.</li>
 *    <li>Find a number that, when added to the result of the previous step, makes the sum divisible by 11. Append that number to the base.</li>
 *  </ol>
 * @param base The base of the kid.
 * @param length The total length of the kid.
 * @return kid A new randomly generated kid, based on the MOD11-algorithm.
 *
 * @author Henrik Klev
 * @date 2021-06-06
 */
const mod11 = (base: string, length: number): string => {
  const step1: string = luhn_step1(base, length)
  const step2: number[] = luhn_step2(step1)
  const step3: number[] = luhn_step3_mod11(step2)
  const step4: number = luhn_step4(step3)
  const step5: string = luhn_step5_mod11(step4)
  if (step5 === '-') // These are 'valid' based on the MOD11-algorithm, but generally not accepted in accounting.
    return mod11(base, length)
  return step1.concat(step5)
}

const luhn_step1 = (base: string, length: number): string => {
  let ret = base
  const iterations = length - ret.length - 1
  for (let i = 0; i < iterations; i++) {
    ret = ret.concat(Math.floor(Math.random()*10).toString())
  }
  return ret.replace(/[^0-9]+/g, '')
}

const luhn_step2 = (base: string): number[] => {
  return base.split('').map(i => +i).reverse();
}

const luhn_step3_mod10 = (digits: number[]): number[] => {
  const step3: number[] = []
  let shouldDouble = true;
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

const luhn_step3_mod11 = (digits: number[]): number[] => {
  const step3: number[] = []

  for (let i = 0; i < digits.length; i++) {
    const toMultiply = (i % 6) + 2
    const multiplied = digits[i] * toMultiply
    step3.push(multiplied)
  }

  return step3
}

const luhn_step4 = (digits: number[]): number => {
  return digits.reduce((a,b) => a+b, 0);
}

const luhn_step5_mod10 = (n: number): string => {
  const overflow = n % 10
  const fix = 10 - overflow
  return fix.toString()
}

const luhn_step5_mod11 = (n: number): string => {
  const overflow = n % 11
  const fix = 11 - overflow
  if (fix === 10) {
    return '-'
  }
  return fix.toString()
}
