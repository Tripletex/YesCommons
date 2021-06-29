import { generateRandomIntInRange } from '../lib/util/numberutil'

export const generateRandomBirthDate = (): string => {
  const day = generateRandomIntInRange(1, 31)
  const month = generateRandomIntInRange(1, 12)
  const year = generateRandomIntInRange(1920, new Date().getFullYear())

  return validateAndCreateBirthday(day, month, year)
}

export const isValidFnrBirthdate = (birthdate: string): boolean => {
  if (birthdate.length == 6) {
    const day = +birthdate.slice(0, 2)
    const month = +birthdate.slice(2, 4)
    const year = +birthdate.slice(-2)

    if (day < 1 || day > 31 || month < 1 || month > 12) return false
    return !isDayToBigForMonth(day, month, year)
  }
  return false
}

export const validateAndCreateBirthday = (
  day: number,
  month: number,
  year: number
): string => {
  if (month === 2) {
    if (day > 28) isLeapYear(year) ? (day = 29) : (day = 28)
  }
  if (isDayToBigForMonth(day, month)) day = 30
  return [
    day < 10 ? '0' + day : day,
    month < 10 ? '0' + month : month,
    year,
  ].join('')
}

export const isDayToBigForMonth = (
  day: number,
  month: number,
  year?: number
): boolean => {
  switch (month) {
    case 1:
    case 3:
    case 5:
    case 7:
    case 8:
    case 10:
    case 12:
      return day > 31
    case 2:
      return year && isLeapYear(year) ? day > 29 : day > 28
    case 4:
    case 6:
    case 9:
    case 11:
      return day > 30
    default:
      throw new Error('Invalid year')
  }
}

/**
 * Checks if the given year is a leap year.
 * Courtesy of <a href="https://stackoverflow.com/questions/16353211/check-if-year-is-leap-year-in-javascript">StackOverflow</a>.
 * @param year the year to check
 */
export const isLeapYear = (year: number): boolean => {
  return (year % 4 == 0 && year % 100 != 0) || year % 400 == 0
}

export const isYearInRange = (
  year: number,
  fromInclusive: number,
  toInclusive: number
): boolean => {
  return fromInclusive <= year && year <= toInclusive
}
