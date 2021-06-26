import {luhn_step1, luhn_step2, luhn_step3_mod11, luhn_step4, luhn_step5_mod11} from "./modSteps";

/**
 * @desc Algorithm is based on {@link https://en.wikipedia.org/wiki/Luhn_algorithm Luhn}, altered to be {@link https://no.wikipedia.org/wiki/MOD11 MOD11-based}.
 * Summarized:
 *  <ol>
 *    <li>Add random digits to the base until kid is at length - 1, and remove all NaN from kid.</li>
 *    <li>Split it into a number-array, and reverse it.</li>
 *    <li>From the right-most digit, and moving left, multiply the digit with the next number in the weight-list [2, 3, ..., 7, 2, 3, ...].</li>
 *    <li>Sum together all the resulting digits.</li>
 *    <li>Find a number that, when added to the result of the previous step, makes the sum divisible by 11. Append that number to the base.</li>
 *  </ol>
 * @param base The base of the kid.
 * @param length The total length of the kid.
 * @return kid A new randomly generated kid, based on the MOD11-algorithm.
 *
 * @author Henrik Klev
 * @date 2021-06-06
 */
export const mod11 = (base: string, length: number): string => {
    const step1: string = luhn_step1(base, length)
    const step2: number[] = luhn_step2(step1)
    const step3: number[] = luhn_step3_mod11(step2)
    const step4: number = luhn_step4(step3)
    const step5: string = luhn_step5_mod11(step4)
    if (step5 === '-') // These are 'valid' based on the MOD11-algorithm, but generally not accepted in accounting.
        return mod11(base, length)
    return step1.concat(step5)
}


