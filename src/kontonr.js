import { mod11_generate, mod11_validate } from './mod11';

/**
 * @returns {string} The calculated accountNumber as a string
 */
export default function generateAccountNumber() {
  const accountNumber = mod11_generate(10);
  if (accountNumber[accountNumber.length-1] === '-') {
    return generateAccountNumber();
  }
  return accountNumber;
}

/**
 *
 * @param {string} accountNumber A string of the account number value
 * @returns Boolean value to see if the checkDigit matches the last cipher in the accountNumber
 */
export function validateAccountNumber(accountNumber) {
  return mod11_validate(accountNumber)
}