/**
 * Generates an array of length <code>n</code> containing
 * a single-digit integers from 0-9.
 *
 * @param {int} n how many digits to generate
 * @return number[] array containing random integers from 0-9
 */
const gen = (n: number): number[] => {
  return Array.from({length: n}, () => Math.floor(Math.random()*10));
};

export default gen;