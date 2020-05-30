import { mod11_generate, mod11_validate } from './mod11';

/**
 * @returns {string} The calculated accountNumber as a string
 */
export default function generateAccountNumber() {
  return mod11_generate(10)
}

/**
 *
 * @param {string} accountNumber A string of the account number value
 * @returns Boolean value to see if the checkDigit matches the last cipher in the accountNumber
 */
export function validateAccountNumber(accountNumber) {
  return mod11_validate(accountNumber)
}