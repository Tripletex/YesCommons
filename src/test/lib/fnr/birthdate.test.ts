import {
  isValidFnrBirthdate,
  isLeapYear,
  validateAndCreateBirthday,
} from '../../../main/lib/fnr/birthdate'

import { assert } from 'chai'

const validBirthdays = [
  '100695',
  '290220',
  '310722',
  '210237',
  '111111',
  '010101',
  '100100',
  '311299',
  '290216',
]

const invalidBirthdays = [
  '310695',
  '290221',
  '320722',
  '410237',
  '111311',
  '010001',
  '000100',
  '312099',
  '29021',
  '172983647981236497823',
]

describe('Testing Birthdays', () => {
  it('Valid Birthdays', () => {
    validBirthdays.forEach((birthday) =>
      assert.equal(isValidFnrBirthdate(birthday), true)
    )
  })

  it('Invalid Birthdays', () => {
    invalidBirthdays.forEach((birthday) =>
      assert.equal(isValidFnrBirthdate(birthday), false)
    )
  })
})

describe('Validate and Create Birthdays', () => {
  it('#validateAndCreateBirthday', () => {
    assert.equal(validateAndCreateBirthday(30, 2, 88), '290288')
  })
  it('#validateAndCreateBirthday', () => {
    assert.equal(validateAndCreateBirthday(30, 2, 89), '280289')
  })
})

describe('Test Leap Years', () => {
  it('Valid Leap Years', () => {
    ;[
      0, 4, 8, 12, 16, 20, 24, 28, 32, 36, 40, 44, 48, 52, 56, 60, 64, 68, 72,
      76, 80, 84, 88, 92, 96,
    ].forEach((year) => assert.equal(isLeapYear(year), true))
  })
  it('Invalid Leap Years', () => {
    ;[-1, 3, 18, 122, 99].forEach((year) =>
      assert.equal(isLeapYear(year), false)
    )
  })
})
