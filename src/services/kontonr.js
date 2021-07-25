import { mod11_generate, mod11_validate } from "../lib/mod/mod11";
import gen from "../helpers/gen";
import bankRegistry from "../../bankregistry.json";

function getRandomRegistryNumber() {
    const registryEntry = bankRegistry[Math.floor(Math.random() * bankRegistry.length)];
    return registryEntry["Bank identifier"];
}

/**
 * @returns {{
 *    number: string
 *    bic: string
 *    bank: string
 *    registryNumber: string
 * }} The calculated accountNumber as a string
 */
export function generateAccountNumber(registryNumber = getRandomRegistryNumber()) {
    const registryNumberEntriesAsNumber = registryNumber
        .split("")
        .map((n) => parseInt(n));
    const accountNumber = mod11_generate(10, [
        ...registryNumberEntriesAsNumber,
        ...gen(6),
    ]);
    if (accountNumber[accountNumber.length - 1] === "-") {
        return generateAccountNumber(registryNumber);
    }
    const registryEntry = getBankRegistryEntryByAccountNumber(accountNumber);
    return {
        number: accountNumber,
        bic: registryEntry.BIC,
        bank: registryEntry.Bank,
        registryNumber: registryEntry["Bank identifier"],
    };
}

/**
 * Takes in the account numer and returns which bank the given accountNumber belongs to
 *
 * @param accountNumber {string} the account number
 *
 * @returns {{
 *    bic: string
 *    bank: string
 *    registryNumber: string
 * }} The registry entry
 */
export function getBankRegistryEntryByAccountNumber(accountNumber) {
    const registryNumber = getRegistryNumber(accountNumber);
    return bankRegistry.find(
        (registry) => registry["Bank identifier"] === registryNumber
    );
}

function getRegistryNumber(accountNumber) {
    return accountNumber.slice(0, 4);
}

/**
 *
 * @param {string} accountNumber A string of the account number value
 * @returns Boolean value to see if the checkDigit matches the last cipher in the accountNumber
 */
export function validateAccountNumber(accountNumber) {
    return mod11_validate(accountNumber);
}
