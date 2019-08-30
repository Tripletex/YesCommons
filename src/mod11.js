const MOD11weights = [2, 3, 4, 5, 6, 7, 2, 3, 4, 5];

/**
 *
 * @param {string} accountNumber A string of the account number value
 * @returns {string} The account number reversed and removed of non-numerical chars
 */
function getReversedAccountNumber(accountNumber) {
  const num = accountNumber
    .replace(/\D+/g, '')
    .split('')
    .reverse()
    .join('');

  return num;
}

/**
 *
 * @param {string} accountNumber A string of the account number value
 * @returns {number} Function call to mod11 --> integer
 */
export function getCheckDigit(accountNumber) {
  let reversedAccountNumber = getReversedAccountNumber(accountNumber);
  return mod11(reversedAccountNumber);
}

/**
 *
 * @param {string} accountNumber A string of the account number value
 * @returns {number} The integer from the modulo 11 calculation
 */
function mod11(accountNumber) {
  let tempArr = accountNumber.split('');

  if (tempArr.length === 11) {
    tempArr.shift();
  }

  const sum = applyWeights(tempArr);

  return sum % 11 == 0 ? 0 : 11 - (sum % 11);
}

/**
 *
 * @param {string[]} accountNumberArray
 * @returns {number} The weighted numbers used to calculate the modulo
 */
function applyWeights(accountNumberArray) {
  return accountNumberArray
    .map(num => parseInt(num))

    .map((num, index) => num * MOD11weights[index])
    .reduce((acc, val) => acc + val);
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
 * @param n: number of digits
 * @returns [ 4, 3, 2, 7, 6, 5, 4, 3, 2 ]
 */
function getDefaultWeights(n) {
  const weightOf = idx => ((idx + 6) % 6) + 2;

  return Array.from({ length: n }, (val, idx) => idx) // => [0, 1, .., n-1]
    .reverse() // => [n-1, .., 1, 0]
    .map(val => weightOf(val)); // => [w(n-1), .., 3, 2]
}
