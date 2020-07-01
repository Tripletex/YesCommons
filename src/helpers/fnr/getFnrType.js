import { isDnumber, isFHnumber, isHnumber } from '../../services/fnr'

const getFnrType = fnrToCheck => isDnumber(fnrToCheck) ? 'dnr' : isHnumber(fnrToCheck) ? 'hnr' : isFHnumber(fnrToCheck) ? 'fhnr' : 'fnr'

export default getFnrType