import { mod11 } from '../lib/mod/mod11'
import { validateKid_mod11 } from './kid'

export function generateAccountNumber() {
  const accountNumber = mod11('', 11)
  if (accountNumber[accountNumber.length - 1] === '-') {
    return generateAccountNumber()
  }
  return accountNumber
}

export function validateAccountNumber(accountNumber) {
  return validateKid_mod11(accountNumber)
}
