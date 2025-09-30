export interface GeographicZone {
  id: string;
  name: string;
  cities: string[];
  postalCodes: string[];
  departments: string[];
  services: string[];
  contact: {
    phone: string;
    email: string;
    address: string;
  };
  availability: {
    onSite: boolean;
    remote: boolean;
    responseTime: string;
  };
  pricing: {
    onSite: string;
    remote: string;
    emergency: string;
  };
}

export interface UserLocation {
  city?: string;
  postalCode?: string;
  department?: string;
  region?: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
  detectedZone?: GeographicZone;
}

export interface GeolocationState {
  isLoading: boolean;
  userLocation: UserLocation | null;
  detectedZone: GeographicZone | null;
  error: string | null;
  manualSelection: boolean;
}
