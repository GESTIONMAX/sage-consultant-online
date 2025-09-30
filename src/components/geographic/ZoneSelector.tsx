import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Search, 
  CheckCircle, 
  Clock, 
  Phone, 
  Mail,
  Navigation,
  RefreshCw,
  AlertCircle
} from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';
import { GeographicZone } from '@/types/geographic';

interface ZoneSelectorProps {
  onZoneChange?: (zone: GeographicZone) => void;
  showDetails?: boolean;
  className?: string;
}

export default function ZoneSelector({ onZoneChange, showDetails = true, className = '' }: ZoneSelectorProps) {
  const {
    isLoading,
    userLocation,
    detectedZone,
    error,
    manualSelection,
    getCurrentPosition,
    setManualZone,
    detectFromInput,
    resetDetection,
    availableZones
  } = useGeolocation();

  const [searchInput, setSearchInput] = useState('');
  const [showManualSelection, setShowManualSelection] = useState(false);

  const handleZoneSelect = (zoneId: string) => {
    setManualZone(zoneId);
    const zone = availableZones[zoneId];
    if (zone && onZoneChange) {
      onZoneChange(zone);
    }
    setShowManualSelection(false);
  };

  const handleSearch = () => {
    if (searchInput.trim()) {
      detectFromInput(searchInput.trim());
    }
  };

  const handleReset = () => {
    setSearchInput('');
    resetDetection();
  };

  if (isLoading) {
    return (
      <Card className={`w-full ${className}`}>
        <CardContent className="p-6">
          <div className="flex items-center justify-center space-x-2">
            <RefreshCw className="w-5 h-5 animate-spin text-primary" />
            <span className="text-muted-foreground">Détection de votre zone géographique...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className={`space-y-4 ${className}`}>
      {/* Zone détectée */}
      {detectedZone && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-primary" />
                <CardTitle className="text-lg">Zone détectée</CardTitle>
              </div>
              {manualSelection && (
                <Badge variant="secondary">Sélection manuelle</Badge>
              )}
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold text-foreground">{detectedZone.name}</h3>
              {userLocation?.city && (
                <p className="text-sm text-muted-foreground">
                  Détecté à partir de : {userLocation.city}
                  {userLocation.postalCode && ` (${userLocation.postalCode})`}
                </p>
              )}
            </div>

            {showDetails && (
              <div className="grid md:grid-cols-2 gap-4">
                {/* Services disponibles */}
                <div>
                  <h4 className="font-medium text-sm text-foreground mb-2">Services disponibles</h4>
                  <div className="space-y-1">
                    {detectedZone.services.slice(0, 3).map((service, index) => (
                      <div key={index} className="flex items-center space-x-2 text-sm">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span>{service}</span>
                      </div>
                    ))}
                    {detectedZone.services.length > 3 && (
                      <p className="text-xs text-muted-foreground">
                        +{detectedZone.services.length - 3} autres services
                      </p>
                    )}
                  </div>
                </div>

                {/* Disponibilité */}
                <div>
                  <h4 className="font-medium text-sm text-foreground mb-2">Disponibilité</h4>
                  <div className="space-y-2">
                    <div className="flex items-center space-x-2 text-sm">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span>Réponse : {detectedZone.availability.responseTime}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      {detectedZone.availability.onSite ? (
                        <CheckCircle className="w-4 h-4 text-green-500" />
                      ) : (
                        <AlertCircle className="w-4 h-4 text-orange-500" />
                      )}
                      <span>
                        {detectedZone.availability.onSite ? 'Intervention sur site' : 'Formation à distance uniquement'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Contact */}
            <div className="pt-4 border-t border-border">
              <h4 className="font-medium text-sm text-foreground mb-2">Contact régional</h4>
              <div className="space-y-1 text-sm">
                <div className="flex items-center space-x-2">
                  <Phone className="w-4 h-4 text-muted-foreground" />
                  <span>{detectedZone.contact.phone}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Mail className="w-4 h-4 text-muted-foreground" />
                  <span>{detectedZone.contact.email}</span>
                </div>
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-muted-foreground" />
                  <span>{detectedZone.contact.address}</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Erreur */}
      {error && (
        <Card className="border-orange-200 bg-orange-50">
          <CardContent className="p-4">
            <div className="flex items-center space-x-2 text-orange-700">
              <AlertCircle className="w-5 h-5" />
              <span className="text-sm">{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Recherche manuelle */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-lg flex items-center space-x-2">
            <Search className="w-5 h-5" />
            <span>Rechercher une zone</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Ville ou code postal (ex: Nice, 06000)"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Button 
              onClick={handleSearch} 
              disabled={!searchInput.trim()}
              className="bg-sage-primary text-sage-white hover:bg-sage-secondary disabled:opacity-50"
            >
              <Search className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              onClick={() => setShowManualSelection(!showManualSelection)}
              className="flex-1 border-sage-primary text-sage-primary hover:bg-sage-primary hover:text-sage-white"
            >
              <Navigation className="w-4 h-4 mr-2" />
              Choisir manuellement
            </Button>
            <Button 
              variant="outline" 
              onClick={handleReset}
              className="flex-1 border-sage-dark text-sage-dark hover:bg-sage-dark hover:text-sage-white"
            >
              <RefreshCw className="w-4 h-4 mr-2" />
              Redétecter
            </Button>
          </div>

          {/* Sélection manuelle */}
          {showManualSelection && (
            <div className="space-y-2">
              <h4 className="font-medium text-sm text-foreground">Sélectionner une zone :</h4>
              <div className="grid gap-2">
                {Object.values(availableZones).map((zone) => (
                  <Button
                    key={zone.id}
                    variant={detectedZone?.id === zone.id ? "default" : "outline"}
                    onClick={() => handleZoneSelect(zone.id)}
                    className={`justify-start ${
                      detectedZone?.id === zone.id 
                        ? "bg-sage-primary text-sage-white hover:bg-sage-secondary" 
                        : "border-sage-primary text-sage-primary hover:bg-sage-primary hover:text-sage-white"
                    }`}
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    {zone.name}
                  </Button>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
