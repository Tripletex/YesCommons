import orgnr from './orgnr.js';
import kontonr from './kontonr.js';


function newOrgNr() {
	const orgSpan = document.querySelector('.js-orgnr');
	orgSpan.innerText = orgnr();
}

function newKontoNr() {
	document.querySelector('.js-kontonr').innerText = kontonr();
}

newOrgNr();
newKontoNr();

document.querySelector('.js-gen-orgnr').addEventListener('click', newOrgNr);
document.querySelector('.js-gen-kontonr').addEventListener('click', newKontoNr);

