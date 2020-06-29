import { applyWeights, validate, getDefaultMod11Weights, generate } from './helpers/modCommon'
import gen from './helpers/gen'

/**
 * @param {number[]} digits
 * @param {number[]} weights (optional) 
 */
function mod11(digits, weights = getDefaultMod11Weights(digits.length)) {
    const weightedDigits = applyWeights(digits, weights)
    const controlDigit = 11 - (weightedDigits.reduce((acc, val) => acc + val, 0) % 11);
    if (controlDigit === 11) {
        return 0;
    }
    
    if (controlDigit === 10) {
        return '-';
    }

    return controlDigit;
}

/**
 * 
 * @param {number} length number of digits excluding the control digit
 * @param {number[]} digits (optional)
 */
export function mod11_generate(length, digits = gen(length)) {
    return generate(length, digits, mod11);
}

/**
 * 
 * @param {string} number 
 * @param {number[]} weights (optional)
 */
export function mod11_validate(number, weights = getDefaultMod11Weights(number.length - 1)) {
    let digits = number.split('').map(val => parseInt(val));
    return validate(digits, weights, mod11);
}