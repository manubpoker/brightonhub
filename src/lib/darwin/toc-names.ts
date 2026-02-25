/**
 * TOC (Train Operating Company) code -> operator name map.
 * Covers all operators serving Brighton and common UK operators.
 */
export const TOC_NAMES: Record<string, string> = {
  // Brighton-serving operators
  GW: 'Great Western Railway',
  GX: 'Gatwick Express',
  HX: 'Heathrow Express',
  IL: 'Island Line',
  LE: 'Greater Anglia',
  LM: 'West Midlands Trains',
  LO: 'London Overground',
  ME: 'Merseyrail',
  NT: 'Northern',
  SE: 'Southeastern',
  SN: 'Southern',
  SR: 'ScotRail',
  SW: 'South Western Railway',
  TL: 'Thameslink',
  TP: 'TransPennine Express',
  TW: 'Tyne and Wear Metro',
  VT: 'Avanti West Coast',
  XC: 'CrossCountry',
  XR: 'Elizabeth line',
  GN: 'Great Northern',
  AW: 'Transport for Wales',
  CC: 'c2c',
  CH: 'Chiltern Railways',
  CS: 'Caledonian Sleeper',
  EM: 'East Midlands Railway',
  ES: 'Eurostar',
  GC: 'Grand Central',
  HC: 'Heathrow Connect',
  HT: 'Hull Trains',
  LN: 'Lumo',
  NY: 'North Yorkshire Moors Railway',
};

export function getTocName(toc: string): string {
  return TOC_NAMES[toc] ?? toc;
}
