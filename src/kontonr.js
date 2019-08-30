import { getCheckDigit } from './mod11';

/**
 * @returns {string} The calculated accountNumber as a string
 */
export default function generateAccountNumber() {
  let accountNumber = '';
  for (let i = 0; i < 10; i++) {
    accountNumber += Math.floor(Math.random() * 10);
  }

  const weighted = getCheckDigit(accountNumber);

  if (weighted == 10) {
    return generateAccountNumber();
  }

  return accountNumber + weighted;
}

/**
 *
 * @param {string} accountNumber A string of the account number value
 * @returns Boolean value to see if the checkDigit matches the last cipher in the accountNumber
 */
export function validateAccountNumber(accountNumber) {
  const checkDigit = getCheckDigit(accountNumber);
  const lastCipher = parseInt(accountNumber[accountNumber.length - 1]);

  return checkDigit === lastCipher;
}
