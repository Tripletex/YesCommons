
import {mod11} from "../lib/mod/mod11";
import {validateKid_mod11} from "./kid";

/**
 * @returns {string} The calculated accountNumber as a string
 */
export function generateAccountNumber() {
  const accountNumber = mod11('',10);
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
  return validateKid_mod11(accountNumber)
}