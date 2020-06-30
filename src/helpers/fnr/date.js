import moment from 'moment';
import monthStrings from '../transformMonthToString'
import { FNR_TYPES } from '../fnr/constants'

/**
 * 
 * @param {String} year 
 * @param {String} individual 
 */
export function appendYearBasedOnIndividual(year, individual) {
  let appendYear;

  switch (true) {
    case individual <= '999' && individual >= '000':
      switch (true) {
        case (individual >= '500' && individual <= '999') && year <= '39':
          appendYear = '20';
          break;
        case (individual >= '500' && individual <= '749') && year >= '54':
          appendYear = '18';
          break;
        default:
          appendYear = '19';
          break;
      }
      break;
    default:
      break;
  }

  return appendYear;
}

/**
 * 
 * @param {String} day 
 * @param {String} month 
 * @param {Object} params 
 * @param {boolean} params.dnumber result of dnumber validation
 * @param {boolean} params.hnumber result of hnumber validation
 * @param {boolean} params.fhnumber result of fhnumber validation
 */
export function checkDatesWhenNotFnr(day, month, { dnumber = false, hnumber = false, fhnumber = false } = {}) {
  const normalValidMonth = (month >= '01' && month <= '12')
  const normalValidDay = (day >= '01' && day <= '31')
  const isFnr = !dnumber && !hnumber && !fhnumber

  if (dnumber && normalValidMonth) {
    return true
  } 
  
  if (fhnumber) {
    return true
  }
  
  if (hnumber && normalValidDay) {
    return true
  }

  if (isFnr && (normalValidDay && normalValidDay)) {
    return true
  }

  return false
}

/**
 * 
 * @param {Object} params
 * @param {String} params.fnr the fødselsnummer (only the nine first ciphers are used) 
 * @param {boolean} params.isStrictMode flag used for the date check, ${true} by default
 * @param {String} params.fnrType string indicator of fnr
 */
export function checkValidFødselsdato({ fnr, isStrictMode = true, fnrType } = {}) {
  const { ISODate } = extractDate(fnr, fnrType)
  const isValidDate = moment(ISODate, 'YYYY-MM-DD', isStrictMode).isValid()
  return isValidDate
}

/**
 * 
 * @param {String} baseFnr the fødselsnummer (only the nine first ciphers are used)
 * @param {String} fnrType string indicator of fnr
 */
export function extractDate(baseFnr, fnrType) {
  let [d1, d2, m1, m2, å1, å2, i1, i2, i3] = baseFnr.split('').map(n => parseInt(n))
  d1 = fnrType === FNR_TYPES.dnr ? d1 - 4 : d1
  m1 = fnrType === FNR_TYPES.hnr ? m1 - 4 : m1
  const gender = i3 % 2 === 0 ? 'female' : 'male'
  const individual = `${i1}${i2}${i3}`
  const year = `${å1}${å2}`
  const day = `${d1}${d2}`
  const month = `${m1}${m2}`
  const appendedYear = appendYearBasedOnIndividual(year, individual)
  const finalYear = appendedYear + year
  const date = `${day}. ${monthStrings[month]} ${finalYear}` 
  const ISODate = `${appendedYear}${year}-${month}-${day}` 
  return { date, year: finalYear, month, day, ISODate, gender }
}