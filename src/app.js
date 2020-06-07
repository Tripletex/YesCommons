import orgnr from './orgnr.js';
import generateAccountNumber, { validateAccountNumber } from './kontonr.js';
import postnummer from './postal.js'
import { generateKidMod10 } from './kid'

function newKidNr() {
	const RANDOM_KID_NUMBER_LENGTH = 3 + Math.floor(Math.random() * 22)
	const kidNumberSpan = document.querySelector('#kidNumberBase')
	const kidNumberLengthSpan = document.querySelector('#kidNumberLength')
	const kidNumberLength = kidNumberLengthSpan.value.trim()
	const kidNumberBase = kidNumberSpan.value.trim()
	const kidNumber = !kidNumberBase && !kidNumberLength 
	? generateKidMod10(RANDOM_KID_NUMBER_LENGTH) 
	: !kidNumberBase && kidNumberLength 
	? generateKidMod10(kidNumberLength)
	: generateKidMod10(kidNumberLength, kidNumberBase)
	document.querySelector('.js-kid-nummer').innerText = kidNumber
	kidNumberSpan.value = ''
	kidNumberLengthSpan.value = ''
}

function newOrgNr() {
	const orgSpan = document.querySelector('.js-orgnr');
	orgSpan.innerText = orgnr();
}


function newKontoNr() {
	const kontoNummer = generateAccountNumber()
	document.querySelector('.js-kontonr').innerText = kontoNummer;
}

function validateKontoNr(e) {
	e.preventDefault();
	const accountNumberInput = document.querySelector('input#accountNumber');
	const resultSpan = document.querySelector('span#accont_validation_result');
	const initialAccountNumber = '' + accountNumberInput.value;
	const accountNumber = accountNumberInput.value.replace(/\s+/g, '');
	if (accountNumber.length !== 11) {
		resultSpan.textContent = 'Et gyldig norsk kontonummer har kun 11 siffer'
		accountNumberInput.value = '';
		return;
	}
	const isValidAccountNumber = validateAccountNumber(accountNumber);
	resultSpan.textContent = `${initialAccountNumber} er et ${isValidAccountNumber ? 'gyldig' : 'ugyldig'} kontonummer.`;
	accountNumberInput.value = '';
}

function queryPostal(e) {
	const value = e.target.value;
	if(!value || value.length !== 4) {
		document.querySelector('[name="kommune"]').value = '';
		return;
	}
	const postalCode = parseInt(value);
	const municipality = postnummer(postalCode);
	document.querySelector('[name="kommune"]').value = municipality || '';
}

newOrgNr();
newKontoNr();

document.querySelector('.js-gen-orgnr').addEventListener('click', newOrgNr);
document.querySelector('.js-gen-kid').addEventListener('click', newKidNr);
document.querySelector('.js-gen-kontonr').addEventListener('click', newKontoNr);
document.querySelector('.js-val-kontonr').addEventListener('click', validateKontoNr);
document.querySelector('[name="postnummer"]').addEventListener('input', queryPostal);
