import { Gender, ValidateFnrWrapper } from '../../types/types'
import { generateRandomIntInRange } from '../util/numberutil'
import { isValidFnrBirthdate, isYearInRange } from './birthdate'

export const isPossiblyDnumber = (fnr: string): boolean => {
  const day = +fnr.slice(0, 2)
  const birthdate = day - 40 + fnr.slice(2, 6)
  return isValidFnrBirthdate(birthdate)
}

export const isPossiblyHnumber = (fnr: string): boolean => {
  const month = +fnr.slice(2, 4)
  const birthdate = fnr.slice(0, 2) + (month - 40) + fnr.slice(4, 6)
  return isValidFnrBirthdate(birthdate)
}

export const isPossiblyFHnumber = (fnr: string): boolean => {
  return fnr[0] === '8' || fnr[0] === '9'
}

export const createValidateFnrReturnObject = (
  success: boolean,
  msg: string,
  fnr: string
): ValidateFnrWrapper => {
  return { success, msg, fnr }
}

export const generateControlDigits = (partialFnr: string): string => {
  if (partialFnr.length != 9)
    throw new Error('Invalid partial FNR. Expected format is DDmmYYiii.')
  const k1 = generateFirstControlDigit(partialFnr)
  const k2 = generateSecondControlDigit(partialFnr, k1)
  return k1 + k2
}

export const generateFirstControlDigit = (partialFnr: string): string => {
  const weights = [3, 7, 6, 1, 8, 9, 4, 5, 2]
  return generateControlDigitsCommon(partialFnr, weights)
}

export const generateSecondControlDigit = (
  partialFnr: string,
  firstControlDigit: string
): string => {
  const weights = [5, 4, 3, 2, 7, 6, 5, 4, 3, 2]
  return generateControlDigitsCommon(partialFnr + firstControlDigit, weights)
}

export const generateControlDigitsCommon = (
  partialFnr: string,
  weights: number[]
): string => {
  let result = 0
  for (let i = 0; i < partialFnr.length; i++) {
    result += +partialFnr[i] * weights[i]
  }
  const mod = 11 - (result % 11)
  return (mod == 11 ? 0 : mod).toString()
}

export const getFnrBirthdayFromBirthdate = (birthdate: string): string => {
  if (birthdate.length != 8)
    throw new Error(
      'Birthdate is not of proper length. Expected format is ddMMyyyy'
    )
  return birthdate.slice(0, 4) + birthdate.slice(6)
}

export const generateRandomIndividualNumber = (
  birthdate: string,
  gender: Gender
): string => {
  const year = parseInt(birthdate.slice(-4))
  let randomIndividualNumber: number

  if (isYearInRange(year, 2000, 2039)) {
    randomIndividualNumber = generateRandomIntInRange(500, 999)
  } else if (isYearInRange(year, 1940, 1999)) {
    randomIndividualNumber = generateRandomIntInRange(900, 999)
  } else if (isYearInRange(year, 1900, 1999)) {
    randomIndividualNumber = generateRandomIntInRange(0, 499)
  } else if (isYearInRange(year, 1854, 1899)) {
    randomIndividualNumber = generateRandomIntInRange(500, 749)
  } else {
    throw new Error('Supplied parameter year does not contain a valid year.')
  }

  if (gender === Gender.male && !(randomIndividualNumber % 2)) {
    randomIndividualNumber++
  } else if (gender === Gender.female && randomIndividualNumber % 2 === 1) {
    randomIndividualNumber--
  }

  if (randomIndividualNumber < 100)
    if (randomIndividualNumber < 10) return '00' + randomIndividualNumber
    else return '0' + randomIndividualNumber

  return randomIndividualNumber.toString()
}
