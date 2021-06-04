import { isDnumber, isFHnumber, isHnumber } from '../../services/fnr'

const getFnrType = (fnrToCheck: string): string => isDnumber(fnrToCheck) ? 'dnr' : (isHnumber(fnrToCheck) ? 'hnr' : (isFHnumber(fnrToCheck) ? 'fhnr' : 'fnr'))

export default getFnrType