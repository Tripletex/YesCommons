import { mod11 } from '../lib/mod/mod11'

export default function orgnr() {
	const orgNummer = mod11('', 9);

	if (parseInt(orgNummer[0]) === 0 || orgNummer[orgNummer.length - 1] === '-') {
		return orgnr()
	}
	
	return orgNummer
}
