import { mod11_validate, mod11_generate } from '../lib/mod/mod11'
import gen from '../helpers/gen'
import fnrTypeString from '../helpers/fnr/fnrTypeString'
import { checkValidDateOfBirth, checkDatesWhenNotFnr, extractDate } from '../helpers/fnr/date';
import { FNR_TYPES, K1_BASE, K2_BASE } from '../helpers/fnr/constants'
import { genRandomFnrBase } from '../helpers/fnr/genRandomFnrBase'
import {
  ControlCiphers,
  ControlCipherWrapper,
  ErrorMessage,
  ExtractedDate,
  Gender,
  ValidateFnrWrapper
} from "../types/types";

/**
 * @param {number[]} initialDigits array of digits used for control cipher generation
 */
function extractControlCiphers(initialDigits: number[]): ControlCiphers {
  let digits = [...initialDigits];
  const finalBase = mod11_generate(digits.length, digits, K1_BASE);
  if (finalBase.includes('-')) {
    return
  }
  digits = [...finalBase.split('').map(num => parseInt(num))]
  const fnr = mod11_generate(digits.length, digits, K2_BASE);
  if (fnr.includes('-')) {
    return
  }
  const [,,,,,,,,,k1, k2] = fnr.split('').map(n => parseInt(n))
  return { k1, k2, ciphers: initialDigits };
}

/**
 * 
 * @param {String} baseFnr The base social security number to generate ciphers
 */
function generateControlCiphers(baseFnr: string): ControlCipherWrapper | ErrorMessage {
  if (typeof baseFnr !== 'string') {
    return {
      success: false,
      msg: 'Input must be a string'
    }
  }

  if (baseFnr.trim().length !== 9) {
    return {
      success: false,
      msg: 'baseFnr should only be 9 ciphers'
    }
  }

  const base = baseFnr.trim().split('').map((num) => parseInt(num, 10));
  const result = extractControlCiphers(base);
  if (!result) {
    return {
      success: false,
      msg: 'Fødselsnummer cannot contain a -'
    }
  }
  const { k1, k2 } = result
  if (k1 > 9 || k2 > 9) {
    return {
      success: false,
      msg: 'control cipher(s) to large'
    }
  }
  return {
    success: true,
    controlCiphers: `${k1}${k2}`,
  }
}

/**
 * 
 * @param {String} fnr The social security number to check
 */
export const isDnumber = (fnr: string): boolean => fnr.slice(0, 1) >= '4' && (fnr.slice(0, 1) < '7' || (fnr.slice(0, 1) === '7' && fnr.slice(1, 2) <= '1'));
/**
 * 
 * @param {String} fnr The social security number to check
 */
export const isHnumber = (fnr: string): boolean => (fnr.slice(2, 3) === '4' && fnr.slice(3, 4) >= '1') || (fnr.slice(2, 3) === '5' && fnr.slice(3, 4) <= '2');
/**
 * 
 * @param {String} fnr The social security number to check
 */  
export const isFHnumber = (fnr: string): boolean => fnr.slice(0, 1) >= '8';

/**
 * 
 * @param {String} fnr The social security number to check
 * @param {String} fnrType string indicator of fnr
 */
export function validateFnr(fnr: string, fnrType: FNR_TYPES): ValidateFnrWrapper | ErrorMessage {
  if (typeof fnr !== 'string') {
    return {
      success: false,
      msg: 'Input must be a string'
    }
  }

  if (fnr.trim().length !== 11) {
    return {
      success: false,
      msg: 'Fødselsnummer should only have 11 ciphers'
    }
  }

  const fnrToCheck = fnr.trim();

  // FH-numbers do not contain identity information, which makes it uneccesairy to check dates and stuff
  // Only modulo calculation are valid in this case
  if (fnrType === FNR_TYPES.fhnr) {
    const result = checkDatesWhenNotFnr(fnrToCheck.slice(0, 2), fnrToCheck.slice(2,4), { fhnumber: isFHnumber(fnrToCheck) }) 
    && mod11_validate(fnrToCheck.slice(0, 10), K1_BASE) 
    && mod11_validate(fnrToCheck, K2_BASE)
    return {
      success: result,
      msg: !result ? `The ${fnrType} did not pass validation` : `This is a valid ${fnrType}!`,
      fnr: fnrToCheck,
      type: fnrType,
      typeString: fnrTypeString(fnrType),
    }
  }
  
  const isValid = checkValidDateOfBirth({ fnr: fnrToCheck.slice(0, 9), fnrType })
    && checkDatesWhenNotFnr(fnrToCheck.slice(0, 2), fnrToCheck.slice(2,4), { dnumber: isDnumber(fnrToCheck), hnumber: isHnumber(fnrToCheck) })
  const result = isValid
    && mod11_validate(fnrToCheck.slice(0, 10), K1_BASE) 
    && mod11_validate(fnrToCheck, K2_BASE)

  return {
    success: result,
    msg: !result ? 'The fnr did not pass validation' : 'This is a valid fnr!',
    fnr: fnrToCheck,
    type: fnrType,
    typeString: fnrTypeString(fnrType),
    ...(result === true && parseFnr(fnr, fnrType))
  }
}

export const generateFnr = (gender: Gender): string => {
  const birthday = generateRandomBirthDate();
  const personNumber = generateRandomPersonNumber(gender)

  return birthday.concat(personNumber)
}

export const generateRandomPersonNumber = (gender: Gender): string => {
  return '12345'
}

export const generateRandomBirthDate = (): string => {
  const day = generateRandomIntInRange(1, 31)
  const month = generateRandomIntInRange(1, 13)
  const year = generateRandomIntInRange(1920, 2022)

  return validateAndCreateBirthday(day, month, year);
}

const validateAndCreateBirthday = (day: number, month: number, year: number): string => {
  if (month === 2) {
    if (day > 28) (isLeapYear(year)) ? day = 29 : day = 28
  }
  if (isDayToBigForMonth) day = 30
  return [day, month, year].join()
}

const isDayToBigForMonth = (day: number, month: number, year?: number): boolean => {
  switch (month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return day > 31
    case 2:
      return (year && isLeapYear(year)) ? day > 29 : day > 28
    case 4:
    case 6:
    case 9:
    case 11:
      return day > 30
    default:
      return false
  }
}

/**
 * Checks if the given year is a leap year.
 * Courtesy of <a href="https://stackoverflow.com/questions/16353211/check-if-year-is-leap-year-in-javascript">StackOverflow</a>.
 * @param year the year to check
 */
const isLeapYear = (year: number): boolean => {
  return ((year % 4 == 0) && (year % 100 != 0)) || (year % 400 == 0)
}

const generateRandomIntInRange = (inclusiveMin: number, exclusiveMax: number): number => {
  inclusiveMin = Math.ceil(inclusiveMin);
  exclusiveMax = Math.floor(exclusiveMax);
  return Math.floor(Math.random() * (exclusiveMax - inclusiveMin + 1)) + inclusiveMin;
}

/**
 * 
 * @description This function should only be used when the fnr has passed the validation
 * @param {String} fnr the fødselsnummer (only the nine first ciphers are used) 
 * @param {String} fnrType string indicator of fnr
 */
export function parseFnr(fnr: string, fnrType: string): ExtractedDate {
  const { year, day, month, date, gender } = extractDate(fnr, fnrType)
  return {
    gender,
    year,
    day,
    month,
    date,
  }
}