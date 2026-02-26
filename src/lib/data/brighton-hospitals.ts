import type { HealthFacility } from '@/types/domain';

/** Static dataset of Brighton area hospitals — NHS ODS doesn't return these via postcode search */
export const BRIGHTON_HOSPITALS: HealthFacility[] = [
  {
    id: 'RXH-RSC',
    name: 'Royal Sussex County Hospital',
    type: 'hospital',
    address: 'Eastern Road, Brighton',
    postcode: 'BN2 5BE',
    phone: '01273 696955',
    location: { lat: 50.8198, lng: -0.1189 },
  },
  {
    id: 'RXH-BGH',
    name: 'Brighton General Hospital',
    type: 'hospital',
    address: 'Elm Grove, Brighton',
    postcode: 'BN2 3EW',
    phone: '01273 696011',
    location: { lat: 50.8316, lng: -0.1222 },
  },
  {
    id: 'RXH-PRH',
    name: 'Princess Royal Hospital',
    type: 'hospital',
    address: 'Lewes Road, Haywards Heath',
    postcode: 'RH16 4EX',
    phone: '01444 441881',
    location: { lat: 51.0022, lng: -0.0963 },
  },
  {
    id: 'RXH-RACH',
    name: 'Royal Alexandra Children\'s Hospital',
    type: 'hospital',
    address: 'Eastern Road, Brighton',
    postcode: 'BN2 5BE',
    phone: '01273 696955',
    location: { lat: 50.8200, lng: -0.1185 },
  },
  {
    id: 'RXH-SEH',
    name: 'Sussex Eye Hospital',
    type: 'hospital',
    address: 'Eastern Road, Brighton',
    postcode: 'BN2 5BF',
    phone: '01273 606126',
    location: { lat: 50.8195, lng: -0.1183 },
  },
  {
    id: 'HOVE-POLY',
    name: 'Hove Polyclinic',
    type: 'hospital',
    address: 'Nevill Avenue, Hove',
    postcode: 'BN3 7HZ',
    phone: '01273 265544',
    location: { lat: 50.8371, lng: -0.1762 },
  },
];
