/**
 * @param {int} n how many digits to generate
 */
function gen(n) {
    return Array.from({length: n}, () => Math.floor(Math.random()*10));
}

/**
 * NOTE: caller of this function must handle the case where this function returns 10.
 *       typically 10 should be '-' when used as control digit.
 * @param {int[]} weightedDigits 
 */
function mod11(weightedDigits) {
    let controlDigit = 11 - (weightedDigits.reduce((acc, val) => acc + val, 0) % 11);
    if (controlDigit === 11)
        return 0;
    return controlDigit;
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
 */
function getDefaultWeights(n) {
    const weightOf = idx => ((idx + 6) % 6) + 2;

    return Array
            .from({length: n}, (val, idx) => idx) // => [0, 1, .., n-1]
            .reverse()                            // => [n-1, .., 1, 0]
            .map(val => weightOf(val));           // => [w(n-1), .., 3, 2]
}

/**
 * 
 * @param {int[]} digits 
 * @param {int[]} weights 
 */
function applyWeights(digits, weights) {
    return digits.map((val, idx) => val * weights[idx]);
}

/**
 * NOTE: does not handle the case where controldigit == 10.
 * 
 * @param {int[]} digits all the digits including the control digit
 * @param {int[]} weights (optional)
 */
function validate(digits, weights) {
    let givenControl = digits.pop();
    
    if (weights == undefined) {
        weights = getDefaultWeights(digits.length);
    }

    return givenControl === mod11(applyWeights(digits, weights));
}

/**
 * 
 * @param {int} length number of digits excluding the control digit
 * @param {int[]} weights (optional)
 */
export default function mod11_generate(length, weights) {
    if (weights == undefined) {
        weights = getDefaultWeights(length);
    }

    let digits = null;
    let controlDigit = null;
    do {
        digits = gen(length);
        controlDigit = mod11(applyWeights(digits, weights));
    } while (controlDigit === 10);

    return digits.reduce((acc, val) => acc + val, "") + controlDigit;
}

/**
 * 
 * @param {string} number 
 * @param {int[]} weights (optional)
 */
export default function mod11_validate(number, weights) {
    let digits = number.split('').map(val => Number(val));
    return validate(digits, weights);
}
