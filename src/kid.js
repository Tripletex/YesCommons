import { mod10_generate, mod10_validate } from './mod10'
import { mod11_generate, mod11_validate } from './mod11'

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
    return checkModulo(modulo, { mod10: mod10_generate, mod11: mod11_generate }, kidLength, digits) 
  }

  return checkModulo(modulo, { mod10: mod10_generate, mod11: mod11_generate }, kidLength - 1)
}

function checkModulo(modulo, { mod10, mod11 }, ...opts) {
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

export function validateKid(kid, modulo) {
  return checkModulo(modulo, { mod10: mod10_validate, mod11: mod11_validate }, kid)
}