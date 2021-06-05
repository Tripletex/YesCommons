import { mod10_generate, mod10_validate } from '../lib/mod/mod10'
import { mod11_generate, mod11_validate } from '../lib/mod/mod11'
import {MAX_KID_LENGTH, MIN_KID_LENGTH} from "../types/types";

// This file gave me a headache, so I re-wrote it.

export const generateKidMod10 = (base: string, length: number) => {
  if (base.length > length)
    throw new Error('Base-length of kid cannot be greater than total length of kid.')

  if (length < MIN_KID_LENGTH || length > MAX_KID_LENGTH)
    throw new Error(`Length of kid must be between ${MIN_KID_LENGTH} and ${MAX_KID_LENGTH}`)

  return mod10(length, base)
}

/**
 * @desc Algorithm is based on {@link https://en.wikipedia.org/wiki/Luhn_algorithm Luhn}. Summarized:
 *  <ol>
 *    <li>Add random digits to the base until it is at length - 1, and remove all NaN from base</li>
 *    <li>Split it into a number-array, and reverse it.</li>
 *    <li>From the right-most digit, and moving left, double the value of every second digit.
 *        If doubling the digits end up in a two-digit number, then swap the number for the sum of the individual digits.</li>
 *    <li>Sum together all the resulting digits.</li>
 *    <li>Find a number that, when added to the result of the previous step, makes the sum divisible by 10. Append that number to the base.</li>
 *    <li>Repeat until desired length.</li>
 *  </ol>
 * @param length The total length of the kid.
 * @param base The base of the kid.
 */
const mod10 = (length: number, base: string): string => {
  const step1: string = mod10_step1(base, length)
  const step2: number[] = mod10_step2(step1)
  const step3: number[] = mod10_step3(step2)
  const step4: number = mod10_step4(step3)
  const step5: string = mod10_step5(step4)
  return step1.concat(step5)
}

const mod10_step1 = (base: string, length: number): string => {
  let ret = base
  const iterations = length - ret.length - 1
  for (let i = 0; i < iterations; i++) {
    ret = ret.concat(Math.floor(Math.random()*10).toString())
  }
  return ret.replace(/[^0-9]+/g, '')
}

const mod10_step2 = (base: string): number[] => {
  return base.split('').map(i => +i).reverse();
}

const mod10_step3 = (digits: number[]): number[] => {
  const step3: number[] = []
  let shouldDouble = true;
  for (let i = 0; i < digits.length; i++) {
    if (shouldDouble) {
      const doubled = digits[i] * 2
      if (doubled > 9) {
        // Because JS we convert the number to a string to get the digits :)
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

const mod10_step4 = (digits: number[]): number => {
  return digits.reduce((a,b) => a+b, 0);
}

const mod10_step5 = (n: number): string => {
  const overflow = n % 10
  const fix = 10 - overflow
  return fix.toString()
}

/**
 * 
 * @param {Object} params
 * @param {number} params.length Length of the kidnumber
 * @param {String[]} params.baseNum The basenumbers
 * @param {'mod10' | 'mod11'} params.modulo  A selector for choosing which modulo function to run
 * @returns {checkModulo} checkModulo with the given parameters
 */
export function generateKid({ length, baseNum, modulo }) {
  const kidLength = parseInt(length)
  let digits

  if (baseNum && baseNum.length > length) {
    throw new Error('Kid basen kan ikke være større enn den totale lengden på kid nummeret')
  }

  if (Number.isNaN(kidLength)) {
    throw new Error('Lengde på kid må være et nummer')
  }

  if (kidLength < 3 || kidLength > 25) {
    throw new Error('Et kid nummer må være mellom 3 og 25 siffer langt.')
  }
  if (baseNum && !Number.isNaN(baseNum)) {
    digits = baseNum.split('').map(num => parseInt(num))
    return validateOrApplyModulo(modulo, { mod10: mod10_generate, mod11: mod11_generate }, kidLength, digits) 
  }

  return validateOrApplyModulo(modulo, { mod10: mod10_generate, mod11: mod11_generate }, kidLength - 1)
}

/**
 * @description This function either generates or validates a kid based on the parameters and modulo. It basically
 * decides which functions to call.
 * @param {'mod10' | 'mod11'} modulo  A selector for choosing which modulo function to run
 * @param {Object} mod mod10/11 generate or validate functions
 * @param  {...any} opts Parameters to either the mod10 or mod11 callback
 * @returns {string | boolean} string or boolean 
 */
function validateOrApplyModulo(modulo, { mod10, mod11 }, ...opts) {
  let finalMod
  switch (modulo) {
    case 'mod10':
      finalMod = mod10(...opts)
      break
    case 'mod11': 
      finalMod = mod11(...opts)
      break;
    default:
      throw new Error('Missing or invalid modulo type')
  } 
  return finalMod
}

/**
 * 
 * @param {String} kid The kid number
 * @param {'mod10' | 'mod11'} modulo  A selector for choosing which modulo function to run
 * @returns {checkModulo} checkModulo with the given parameters
 */
export function validateKid(kid, modulo) {
  return validateOrApplyModulo(modulo, { mod10: mod10_validate, mod11: mod11_validate }, kid)
}