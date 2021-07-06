import orgnr from './services/orgnr'
import {
  generateAccountNumber,
  validateAccountNumber,
} from './services/kontonr'
import postnummer from './services/postal'
import {
  generateKidMod10,
  generateKidMod11,
  validateKid_mod10,
  validateKid_mod11,
} from './services/kid'
import { generateFnr, validateFnr } from './services/fnr'
import { MAX_KID_LENGTH, MIN_KID_LENGTH, Modulo } from './types/types'

function newKidNr() {
  try {
    const kidBaseSpan = document.querySelector('#kidNumberBase')
    const kidBase = kidBaseSpan.value.trim().replace(/[^0-9]+/g, '')

    const kidNumberLengthSpan = document.querySelector('#kidNumberLength')
    const kidNumberLength = kidNumberLengthSpan.value.trim()
    const randomKidLength =
      Math.floor(
        Math.random() * (MAX_KID_LENGTH - kidBase.length - MIN_KID_LENGTH - 1)
      ) +
      MIN_KID_LENGTH +
      kidBase.length // There are three things I hate: overly-complicated variable instantiations, arithmetic, and long comments.
    const kidLength = kidNumberLength ? kidNumberLength : randomKidLength

    const modulo = document.querySelector('select#modulo_generate').value
    const kidSpan = document.querySelector('.js-kid-nummer')
    switch (modulo) {
      case Modulo.mod10:
        kidSpan.innerText = generateKidMod10(kidBase, kidLength)
        break
      case Modulo.mod11:
        kidSpan.innerText = generateKidMod11(kidBase, kidLength)
        break
      default:
        kidSpan.innerText =
          "Something went wrong. Please ensure you've selected a supported modulo."
    }
  } catch (e) {
    document.querySelector('.js-kid-nummer').innerText = e.message
  }
}

function newFnr() {
  const fnrSpan = document.querySelector('.js-fnr')
  const fnrType = document.querySelector('select#fnr_type').value
  const gender = document.querySelector('select#gender').value
  fnrSpan.innerText = generateFnr(gender, fnrType)
}

function newOrgNr() {
  const orgSpan = document.querySelector('.js-orgnr')
  orgSpan.innerText = orgnr()
}

function newKontoNr() {
  document.querySelector('.js-kontonr').innerText = generateAccountNumber()
}

function validateKontoNr(e) {
  e.preventDefault()
  const accountNumberInput = document.querySelector('#accountnumber')
  const resultSpan = document.querySelector('span#accont_validation_result')
  const initialAccountNumber = accountNumberInput.value
  const accountNumber = accountNumberInput.value.replace(/\s+/g, '')
  if (accountNumber.length !== 11) {
    resultSpan.textContent = 'Et gyldig norsk kontonummer har nøyaktig 11 siffer'
    accountNumberInput.value = ''
    return
  }
  const isValidAccountNumber = validateAccountNumber(accountNumber)
  resultSpan.textContent = `${initialAccountNumber} er et ${
    isValidAccountNumber ? 'gyldig' : 'ugyldig'
  } kontonummer.`
  accountNumberInput.value = ''
}

function validateKidNr(e) {
  e.preventDefault()
  try {
    const kid = document
      .querySelector('input#kidNumberValidation')
      .value.toString()
    const modulo = document.querySelector('select#modulo_validate').value

    let isValid
    switch (modulo) {
      case Modulo.mod10:
        isValid = validateKid_mod10(kid)
        break
      case Modulo.mod11:
        isValid = validateKid_mod11(kid)
        break
      default:
        isValid = false
    }
    const resultSpan = document.querySelector('span#kidr_validation_result')
    resultSpan.textContent = `${kid} er et ${
      isValid ? 'gyldig' : 'ugyldig'
    } kidnummer.`
  } catch (error) {
    resultSpan.textContent = error.message
  }
}

function validateFnrForm(e) {
  e.preventDefault()
  const fNrInput = document.querySelector('input#fnr_validation')
  const resultSpan = document.querySelector('span#fnr_validation_result')
  const initialFnr = '' + fNrInput.value
  const fnrToCheck = initialFnr.replace(/\s+/g, '')
  const { success, msg, fnr } = validateFnr(fnrToCheck)

  resultSpan.textContent = msg
  fNrInput.value = ''
}

function queryPostal(e) {
  const value = e.target.value
  if (!value || value.length !== 4) {
    document.querySelector('[name="kommune"]').value = ''
    return
  }
  const postalCode = parseInt(value)
  const municipality = postnummer(postalCode)
  document.querySelector('[name="kommune"]').value = municipality || ''
}

newOrgNr()
newKontoNr()
newFnr()

document.querySelector('.js-gen-orgnr').addEventListener('click', newOrgNr)
document.querySelector('.js-gen-fnr').addEventListener('click', newFnr)
document.querySelector('.js-gen-kid').addEventListener('click', newKidNr)
document.querySelector('.js-gen-kontonr').addEventListener('click', newKontoNr)
document
  .querySelector('.js-val-kontonr')
  .addEventListener('click', validateKontoNr)
document.querySelector('.js-val-kidnr').addEventListener('click', validateKidNr)
document.querySelector('.js-val-fnr').addEventListener('click', validateFnrForm)
document
  .querySelector('[name="postnummer"]')
  .addEventListener('input', queryPostal)
