import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Building2, 
  MapPin, 
  User, 
  Calendar, 
  FileText, 
  Shield,
  Mail,
  Phone,
  Globe
} from 'lucide-react';

export default function LegalMentions() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-br from-sage-primary/10 to-sage-secondary/10 py-20 min-h-[400px] flex items-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
              Mentions Légales
            </h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Informations légales et réglementaires de SAS 1 GESTION
            </p>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="space-y-8">
          
          {/* Company Information */}
          <Card className="border-sage-primary/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-sage-primary/5 to-sage-secondary/5">
              <CardTitle className="flex items-center text-2xl text-sage-primary">
                <Building2 className="w-6 h-6 mr-3" />
                Informations de l'Entreprise
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-sage-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Building2 className="w-5 h-5 text-sage-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Raison Sociale</h3>
                      <p className="text-muted-foreground">SAS 1 GESTION</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-sage-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-sage-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">SIRET du Siège Social</h3>
                      <p className="text-muted-foreground font-mono">822 827 721 00025</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-sage-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Shield className="w-5 h-5 text-sage-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Numéro de TVA</h3>
                      <p className="text-muted-foreground font-mono">FR15822827721</p>
                    </div>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-sage-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <Calendar className="w-5 h-5 text-sage-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Date de Création</h3>
                      <p className="text-muted-foreground">29 septembre 2016</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-sage-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <FileText className="w-5 h-5 text-sage-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Forme Juridique</h3>
                      <p className="text-muted-foreground">Société par actions simplifiée</p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-4">
                    <div className="w-10 h-10 bg-sage-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                      <User className="w-5 h-5 text-sage-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-foreground mb-2">Dirigeant</h3>
                      <p className="text-muted-foreground">Briane LEFEBVRE</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Address */}
          <Card className="border-sage-primary/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-sage-primary/5 to-sage-secondary/5">
              <CardTitle className="flex items-center text-2xl text-sage-primary">
                <MapPin className="w-6 h-6 mr-3" />
                Adresse du Siège Social
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 bg-sage-primary/10 rounded-full flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-sage-primary" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground mb-2">Adresse Complète</h3>
                  <p className="text-lg text-muted-foreground">
                    540 Première Avenue<br />
                    06600 Antibes<br />
                    France
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Activity */}
          <Card className="border-sage-primary/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-sage-primary/5 to-sage-secondary/5">
              <CardTitle className="flex items-center text-2xl text-sage-primary">
                <FileText className="w-6 h-6 mr-3" />
                Activité Professionnelle
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-4">
                <div className="flex items-center space-x-4">
                  <Badge className="bg-sage-primary text-sage-white text-sm font-medium">
                    Code NAF/APE
                  </Badge>
                  <span className="text-foreground font-mono">6202A</span>
                </div>
                <p className="text-muted-foreground text-lg">
                  Conseil en systèmes et logiciels informatiques
                </p>
                <div className="mt-4 p-4 bg-sage-primary/5 rounded-lg border border-sage-primary/20">
                  <p className="text-sage-primary text-sm font-medium">
                    ✓ Spécialisé dans l'accompagnement Sage 100 et la transformation digitale des entreprises
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Contact Information */}
          <Card className="border-sage-primary/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-sage-primary/5 to-sage-secondary/5">
              <CardTitle className="flex items-center text-2xl text-sage-primary">
                <Mail className="w-6 h-6 mr-3" />
                Contact & Support
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Mail className="w-5 h-5 text-sage-primary" />
                    <div>
                      <p className="font-semibold text-foreground">Email</p>
                      <p className="text-muted-foreground">contact@sas1gestion.fr</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <Phone className="w-5 h-5 text-sage-primary" />
                    <div>
                      <p className="font-semibold text-foreground">Téléphone</p>
                      <p className="text-muted-foreground">+33 (0)4 XX XX XX XX</p>
                    </div>
                  </div>
                </div>
                <div className="space-y-4">
                  <div className="flex items-center space-x-3">
                    <Globe className="w-5 h-5 text-sage-primary" />
                    <div>
                      <p className="font-semibold text-foreground">Site Web</p>
                      <p className="text-muted-foreground">www.sas1gestion.fr</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-sage-primary" />
                    <div>
                      <p className="font-semibold text-foreground">Zone d'Intervention</p>
                      <p className="text-muted-foreground">PACA, Île-de-France</p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Legal Information */}
          <Card className="border-sage-primary/20 shadow-lg">
            <CardHeader className="bg-gradient-to-r from-sage-primary/5 to-sage-secondary/5">
              <CardTitle className="flex items-center text-2xl text-sage-primary">
                <Shield className="w-6 h-6 mr-3" />
                Informations Légales
              </CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <div className="space-y-6">
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Directeur de Publication</h3>
                  <p className="text-muted-foreground">Briane LEFEBVRE - Dirigeant de SAS 1 GESTION</p>
                </div>
                
                <div>
                  <h3 className="font-semibold text-foreground mb-3">Hébergement</h3>
                  <p className="text-muted-foreground">
                    Ce site est hébergé par Vercel Inc., 340 S Lemon Ave #4133, Walnut, CA 91789, États-Unis.
                  </p>
                </div>

                <div>
                  <h3 className="font-semibold text-foreground mb-3">Protection des Données</h3>
                  <p className="text-muted-foreground">
                    Conformément au RGPD, nous nous engageons à protéger vos données personnelles. 
                    Consultez notre politique de confidentialité pour plus d'informations.
                  </p>
                </div>

                <div className="mt-6 p-4 bg-sage-primary/5 rounded-lg border border-sage-primary/20">
                  <p className="text-sage-primary text-sm font-medium text-center">
                    Sources & Mises à jour le 30/09/2025
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
