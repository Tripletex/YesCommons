import { applyWeights, validate, getDefaultMod11Weights, generate } from '../../helpers/mod/modCommon'
import gen from '../../helpers/gen'
import {MOD11, ModuloFunction} from "../../types/types";

/**
 * @param {number[]} digits
 * @param {number[]} weights (optional) 
 */
function mod11(digits: number[], weights: number[] = getDefaultMod11Weights(digits.length)): MOD11   {
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
 * @param {number[]} weights (optional) 
 */
export function mod11_generate(length: number, digits: number[] = gen(length), weights: number[] = getDefaultMod11Weights(digits.length)) {
    return generate({ length, digits, weights, modulo: mod11})
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