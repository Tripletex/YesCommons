import { mod11_validate, mod11_generate } from '../lib/mod/mod11'
import gen from '../helpers/gen'
import fnrTypeString from '../helpers/fnr/fnrTypeString'
import { checkValidFødselsdato, checkDatesWhenNotFnr, extractDate } from '../helpers/fnr/date';
import { FNR_TYPES, K1_BASE, K2_BASE } from '../helpers/fnr/constants'
import { genRandomFnrBase } from '../helpers/fnr/genRandomFnrBase'

/**
 * 
 * @param {number[]} initialDigits array of digits used for control cipher generation
 */
function extractControlCiphers(initialDigits) {
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
function generateControlCiphers(baseFnr) {
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
export const isDnumber = (fnr) => fnr.slice(0, 1) >= '4' && (fnr.slice(0, 1) < '7' || (fnr.slice(0, 1) === '7' && fnr.slice(1, 2) <= '1'));
/**
 * 
 * @param {String} fnr The social security number to check
 */
export const isHnumber = (fnr) => (fnr.slice(2, 3) === '4' && fnr.slice(3, 4) >= '1') || (fnr.slice(2, 3) === '5' && fnr.slice(3, 4) <= '2');
/**
 * 
 * @param {String} fnr The social security number to check
 */  
export const isFHnumber = (fnr) => fnr.slice(0, 1) >= '8';

/**
 * 
 * @param {String} fnr The social security number to check
 * @param {String} fnrType string indicator of fnr
 */
export function validateFnr(fnr, fnrType) {
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
  
  const isValid = checkValidFødselsdato({ fnr: fnrToCheck.slice(0, 9), fnrType }) 
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
    ...(result === true && fnrType !== FNR_TYPES.fhnr && parseFnr(fnr, fnrType))
  }
}

/**
 * @param {Object} params
 * @param {number[]} params.initialBase array of base numbers used for generation of fnr, ${genRandomFnrBase} is used by default
 * @param {String} params.fnrType string indicator of fnr
 * @returns {String} A norwegian fødselsnummer/d-nummer/h-nummer/fh-nummer
 */
export function generateFnr({ initialBase = genRandomFnrBase(), fnrType = FNR_TYPES.fnr } = {}) {
  let firstCipher
  let base = [...initialBase]
  const currentType = FNR_TYPES[fnrType]

  if (currentType === FNR_TYPES.fnr && !checkValidFødselsdato({ fnr: base.join(''), fnrType: currentType })) {
    return generateFnr({ fnrType: FNR_TYPES.fnr })
  }

  if (currentType === FNR_TYPES.dnr) {
    const [,...rest] = initialBase
    firstCipher = Math.floor(Math.random () * 7) + 4
    base = [firstCipher, ...rest]
  }

  if (currentType === FNR_TYPES.hnr) {
    const [d1, d2,, ...rest] = initialBase
    base = [d1, d2, Math.floor(Math.random() * 2) + 4, ...rest]
  }

  if (currentType === FNR_TYPES.fhnr) {
    firstCipher = 8 + (Math.floor(Math.random () * 2))
    base = [firstCipher, ...gen(8)]
  }

  const baseFnr = base.join('')
  const { success, controlCiphers } = generateControlCiphers(baseFnr)
  if (!success) {
    return generateFnr({ fnrType: currentType })
  }
  const fnr = `${baseFnr}${controlCiphers}`
  const isValid = validateFnr(fnr, currentType).success
  if (!isValid) {
    return generateFnr({ fnrType: currentType })
  }
  return {
    fnr,
    type: currentType,
    typeString: fnrTypeString(currentType),
    ...(isValid === true && currentType !== FNR_TYPES.fhnr && parseFnr(fnr, currentType))
  }
}

/**
 * 
 * @description This function should only be used when the fnr has passed the validation
 * @param {String} fnr the fødselsnummer (only the nine first ciphers are used) 
 * @param {String} fnrType string indicator of fnr
 */
export function parseFnr(fnr, fnrType) {
  const { year, day, month, date, gender } = extractDate(fnr, fnrType)
  return {
    gender,
    year,
    day,
    month,
    date,
  }
}