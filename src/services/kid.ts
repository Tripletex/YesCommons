import { MAX_KID_LENGTH, MIN_KID_LENGTH } from "../types/types";
import { luhn_step2, luhn_step3_mod10, luhn_step3_mod11, luhn_step4 } from "../lib/mod/modSteps";
import { mod11 } from "../lib/mod/mod11";
import { mod10 } from "../lib/mod/mod10";

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
  else if (controlDigit === '0') {
    return 11 - (sum % 11) === 11
  }
  else
    return 11 - (sum % 11) === +controlDigit
}

const kidInputValidation = (base: string, length: number): void => {
  if (base.length >= length)
    throw new Error('Base-length of kid cannot be greater than, or equal to, total length of kid.')

  if (length < MIN_KID_LENGTH || length > MAX_KID_LENGTH)
    throw new Error(`Length of kid must be between ${MIN_KID_LENGTH} and ${MAX_KID_LENGTH}`)
}
