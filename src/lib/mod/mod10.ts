import gen from '../../helpers/gen'
import { validate, getDefaultMod10Weights, applyWeights, generate } from '../../helpers/mod/modCommon'
import {MOD10} from "../../types/types";

/**
 * @param {number[]} digits
 * @param {number[]} weights (optional) 
 */
function mod10(digits: number[], weights: number[] = getDefaultMod10Weights(digits.length)): MOD10 {
  const weightedDigits = applyWeights(digits.reverse(), weights)
  const crossSum = getCrossSum(weightedDigits)
  return (10 - (crossSum % 10)) % 10 == 0 ? 0 : 10 - (crossSum % 10)
}

/**
 * @param {number[]} weighted weighted digits
 */
function getCrossSum(weighted: number[]): number {
  return weighted.reduce((acc, val) => {
    let currentAdd = val
    if (val > 9) {
      currentAdd = ("" + val).split('').map(n => parseInt(n)).reduce((prev, curr) => prev + curr, 0)
    }
    return acc + currentAdd
  }, 0)
}

/**
 * @param {number} length number of digits excluding the control digit
 * @param {number[]} digits (optional)
 * @param {number[]} weights (optional)
 */
export function mod10_generate(length: number, digits: number[] = gen(length), weights: number[] = getDefaultMod10Weights(digits.length)): string {
  return generate({ length, digits, weights, modulo: mod10 });
}

/**
* @param {string} number
* @param {number[]} weights (optional)
*/
export function mod10_validate(number: string, weights: number[] = getDefaultMod10Weights(number.length - 1)): boolean {
  let digits = number.split('').map(val => parseInt(val));
  return validate(digits, weights, mod10);
}