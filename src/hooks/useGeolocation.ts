import { useState, useEffect, useCallback } from 'react';
import { GeolocationState, UserLocation, GeographicZone } from '../types/geographic';
import { GEOGRAPHIC_ZONES, detectZoneFromPostalCode, detectZoneFromCity, detectZoneFromCoordinates } from '../lib/geographic-zones';

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>({
    isLoading: true,
    userLocation: null,
    detectedZone: null,
    error: null,
    manualSelection: false
  });

  const detectLocationFromIP = useCallback(async () => {
    try {
      // Utilisation d'un service gratuit pour détecter la localisation par IP
      const response = await fetch('https://ipapi.co/json/');
      const data = await response.json();
      
      if (data.city && data.postal) {
        const location: UserLocation = {
          city: data.city,
          postalCode: data.postal,
          department: data.region_code,
          region: data.region,
          coordinates: {
            latitude: data.latitude,
            longitude: data.longitude
          }
        };

        // Détection de la zone
        let detectedZone: GeographicZone | null = null;
        
        // Essayer d'abord avec le code postal
        if (data.postal) {
          detectedZone = detectZoneFromPostalCode(data.postal);
        }
        
        // Si pas trouvé, essayer avec la ville
        if (!detectedZone && data.city) {
          detectedZone = detectZoneFromCity(data.city);
        }
        
        // Si pas trouvé, essayer avec les coordonnées
        if (!detectedZone && data.latitude && data.longitude) {
          detectedZone = detectZoneFromCoordinates(data.latitude, data.longitude);
        }

        setState(prev => ({
          ...prev,
          isLoading: false,
          userLocation: location,
          detectedZone: detectedZone || GEOGRAPHIC_ZONES.PACA,
          error: null
        }));
      }
    } catch (error) {
      console.warn('Erreur lors de la détection IP:', error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        detectedZone: GEOGRAPHIC_ZONES.PACA,
        error: 'Impossible de détecter la localisation'
      }));
    }
  }, []);

  const getCurrentPosition = useCallback(() => {
    if (!navigator.geolocation) {
      detectLocationFromIP();
      return;
    }

    setState(prev => ({ ...prev, isLoading: true }));

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        
        try {
          // Reverse geocoding pour obtenir l'adresse
          const response = await fetch(
            `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=fr`
          );
          const data = await response.json();
          
          const location: UserLocation = {
            city: data.city || data.locality,
            postalCode: data.postcode,
            department: data.principalSubdivisionCode,
            region: data.principalSubdivision,
            coordinates: { latitude, longitude }
          };

          // Détection de la zone
          let detectedZone = detectZoneFromCoordinates(latitude, longitude);
          
          if (!detectedZone && data.postcode) {
            detectedZone = detectZoneFromPostalCode(data.postcode);
          }
          
          if (!detectedZone && data.city) {
            detectedZone = detectZoneFromCity(data.city);
          }

          setState(prev => ({
            ...prev,
            isLoading: false,
            userLocation: location,
            detectedZone: detectedZone || GEOGRAPHIC_ZONES.PACA,
            error: null
          }));
        } catch (error) {
          console.warn('Erreur reverse geocoding:', error);
          // Fallback avec les coordonnées
          const detectedZone = detectZoneFromCoordinates(latitude, longitude);
          setState(prev => ({
            ...prev,
            isLoading: false,
            userLocation: { coordinates: { latitude, longitude } },
            detectedZone: detectedZone || GEOGRAPHIC_ZONES.PACA,
            error: null
          }));
        }
      },
      (error) => {
        console.warn('Erreur géolocalisation:', error);
        // Fallback vers détection IP
        detectLocationFromIP();
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000 // 5 minutes
      }
    );
  }, [detectLocationFromIP]);

  const setManualZone = useCallback((zoneId: string) => {
    const zone = GEOGRAPHIC_ZONES[zoneId];
    if (zone) {
      setState(prev => ({
        ...prev,
        detectedZone: zone,
        manualSelection: true,
        error: null
      }));
    }
  }, []);

  const detectFromInput = useCallback((input: string) => {
    setState(prev => ({ ...prev, isLoading: true }));
    
    // Essayer de détecter comme code postal
    if (/^\d{5}$/.test(input)) {
      const zone = detectZoneFromPostalCode(input);
      if (zone) {
        setState(prev => ({
          ...prev,
          isLoading: false,
          detectedZone: zone,
          manualSelection: true,
          error: null
        }));
        return;
      }
    }
    
    // Essayer de détecter comme ville
    const zone = detectZoneFromCity(input);
    if (zone) {
      setState(prev => ({
        ...prev,
        isLoading: false,
        detectedZone: zone,
        manualSelection: true,
        error: null
      }));
    } else {
      setState(prev => ({
        ...prev,
        isLoading: false,
        detectedZone: GEOGRAPHIC_ZONES.PACA,
        error: 'Zone non reconnue, utilisation de la zone par défaut'
      }));
    }
  }, []);

  const resetDetection = useCallback(() => {
    setState(prev => ({
      ...prev,
      isLoading: true,
      userLocation: null,
      detectedZone: null,
      error: null,
      manualSelection: false
    }));
    getCurrentPosition();
  }, [getCurrentPosition]);

  useEffect(() => {
    getCurrentPosition();
  }, [getCurrentPosition]);

  return {
    ...state,
    getCurrentPosition,
    setManualZone,
    detectFromInput,
    resetDetection,
    availableZones: GEOGRAPHIC_ZONES
  };
}
