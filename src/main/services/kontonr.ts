import { mod11 } from '../lib/mod/mod11'
import { validateKid_mod11 } from './kid'
import bankRegistry from '../../../bankregistry.json'

export function generateAccountNumber(
  registryNumber = getRandomRegistryNumber()
) {
  const accountNumber = mod11(registryNumber, 11)
  if (accountNumber[accountNumber.length - 1] === '-') {
    return generateAccountNumber(registryNumber)
  }
  const registryEntry = getBankRegistryEntryByAccountNumber(accountNumber)
  return {
    number: accountNumber,
    bic: registryEntry.bic,
    bank: registryEntry.bank,
    registryNumber: registryEntry.registryNumber,
  }
}

export function validateAccountNumber(accountNumber) {
  return validateKid_mod11(accountNumber)
}

function getRandomRegistryNumber() {
  const registryEntry =
    bankRegistry[Math.floor(Math.random() * bankRegistry.length)]
  return registryEntry['Bank identifier']
}

export function getBankRegistryEntryByAccountNumber(accountNumber) {
  const registryNumber = getRegistryNumber(accountNumber)
  const registryEntry = bankRegistry.find(
    (registry) => registry['Bank identifier'] === registryNumber
  )
  if (!registryEntry) {
    return {
      bank: 'Ukjent',
      bic: 'N/A',
      registryNumber,
    }
  }
  return {
    bank: registryEntry.Bank,
    bic: registryEntry.BIC,
    registryNumber: registryEntry['Bank identifier'],
  }
}

function getRegistryNumber(accountNumber: string) {
  return accountNumber.slice(0, 4)
}
