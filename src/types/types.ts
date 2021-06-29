export interface StringMap {
  [key: string]: string
}

export const MIN_KID_LENGTH = 2
export const MAX_KID_LENGTH = 25
export const FNR_LENGTH = 11

export type ValidateFnrWrapper = {
  success: boolean
  msg: string
  fnr: string
}

export enum Gender {
  female = 'female',
  male = 'male',
}

export enum Modulo {
  mod10 = 'mod10',
  mod11 = 'mod11',
}
