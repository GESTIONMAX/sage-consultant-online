import React, { createContext, useContext, ReactNode } from 'react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { GeographicZone } from '@/types/geographic';

interface GeographicContextType {
  userLocation: any;
  detectedZone: GeographicZone | null;
  isLoading: boolean;
  error: string | null;
  setManualZone: (zoneId: string) => void;
  detectFromInput: (input: string) => void;
  resetDetection: () => void;
  availableZones: Record<string, GeographicZone>;
}

const GeographicContext = createContext<GeographicContextType | undefined>(undefined);

interface GeographicProviderProps {
  children: ReactNode;
}

export function GeographicProvider({ children }: GeographicProviderProps) {
  const geolocationData = useGeolocation();

  return (
    <GeographicContext.Provider value={geolocationData}>
      {children}
    </GeographicContext.Provider>
  );
}

export function useGeographic() {
  const context = useContext(GeographicContext);
  if (context === undefined) {
    throw new Error('useGeographic must be used within a GeographicProvider');
  }
  return context;
}

// Hook pour obtenir les services adaptés à la zone détectée
export function useAdaptiveServices() {
  const { detectedZone } = useGeographic();
  
  if (!detectedZone) {
    return {
      services: [],
      contact: null,
      availability: null,
      pricing: null
    };
  }

  return {
    services: detectedZone.services,
    contact: detectedZone.contact,
    availability: detectedZone.availability,
    pricing: detectedZone.pricing
  };
}

// Hook pour obtenir les informations de contact adaptées
export function useAdaptiveContact() {
  const { detectedZone } = useGeographic();
  
  if (!detectedZone) {
    return {
      phone: "06 61 32 41 46",
      email: "briane@1cgestion.fr",
      address: "Antibes PACA"
    };
  }

  return detectedZone.contact;
}
