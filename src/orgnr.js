import { mod11_generate } from './mod11.js'

export default function orgnr() {
	const orgNummer = mod11_generate(8);

	const firstNumber = parseInt(orgNummer[0]);
	const controlCipher = orgNummer[orgNummer.length - 1];

	if (controlCipher === '-' || firstNumber === 0) {
		return orgnr()
	}
	return orgNummer
}
