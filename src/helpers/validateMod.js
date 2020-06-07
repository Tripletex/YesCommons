import { getDefaultMod10Weights, getDefaultMod11Weights} from '.'
/**
 * 
 * @param {number[]} digits all the digits including the control digit
 * @param {number[]} weights (optional)
 * @param {(digits: number[], weights: number[]) => number} modulo mod10 or mod11 function
 * @param {'mod10' | 'mod11'} modType the type of modulo calculation used
 */
export default function validate(digits, weights, modulo, modType) {
  let givenControl = digits.pop();
  if (!weights) {
    switch (modType) {
      case 'mod10': 
        weights = getDefaultMod10Weights(digits.length)
        break
      case 'mod11': 
        weights = getDefaultMod11Weights(digits.length)
        break
      default:
        throw new Error('Unexpected or invalid mod function')
    }
  }
  return givenControl === modulo(digits, weights);
}
