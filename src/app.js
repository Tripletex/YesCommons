import orgnr from './orgnr.js';


function newOrgNr() {
	const orgSpan = document.querySelector('.js-orgnr');
	orgSpan.innerText = orgnr();
}

newOrgNr();

document.querySelector('.js-gen-orgnr').addEventListener('click', newOrgNr);
