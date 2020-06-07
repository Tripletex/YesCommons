/**
 * @param {int} n how many digits to generate
 */
export default function gen(n) {
  return Array.from({length: n}, () => Math.floor(Math.random()*10));
}