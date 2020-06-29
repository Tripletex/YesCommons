import gen from './helpers/gen'
import { validate, getDefaultMod10Weights, applyWeights, generate } from './helpers/modCommon'

function mod10(digits, weights = getDefaultMod10Weights(digits.length)) {
  const weightedDigits = applyWeights(digits.reverse(), weights)
  const tverrsum = getTverrsum(weightedDigits)
  return (10 - (tverrsum % 10)) % 10 == 0 ? 0 : 10 - (tverrsum % 10)
}

/**
 * 
 * @param {number[]} weighted weighted digits
 */
function getTverrsum(weighted) {
  return weighted.reduce((acc, val) => {
    let currentAdd = val
    if (val > 9) {
      currentAdd = ("" + val).split('').map(n => parseInt(n)).reduce((prev, curr) => prev + curr, 0)
    }
    return acc + currentAdd
  }, 0)
}

/**
 * 
 * @param {number} length number of digits excluding the control digit
 * @param {number[]} digits (optional)
 */
export function mod10_generate(length, digits = gen(length)) {
  return generate(length, digits, mod10);
}

/**
* 
* @param {string} number 
* @param {number[]} weights (optional)
*/
export function mod10_validate(number, weights = getDefaultMod10Weights(number.length)) {
  let digits = number.split('').map(val => parseInt(val));
  return validate(digits, weights, mod10);
}