import * as moment from 'moment';
import monthStrings from '../transformMonthToString'
import {FNR_TYPES} from './constants'
import {Gender} from "../../types/types";

/**
 * 
 * @param {String} year 
 * @param {String} individual 
 */
export function appendYearBasedOnIndividual(year: number, individual: number): number {
  if (individual <= 999 && individual >= 0) {
    if (individual >= 500 && year <= 39) {
      return 20;
    } else if (individual >= 500 && individual <= 749 && year >= 54) {
      return 18;
    } else {
      return 19;
    }
  }
}

type CheckDatesParam = {
  dnumber: boolean, // Result of dnumber validation
  hnumber: boolean, // Result of hnumber validation
  fhnumber: boolean // Result of fhnumber validation
}

/**
 * 
 * @param {String} day 
 * @param {String} month 
 * @param {CheckDatesParam} params
 */
export function checkDatesWhenNotFnr(day: string, month: string, params: CheckDatesParam): boolean {
  const { dnumber, hnumber, fhnumber } = params;
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

  return isFnr && (normalValidDay && normalValidDay);


}

type ValidBirthdayParam = {
  fnr: string, // The fødselsnummer (only the nine first ciphers are used)
  isStrictMode?: boolean, // Flag used for the date check, ${true} by default
  fnrType: string // String indicator of fnr
}

/**
 * @param {ValidBirthdayParam} params
 */
export function checkValidDateOfBirth(params: ValidBirthdayParam): boolean {
  const { fnr, isStrictMode = true, fnrType } = params
  const { ISODate } = extractDate(fnr, fnrType)
  return moment(ISODate, 'YYYY-MM-DD', isStrictMode).isValid()
}

type ExtractedDate = {
  date: Date,
  year: number,
  month: number,
  day: number,
  ISODate: string,
  gender: Gender
}

/**
 * 
 * @param {String} baseFnr the fødselsnummer (only the nine first ciphers are used)
 * @param {String} fnrType string indicator of fnr
 */
export function extractDate(baseFnr: string, fnrType: string): ExtractedDate {
  let [d1, d2, m1, m2, y1, y2, i1, i2, i3] = baseFnr.split('').map(n => parseInt(n))
  d1 = fnrType === FNR_TYPES.dnr ? d1 - 4 : d1
  m1 = fnrType === FNR_TYPES.hnr ? m1 - 4 : m1
  const gender = i3 % 2 === 0 ? Gender.female : Gender.male
  const individual: number = +`${i1}${i2}${i3}`
  const year: number = +`${y1}${y2}`
  const day: number = +`${d1}${d2}`
  const month: number = +`${m1}${m2}`
  const appendedYear = appendYearBasedOnIndividual(year, individual)
  const finalYear = appendedYear + year
  const dateString = `${day}. ${monthStrings[month]} ${finalYear}`
  const date = new Date(dateString);
  const ISODate = `${appendedYear}${year}-${month}-${day}` 
  return { date, year: finalYear, month, day, ISODate, gender }
}