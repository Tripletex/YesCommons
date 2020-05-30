import { mod11 } from './mod11.js'

export default function orgnr() {
	const n = () => Math.floor(Math.random()*10);
	const num1 = (Math.floor(Math.random()*9) + 1); // special case; cannot be 0
	const baseOrgNumbers = [num1]
	for (let i = 0; i < 7; i++) {
		baseOrgNumbers.push(n())
	}

	const controlCipher = mod11(baseOrgNumbers)
	if (controlCipher === '-') {
		return orgnr()
	}
	return baseOrgNumbers.join('') + controlCipher
}
