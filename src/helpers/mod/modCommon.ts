import gen from '../gen'
import {MOD10, MOD11, ModuloFunction} from "../../types/types";

/**
 * Multiplies every i-th element of <code>digits</code>
 * with the i-th element of <code>weights</code>.
 * It is assumes that <code>weights</code> is
 * <i>at least</i> as large as <code>digits</code>.
 *
 * Function does not mutate either element.
 *
 * @param {number[]} digits array containing elements that will receive a weight.
 * @param {number[]} weights array containing <i>at least</i> as many elements as <code>digits</code>.
 * @return {number[]} new array same length as <code>digits</code>.
 */
export function applyWeights(digits: number[], weights: number[]): number[] {
  return digits.map((val: number, idx: number) => val * weights[idx]);
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
export function getDefaultMod11Weights(n: number): number[] {
  const weightOf = idx => ((idx + 6) % 6) + 2;

  return Array
      .from({length: n}, (_, idx) => idx) // => [0, 1, .., n-1]
      .reverse()                          // => [n-1, .., 1, 0]
      .map(val => weightOf(val));         // => [w(n-1), .., 3, 2]
}


/**
 * @param {number[]} digits all the digits including the control digit
 * @param {number[]} weights
 * @param {(digits: number[], weights: number[]) => number} modulo mod10 or mod11 function
 */
export function validate(digits: number[], weights: number[], modulo: ModuloFunction) {
  const checkedDigits = [...digits]
  let givenControl = checkedDigits.pop();
  return givenControl === modulo(checkedDigits, weights);
}

type GenerateObject = {
  length: number,
  digits: number[],
  weights: number[],
  modulo: ModuloFunction
};
/**
 * 
 * @param {number} length 
 * @param {number} digits 
 * @param {number[]} weights
 * @param {(digits: number[], weights: number[]) => number} modulo mod10 or mod11 function
 */
export function generate({ length, digits, weights, modulo }: GenerateObject): string {
  const extraCiphers: number[] = gen(length - (digits.length + 1));
  const modBase: number[] = [...digits, ...extraCiphers];
  const controlDigit: MOD10 | MOD11 = weights.length ? modulo(modBase, weights) : modulo(modBase)
  return digits.reduce((acc, val) => acc + val, "") + extraCiphers.join('') + controlDigit;
}