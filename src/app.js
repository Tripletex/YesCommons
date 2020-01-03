import orgnr from './orgnr.js';
import kontonr from './kontonr.js';
import postnummer from './postal.js'


function newOrgNr() {
	const orgSpan = document.querySelector('.js-orgnr');
	orgSpan.innerText = orgnr();
}


function newKontoNr() {
	document.querySelector('.js-kontonr').innerText = kontonr();
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
document.querySelector('.js-gen-kontonr').addEventListener('click', newKontoNr);
document.querySelector('[name="postnummer"]').addEventListener('input', queryPostal);
