import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Globe, 
  Smartphone, 
  Wifi,
  CheckCircle,
  Clock,
  Phone,
  Mail,
  Navigation,
  Settings
} from 'lucide-react';
import ZoneSelector from '@/components/geographic/ZoneSelector';
import GeographicFAQ from '@/components/geographic/GeographicFAQ';
import { GeographicZone } from '@/types/geographic';
import { useGeolocation } from '@/hooks/useGeolocation';

const GeographicDemo = () => {
  const { userLocation, detectedZone, isLoading, error } = useGeolocation();
  const [selectedZone, setSelectedZone] = useState<GeographicZone | null>(null);

  const handleZoneChange = (zone: GeographicZone) => {
    setSelectedZone(zone);
  };

  const features = [
    {
      icon: <Globe className="w-6 h-6" />,
      title: "Détection automatique",
      description: "Géolocalisation intelligente basée sur votre position"
    },
    {
      icon: <Smartphone className="w-6 h-6" />,
      title: "Recherche par ville",
      description: "Tapez votre ville ou code postal pour une détection rapide"
    },
    {
      icon: <Wifi className="w-6 h-6" />,
      title: "Détection IP",
      description: "Fallback automatique via votre adresse IP"
    },
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Sélection manuelle",
      description: "Choisissez votre zone si la détection automatique échoue"
    }
  ];

  return (
    <div className="min-h-screen pt-16 bg-background">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background to-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Système de Géolocalisation Intelligent
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
              Détection automatique des zones géographiques (PACA, Île-de-France) 
              avec personnalisation des services selon votre localisation.
            </p>
          </div>

          {/* Fonctionnalités */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {features.map((feature, index) => (
              <Card key={index} className="text-center hover:shadow-elegant transition-smooth">
                <CardContent className="p-6">
                  <div className="w-12 h-12 bg-primary-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <div className="text-primary">
                      {feature.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Détection en temps réel */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Détection en temps réel
            </h2>
            <p className="text-muted-foreground text-lg">
              Testez le système de géolocalisation intelligent
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Zone Selector */}
            <div>
              <ZoneSelector 
                onZoneChange={handleZoneChange}
                showDetails={true}
              />
            </div>

            {/* Informations détaillées */}
            <div className="space-y-6">
              {/* Informations utilisateur */}
              {userLocation && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Navigation className="w-5 h-5" />
                      <span>Votre localisation</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {userLocation.city && (
                      <div className="flex items-center space-x-2">
                        <MapPin className="w-4 h-4 text-muted-foreground" />
                        <span className="text-sm">
                          <strong>Ville :</strong> {userLocation.city}
                        </span>
                      </div>
                    )}
                    {userLocation.postalCode && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">
                          <strong>Code postal :</strong> {userLocation.postalCode}
                        </span>
                      </div>
                    )}
                    {userLocation.department && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">
                          <strong>Département :</strong> {userLocation.department}
                        </span>
                      </div>
                    )}
                    {userLocation.coordinates && (
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">
                          <strong>Coordonnées :</strong> 
                          {userLocation.coordinates.latitude.toFixed(4)}, 
                          {userLocation.coordinates.longitude.toFixed(4)}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Zone sélectionnée */}
              {selectedZone && (
                <Card className="border-primary/20 bg-primary/5">
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <CheckCircle className="w-5 h-5 text-primary" />
                      <span>Zone sélectionnée</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h3 className="font-semibold text-lg">{selectedZone.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        Services adaptés à votre région
                      </p>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <h4 className="font-medium text-sm text-foreground mb-2">Services disponibles</h4>
                        <div className="flex flex-wrap gap-1">
                          {selectedZone.services.map((service, index) => (
                            <Badge key={index} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm text-foreground mb-2">Disponibilité</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center space-x-2">
                            <Clock className="w-4 h-4 text-blue-500" />
                            <span>Réponse : {selectedZone.availability.responseTime}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            {selectedZone.availability.onSite ? (
                              <CheckCircle className="w-4 h-4 text-green-500" />
                            ) : (
                              <span className="text-orange-500">⚠️</span>
                            )}
                            <span>
                              {selectedZone.availability.onSite ? 'Intervention sur site' : 'Formation à distance uniquement'}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h4 className="font-medium text-sm text-foreground mb-2">Contact</h4>
                        <div className="space-y-1 text-sm">
                          <div className="flex items-center space-x-2">
                            <Phone className="w-4 h-4 text-muted-foreground" />
                            <span>{selectedZone.contact.phone}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Mail className="w-4 h-4 text-muted-foreground" />
                            <span>{selectedZone.contact.email}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* État du système */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">État du système</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Détection automatique</span>
                    <Badge variant={isLoading ? "secondary" : "default"}>
                      {isLoading ? "En cours..." : "Terminée"}
                    </Badge>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span>Zone détectée</span>
                    <Badge variant={detectedZone ? "default" : "secondary"}>
                      {detectedZone ? detectedZone.name : "Non détectée"}
                    </Badge>
                  </div>
                  {error && (
                    <div className="flex items-center justify-between text-sm">
                      <span>Erreur</span>
                      <Badge variant="destructive">{error}</Badge>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Avantages du système */}
      <section className="py-16 bg-background-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Avantages du système intelligent
            </h2>
            <p className="text-muted-foreground text-lg">
              Une expérience utilisateur personnalisée selon votre zone géographique
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <MapPin className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Services adaptés</h3>
                <p className="text-sm text-muted-foreground">
                  Services et tarifs personnalisés selon votre région (PACA, Île-de-France)
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Clock className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Disponibilité optimisée</h3>
                <p className="text-sm text-muted-foreground">
                  Délais de réponse et disponibilité adaptés à votre zone géographique
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardContent className="p-6">
                <div className="w-16 h-16 bg-primary-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <Settings className="w-8 h-8 text-primary" />
                </div>
                <h3 className="font-semibold text-foreground mb-2">Interface intelligente</h3>
                <p className="text-sm text-muted-foreground">
                  Interface qui s'adapte automatiquement à vos besoins régionaux
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <GeographicFAQ />
        </div>
      </section>
    </div>
  );
};

export default GeographicDemo;
