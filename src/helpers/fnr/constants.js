import { getDefaultMod11Weights } from '../mod/modCommon'

export const K1_BASE = [3, 7, 6, 1, 8, 9, 4, 5, 2];
export const K2_BASE = getDefaultMod11Weights(10);
export const FNR_TYPES = {
  fnr: 'fnr',
  dnr: 'dnr',
  hnr: 'hnr',
  fhnr: 'fhnr'
}