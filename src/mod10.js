import { applyWeights, gen, validateMod, getDefaultMod10Weights } from './helpers'

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
 * @param {number[]} weights (optional)
 */
export function mod10_generate(length, digits = gen(length)) {
  const extraCiphers = gen(length - (digits.length + 1))
  const mod11Base = [...digits, ...extraCiphers]
  const weights = getDefaultMod10Weights(mod11Base.length)
  const controlDigit = mod10(mod11Base, weights);
  return digits.reduce((acc, val) => acc + val, "") + extraCiphers.join('') + controlDigit;
}

/**
* 
* @param {string} number 
* @param {int[]} weights (optional)
*/
export function mod10_validate(number, weights) {
  let digits = number.split('').map(val => parseInt(val));
  return validateMod(digits, weights, mod10, 'mod10');
}