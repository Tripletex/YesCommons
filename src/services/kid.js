import { mod10_generate, mod10_validate } from '../lib/mod/mod10'
import { mod11_generate, mod11_validate } from '../lib/mod/mod11'
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