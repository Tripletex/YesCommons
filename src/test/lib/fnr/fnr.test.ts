import { generateDnumber } from '../../../main/services/fnr'
import { validateFnr } from '../../../main/services/fnr'
import { isPossiblyDnumber } from '../../../main/lib/fnr/fnr'

import { Gender } from '../../../main/types/types'

import { assert } from 'chai'

const validDnumbers: string[] = [
  '53075114482',
  '44040186651',
  '69112803076',
  '52098997857',
  '58072542434',
  '68048596278',
  '70121290241',
  '71102311455',
]

const invalidDnumbers: string[] = [
  '73075114499',
  '23028538706',
  '70021988054',
  '13022335476',
  '94021670767',
  '95100618289',
  '60135838395',
  '71068106466',
]

describe('Testing D-numbers', () => {
  describe('Valid D-Numbers', () => {
    it('Validate FNR D-numbers', () => {
      validDnumbers.forEach((dNumber) => {
        const result = validateFnr(dNumber)
        assert.deepEqual(result.types, ['D-number'], JSON.stringify(result))
      })
    })

    it('Validate Possible D-numbers', () => {
      validDnumbers.forEach((dNumber) => {
        assert.equal(isPossiblyDnumber(dNumber), true, dNumber)
      })
    })
  })
  describe('Invalid D-Numbers', () => {
    it('Invalidate FNR D-numbers', () => {
      invalidDnumbers.forEach((dNumber) => {
        const result = validateFnr(dNumber)
        assert.deepEqual(result.types, [], JSON.stringify(result))
      })
    })

    it('Invalidate Possible D-numbers', () => {
      invalidDnumbers.forEach((dNumber) => {
        assert.equal(isPossiblyDnumber(dNumber), false, dNumber)
      })
    })
  })

  describe('Generating and Testing D-Numbers', () => {
    it('Run 100 iterations of generation and validation of male D-Numbers', () => {
      for (let i = 0; i < 100; i++) {
        const dNumber = generateDnumber(Gender.male)
        const result = validateFnr(dNumber)
        assert.deepEqual(result.types, ['D-number'], JSON.stringify(result))
      }
    })
    it('Run 100 iterations of generation and validation of female D-Numbers', () => {
      for (let i = 0; i < 100; i++) {
        const dNumber = generateDnumber(Gender.female)
        const result = validateFnr(dNumber)
        assert.deepEqual(result.types, ['D-number'], JSON.stringify(result))
      }
    })
  })
})
