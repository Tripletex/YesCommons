function gen() {
	const n = () => Math.floor(Math.random()*10);

	const num1 = n(),
		num2 = n(),
		num3 = n(),
		num4 = n(),
		num5 = n(),
		num6 = n(),
		num7 = n(),
		num8 = n(),
		num9 = n(),
		num10 = n();

	// Weights: 3 2 7 6 5 4 3 2
	var weighted = num1*5 + num2*4 + num3*3 + num4*2 + num5*7 + num6*6 + num7*5 + num8*4 + num9*3 + num10*2;
	var remainder = weighted % 11;
	var contr = 11 - remainder;
	if (contr === 11) contr = 0;

	if (contr === 10)
       return null;
	else
		return "" + num1 + num2 + num3 + num4 + "." + num5 + num6 + "." + num7 + num8 + num9 + num10 + contr;
}

/**
 * Generate a random number that satisfies the norwegian "Bank account number" demands wrt control number.
 */
export default function kontonr() {
	let nummer = null;
  
	do {
		nummer = gen();
	} while(nummer === null);

	return nummer;
}
