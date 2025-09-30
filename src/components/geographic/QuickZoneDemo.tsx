import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  MapPin, 
  Search, 
  CheckCircle, 
  Clock,
  Phone,
  Mail,
  Navigation
} from 'lucide-react';
import { useGeolocation } from '@/hooks/useGeolocation';

export default function QuickZoneDemo() {
  const { detectedZone, isLoading, detectFromInput } = useGeolocation();
  const [searchInput, setSearchInput] = useState('');

  const handleQuickSearch = () => {
    if (searchInput.trim()) {
      detectFromInput(searchInput.trim());
    }
  };

  const quickTests = [
    { label: 'Nice (PACA)', value: 'Nice' },
    { label: 'Paris (IDF)', value: 'Paris' },
    { label: 'Marseille (PACA)', value: 'Marseille' },
    { label: '06000 (PACA)', value: '06000' },
    { label: '75001 (IDF)', value: '75001' }
  ];

  return (
    <div className="space-y-6">
      {/* Test rapide */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <Navigation className="w-5 h-5" />
            <span>Test rapide de géolocalisation</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-2">
            <Input
              placeholder="Tapez une ville ou code postal..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleQuickSearch()}
            />
            <Button onClick={handleQuickSearch} disabled={!searchInput.trim()}>
              <Search className="w-4 h-4" />
            </Button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {quickTests.map((test, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearchInput(test.value);
                  detectFromInput(test.value);
                }}
                className="text-xs"
              >
                {test.label}
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Résultat */}
      {detectedZone && (
        <Card className="border-primary/20 bg-primary/5">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <CheckCircle className="w-5 h-5 text-primary" />
              <span>Zone détectée : {detectedZone.name}</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              {/* Services */}
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
                      <span className="text-orange-500">⚠️</span>
                    )}
                    <span>
                      {detectedZone.availability.onSite ? 'Intervention sur site' : 'Formation à distance uniquement'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

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

            {/* Badges de services */}
            <div className="pt-4">
              <h4 className="font-medium text-sm text-foreground mb-2">Services adaptés</h4>
              <div className="flex flex-wrap gap-1">
                {detectedZone.services.map((service, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {service}
                  </Badge>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* État de chargement */}
      {isLoading && (
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-center space-x-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary"></div>
              <span className="text-muted-foreground">Détection en cours...</span>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
