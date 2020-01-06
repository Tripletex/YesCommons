'use strict'

const request = require('request')
const fs = require('fs')

/**
 * |********************************************************************************|
 * * USED TO GENERATE THE MODULE postal.js! THIS IS DONE MANUALLY, AND RESULT IS    *
 * * COMMITTED TO THE REPO! Run `node going_postal.js` from the root folder of this *
 * * project to generate a new file. URL might need to be updated if there are any. *
 * * changes to the origin csv file.                                                *
 * |********************************************************************************|
 *
 * This takes as input a tab separated file with postal number in first column
 * and postal place as second column, and outputs (to standard out) a javascript
 * file containing a function which takes a postal number as argument and returns
 * the postal place.
 *
 * The function tries to compress the information by using if-statements for places
 * that have several sequential postal numbers. For places with one or few numbers,
 * is looks up the place in an object instead:
 *
 * function postnummer(pn) {
 *   if(pn>=1&&pn<=1295)return "OSLO";
 *   if(pn>=1301&&pn<=1304)return "SANDVIKA";
 *   ...
 *
 *  return ({1305:"HASLUM",1306:"SANDVIKA",1307:"FORNEBU", ...})[pn];
 * }
 *
 */


request.get('https://www.bring.no/radgivning/sende-noe/adressetjenester/postnummer/_/attachment/download/7f0186f6-cf90-4657-8b5b-70707abeb789:676b821de9cff02aaa7a009daf0af8a2a346a1bc/Postnummerregister-ansi.txt', {encoding: 'binary'}, (err, response, data) => {
	if(err) throw err

	if(response.statusCode !== 200) throw 'Problems during download of CSV file for postal codes, update URL?'

	let places = {}
	let buf = []
	// For picking number straight out from an array
	let singleBuf = []

	// Using if and or for representing a place
	let postalIfMapping = {}

	data = data.toString()

	let lastPlace

	/* I postfix the key name (place) with an index number. This is because the same
	 * name doesn't have to occur sequentially in the list. When creating the if
	 * sentences, MIN and MAX numbers should be in a sequence, without other places
	 * in between ....
	 *
	 */
	let index = 0

	data.split('\n').forEach(line => {
		let l = line.split('\t')
		let number = l[0]
		let place = l[1]
		if(!place) return // Last empty line

		if(lastPlace && lastPlace !== place) index++;

		places[place + '_' + index] = places[place + '_' + index] || []
		places[place + '_' + index].push(number)
		lastPlace = place
	})

	/**
	 * How much space would it take to represent this place with an if?
	 * The if takes 33 characters plus the length of the postal place name.
	 * The Count doesn't matter for how much space the representation will take.
	 *
	 * This function doesn't take into account the OR (||) expressions within the
	 * if.
	 *
	 * For instance:
	 *
	 * 'if(pn>=0001&&pn<=1295)return "OSLO";'
	 *
	 * The if-string for oslo takes 36 characters (minus 3, since the number 1
	 * only takes one character).
	 *
	 * @param C how many postal numbers this place has in this sequence
	 * @param L lenght of character name of postal place
	 */
	function sizeWithIf(C, L) {
		return 32 + L
	}

	/**
	 * How much space would it take to represent this place with object mapping?
	 * For each postal number C, we need 13 characters plus the name of the place.
	 *
	 * For instance:
	 * {0001: "OSLO", 0010: "OSLO", 0015: "OSLO", ....
	   *
	   * This would take (8 + 4) * 639 = 7668 to represent Oslo*.
	   *
	   * (* Not really, because I convert numbers to integers. The number of characters
	   * would be somewhat less for Oslo, but the numbers are true for all other postal
	   * places.)
	   *
	 * @param C how many postal numbers this place has in this sequence
	 * @param L lenght of character name of postal place
	 */
	function sizeWithObject(C, L) {
		return (8 + L) * C;
	}

	Object.keys(places).forEach(place => {
		let numbers = places[place].sort();

		let name = place.split('_')[0]

		// length of character name of postal place
		let l = name.length
		// how many postal numbers this place has in this sequence
		let c = numbers.length

		/*
		 Should compress the list even more, taking into account that places might
		 have postal numbers scattered around in the list. But somehow this makes
		 the final resulting file even larger.

		 This is probably due to that "sizeWithObject" computation fails badly. That
		 computation doesn't take into account the || expressions within the if.

		 C = (function() {
			 var tmp = 0
			 Object.keys(places).forEach(p => {
				 var newName = place.split('_')[0]
				 if(name === newName && places[p].length > 2) tmp += places[p].length
			})

			 return tmp
		 })()*/

		if(sizeWithIf(c, l) > sizeWithObject(c, l)) {
			// Represent postal place sequence in a map, because this is the shortest
			// representation.
			numbers.forEach(number => {
				singleBuf.push(parseInt(number) + ':"' + name + '"')
			})
		} else {
			// Represent postal place sequence in an if, because this is the shortest
			// representation
			let MIN = parseInt(numbers[0])
			let MAX = parseInt(numbers[numbers.length - 1])

			postalIfMapping[name] = postalIfMapping[name] || []
			postalIfMapping[name].push({MIN, MAX})
		}
	})

	buf.push('export default function postnummer(E) {')

	// Create possible OR statements if the postal place has several sequences
	Object.keys(postalIfMapping).forEach(place => {
		var exp = []
		postalIfMapping[place].forEach(postals => {
			exp.push('E>=' + postals.MIN + '&&E<=' + postals.MAX)
		})
		buf.push('if(' + exp.join('||') + ')return "' + place + '";')
	})

	// The final map of postal number => postal place
	buf.push('return ({' + singleBuf.join(',') + '})[E];')

	buf.push('}')

	fs.writeFile('./src/postal.js', buf.join(''), 'UTF-8', function() {

	})
})

