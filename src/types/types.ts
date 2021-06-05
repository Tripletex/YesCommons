import {FNR_TYPES} from "../helpers/fnr/constants";

export interface StringMap {
    [key: string]: string;
}

export const MIN_KID_LENGTH = 2;
export const MAX_KID_LENGTH = 25;

export type MOD11 = number | '-';
export type MOD10 = number;

export type ModuloFunctionParam = {
    digits: number[],
    weigth?: number[]
}
export type ModuloValidator = (number: string, weight: number[]) => boolean;
export type ModuloFunction = (digits: number[], weight?: number[]) => MOD10 | MOD11;

export type ControlCiphers = {
    k1: number,
    k2: number,
    ciphers: number[]
}

export type ErrorMessage = {
    success: boolean,
    msg: string
}

export type ControlCipherWrapper = {
    success: boolean,
    controlCiphers: string
}

export type ValidateFnrWrapper = {
    success: boolean,
    msg: string,
    fnr: string,
    type: FNR_TYPES,
    typeString: string
}

export type ExtractedDate = {
    date: Date,
    year: number,
    month: number,
    day: number,
    ISODate?: string,
    gender: Gender
}

export enum Gender {
    female = 'female',
    male = 'male'
}

export enum Modulo {
    mod10 = 'mod10',
    mod11 = 'mod11'
}