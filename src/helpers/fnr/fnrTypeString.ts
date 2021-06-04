type FnrTypeFunction = (fnrType: string) => string;

const fnrTypeString: FnrTypeFunction = fnrType => {
  const baseFnrType = fnrType.split('nr')[0]
  return baseFnrType === 'd' ? 'D-nummer' 
  : baseFnrType === 'h' ? 'H-nummer'
  : baseFnrType === 'fh' ? 'FH-nummer'
  : 'fødselsnummer'
}

export default fnrTypeString