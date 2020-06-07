/**
 * 
 * @param {int[]} digits 
 * @param {int[]} weights 
 */
export default function applyWeights(digits, weights) {
  return digits.map((val, idx) => val * weights[idx]);
}