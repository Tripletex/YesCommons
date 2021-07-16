import { mod11_generate, mod11_validate } from "../lib/mod/mod11";
import gen from "../helpers/gen";
import bankRegistry from "../../bankregistry.json";

/**
 * @returns {{
 *    number: string
 *    bic: string
 *    bank: string
 *    registryNumber: string
 * }} The calculated accountNumber as a string
 */
export function generateAccountNumber(registryNumber) {
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
    const bankRegisterNumber = accountNumber.slice(0, 4);
    const registryEntry = bankRegistry.find(
        (registry) => registry["Bank identifier"] === bankRegisterNumber
    );
    return {
        number: accountNumber,
        bic: registryEntry.BIC,
        bank: registryEntry.Bank,
        registryNumber: registryEntry["Bank identifier"],
    };
}

/**
 *
 * @param {string} accountNumber A string of the account number value
 * @returns Boolean value to see if the checkDigit matches the last cipher in the accountNumber
 */
export function validateAccountNumber(accountNumber) {
    return mod11_validate(accountNumber);
}
