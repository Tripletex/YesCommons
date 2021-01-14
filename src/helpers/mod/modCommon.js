import gen from '../gen'

/**
 * 
 * @param {number[]} digits 
 * @param {number[]} weights 
 */
export function applyWeights(digits, weights) {
  return digits.map((val, idx) => val * weights[idx]);
}

/**
 * @param {number} n number of digits 
 */
export function getDefaultMod10Weights(n) {
  const weighted = []

  for (let i = 0; i < n; i++) {
    if (i % 2 === 0) {
      weighted.push(2)
    } else {
      weighted.push(1)
    }
  }
  return weighted
}

/**
 * Derived from observing:
 * - weights goes from 7 down to 2 in cycles
 * - the last weight is always 2
 * - [7..2] == [5..0] + 2
 * 
 * Thus weight for the 'n'th number is:
 * weight(n) = ((n + a) % 6) + 2
 * Find constant 'a' by solving for the 0th digit (ie least significant digit):
 * ((0 + a) % 6) + 2  ==  2
 *  => a == 6
 * 
 * @param {number} n: number of digits
 */
export function getDefaultMod11Weights(n) {
  const weightOf = idx => ((idx + 6) % 6) + 2;

  return Array
      .from({length: n}, (_, idx) => idx) // => [0, 1, .., n-1]
      .reverse()                          // => [n-1, .., 1, 0]
      .map(val => weightOf(val));         // => [w(n-1), .., 3, 2]
}

/**
 * 
 * @param {number[]} digits all the digits including the control digit
 * @param {number[]} weights
 * @param {(digits: number[], weights: number[]) => number} modulo mod10 or mod11 function
 */
export function validate(digits, weights, modulo) {
  const checkedDigits = [...digits]
  let givenControl = checkedDigits.pop();
  return givenControl === modulo(checkedDigits, weights);
}

/**
 * 
 * @param {number} length 
 * @param {number} digits 
 * @param {number[]} weights
 * @param {(digits: number[], weights: number[]) => number} modulo mod10 or mod11 function
 */
export function generate({ length, digits, weights, modulo }) {
  const extraCiphers = gen(length - (digits.length + 1));
  const modBase = [...digits, ...extraCiphers];
  const controlDigit = weights.length ? modulo(modBase, weights) : modulo(modBase)
  return digits.reduce((acc, val) => acc + val, "") + extraCiphers.join('') + controlDigit;
}