function gen() {
	const n = () => Math.floor(Math.random()*10);

	const num1 = (Math.floor(Math.random()*9) + 1), // special case; cannot be 0
		num2 = n(),
		num3 = n(),
		num4 = n(),
		num5 = n(),
		num6 = n(),
		num7 = n(),
		num8 = n();

	// Weights: 3 2 7 6 5 4 3 2
	var weighted = num1*3 + num2*2 + num3*7 + num4*6 + num5*5 + num6*4 + num7*3 + num8*2;
	var remainder = weighted % 11;
	var contr = 11 - remainder;
	if (contr === 11) contr = 0;

	if (contr === 10)
       return null;
	else
		return "" + num1 + num2 + num3 + num4 + num5 + num6 + num7 + num8 + contr;
}

/**
 * Generate a random number that satisfies the norwegian "Organization number" demands wrt control number.
 */
export default function orgnr() {
	let nummer = null;
  
	do {
		nummer = gen();
	} while(nummer === null);

	return nummer;
}
