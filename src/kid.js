import { mod10_generate, mod10_validate } from './mod10'

export function generateKidMod10(length, baseNum) {
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
    return mod10_generate(kidLength, digits)
  }
  
  return mod10_generate(kidLength - 1)
}

export function validateKidMod10(kid) {
  return mod10_validate(kid)
}