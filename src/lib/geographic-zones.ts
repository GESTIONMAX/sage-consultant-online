import { GeographicZone } from '../types/geographic';

export const GEOGRAPHIC_ZONES: Record<string, GeographicZone> = {
  PACA: {
    id: 'PACA',
    name: 'Provence-Alpes-Côte d\'Azur',
    cities: [
      'Antibes', 'Nice', 'Marseille', 'Aix-en-Provence', 'Cannes', 'Toulon',
      'Avignon', 'Grasse', 'Draguignan', 'Fréjus', 'Saint-Raphaël', 'Hyères',
      'La Seyne-sur-Mer', 'Martigues', 'Aubagne', 'Salon-de-Provence'
    ],
    postalCodes: ['06', '13', '83', '84', '05'],
    departments: ['06', '13', '83', '84', '05'],
    services: [
      'Intervention sur site',
      'Formation locale',
      'Support technique régional',
      'Audit et optimisation',
      'Migration Sage 100',
      'Paramétrage personnalisé'
    ],
    contact: {
      phone: '06 61 32 41 46',
      email: 'briane@1cgestion.fr',
      address: 'Antibes PACA'
    },
    availability: {
      onSite: true,
      remote: true,
      responseTime: '24-48h'
    },
    pricing: {
      onSite: 'Sur devis',
      remote: 'À partir de 80€/h',
      emergency: 'Sur devis urgent'
    }
  },
  ILE_DE_FRANCE: {
    id: 'IDF',
    name: 'Île-de-France',
    cities: [
      'Paris', 'Boulogne-Billancourt', 'Nanterre', 'Créteil', 'Versailles',
      'Saint-Denis', 'Argenteuil', 'Montreuil', 'Neuilly-sur-Seine', 'Asnières-sur-Seine',
      'Colombes', 'Courbevoie', 'Rueil-Malmaison', 'Levallois-Perret', 'Issy-les-Moulineaux'
    ],
    postalCodes: ['75', '77', '78', '91', '92', '93', '94', '95'],
    departments: ['75', '77', '78', '91', '92', '93', '94', '95'],
    services: [
      'Formation à distance',
      'Support technique',
      'Consultation Sage 100',
      'Migration assistée',
      'Formation utilisateurs',
      'Audit comptable'
    ],
    contact: {
      phone: '06 61 32 41 46',
      email: 'briane@1cgestion.fr',
      address: 'Paris Île-de-France'
    },
    availability: {
      onSite: false,
      remote: true,
      responseTime: '24h'
    },
    pricing: {
      onSite: 'Non disponible',
      remote: 'À partir de 100€/h',
      emergency: 'Sur devis urgent'
    }
  }
};

export const DEFAULT_ZONE = GEOGRAPHIC_ZONES.PACA;

export function detectZoneFromPostalCode(postalCode: string): GeographicZone | null {
  const code = postalCode.substring(0, 2);
  
  for (const zone of Object.values(GEOGRAPHIC_ZONES)) {
    if (zone.postalCodes.includes(code)) {
      return zone;
    }
  }
  
  return null;
}

export function detectZoneFromCity(city: string): GeographicZone | null {
  const normalizedCity = city.toLowerCase().trim();
  
  for (const zone of Object.values(GEOGRAPHIC_ZONES)) {
    if (zone.cities.some(zoneCity => 
      zoneCity.toLowerCase().includes(normalizedCity) || 
      normalizedCity.includes(zoneCity.toLowerCase())
    )) {
      return zone;
    }
  }
  
  return null;
}

export function detectZoneFromCoordinates(lat: number, lng: number): GeographicZone | null {
  // Coordonnées approximatives des zones
  const zoneBounds = {
    PACA: {
      minLat: 43.0, maxLat: 45.0,
      minLng: 4.0, maxLng: 8.0
    },
    ILE_DE_FRANCE: {
      minLat: 48.0, maxLat: 49.5,
      minLng: 1.5, maxLng: 3.5
    }
  };

  for (const [zoneId, bounds] of Object.entries(zoneBounds)) {
    if (lat >= bounds.minLat && lat <= bounds.maxLat &&
        lng >= bounds.minLng && lng <= bounds.maxLng) {
      return GEOGRAPHIC_ZONES[zoneId];
    }
  }

  return null;
}
