import { applyWeights, gen, validateMod, getDefaultMod11Weights } from './helpers'

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
 * @param {number[]} weights (optional)
 */
export function mod11_generate(length, weights = getDefaultMod11Weights(length)) {
    if (!weights.length || !Array.isArray(weights)) {
        return;
    }

    const digits = gen(length);
    const controlDigit = mod11(digits, weights);

    return digits.reduce((acc, val) => acc + val, "") + controlDigit;
}

/**
 * 
 * @param {string} number 
 * @param {number[]} weights (optional)
 */
export function mod11_validate(number, weights) {
    let digits = number.split('').map(val => parseInt(val));
    return validateMod(digits, weights, mod11, 'mod11');
}