import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  HelpCircle, 
  MapPin, 
  Monitor, 
  Settings,
  Phone,
  Mail,
  Navigation,
  Search,
  CheckCircle,
  Clock,
  Shield,
  Users,
  Info
} from 'lucide-react';
import GeneralFAQ from '@/components/geographic/GeneralFAQ';

const FAQPage = () => {
  const [activeTab, setActiveTab] = useState('general');

  const faqCategories = [
    {
      id: 'general',
      title: 'Questions Générales',
      description: 'Tout ce que vous devez savoir sur nos services',
      icon: <HelpCircle className="w-6 h-6" />,
      color: 'bg-blue-100 text-blue-800'
    },
    {
      id: 'geolocation',
      title: 'Géolocalisation',
      description: 'Système intelligent de détection de zone',
      icon: <MapPin className="w-6 h-6" />,
      color: 'bg-green-100 text-green-800'
    },
    {
      id: 'assistance',
      title: 'Assistance Technique',
      description: 'TeamViewer, support et formation',
      icon: <Monitor className="w-6 h-6" />,
      color: 'bg-purple-100 text-purple-800'
    },
    {
      id: 'services',
      title: 'Services par Zone',
      description: 'PACA vs Île-de-France',
      icon: <Settings className="w-6 h-6" />,
      color: 'bg-orange-100 text-orange-800'
    }
  ];

  const quickLinks = [
    {
      title: 'Test de géolocalisation',
      description: 'Découvrez comment le système détecte votre zone',
      icon: <Navigation className="w-5 h-5" />,
      link: '/geographic-demo',
      color: 'text-blue-600 hover:text-blue-800'
    },
    {
      title: 'Assistance technique',
      description: 'Téléchargez TeamViewer et obtenez de l\'aide',
      icon: <Monitor className="w-5 h-5" />,
      link: '/assistance',
      color: 'text-green-600 hover:text-green-800'
    },
    {
      title: 'Nos services',
      description: 'Découvrez nos services adaptés à votre zone',
      icon: <Settings className="w-5 h-5" />,
      link: '/services',
      color: 'text-purple-600 hover:text-purple-800'
    },
    {
      title: 'Nous contacter',
      description: 'Contactez-nous selon votre zone géographique',
      icon: <Phone className="w-5 h-5" />,
      link: '/contact',
      color: 'text-orange-600 hover:text-orange-800'
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background to-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Centre d'Aide
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Trouvez rapidement les réponses à vos questions sur nos services, 
            la géolocalisation intelligente et l'assistance technique.
          </p>
        </div>
      </section>

      {/* Navigation des catégories */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Choisissez une catégorie
            </h2>
            <p className="text-muted-foreground text-lg">
              Sélectionnez le type de questions qui vous intéressent
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {faqCategories.map((category) => (
              <Card 
                key={category.id}
                className={`cursor-pointer hover:shadow-elegant transition-smooth ${
                  activeTab === category.id ? 'ring-2 ring-primary' : ''
                }`}
                onClick={() => setActiveTab(category.id)}
              >
                <CardContent className="p-6 text-center">
                  <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 ${
                    activeTab === category.id ? 'bg-primary text-primary-foreground' : 'bg-primary-muted text-primary'
                  }`}>
                    {category.icon}
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{category.title}</h3>
                  <p className="text-sm text-muted-foreground">{category.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contenu des FAQ */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          {activeTab === 'general' && <GeneralFAQ />}
          {activeTab === 'geolocation' && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                FAQ Géolocalisation
              </h2>
              <p className="text-muted-foreground mb-6">
                Questions spécifiques sur le système de géolocalisation intelligent
              </p>
              <Button 
                className="btn-primary"
                onClick={() => window.location.href = '/geographic-demo'}
              >
                <Navigation className="w-4 h-4 mr-2" />
                Tester la géolocalisation
              </Button>
            </div>
          )}
          {activeTab === 'assistance' && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                FAQ Assistance Technique
              </h2>
              <p className="text-muted-foreground mb-6">
                Questions sur TeamViewer, support technique et formation
              </p>
              <Button 
                className="btn-primary"
                onClick={() => window.location.href = '/assistance'}
              >
                <Monitor className="w-4 h-4 mr-2" />
                Page d'assistance
              </Button>
            </div>
          )}
          {activeTab === 'services' && (
            <div className="text-center">
              <h2 className="text-2xl font-bold text-foreground mb-4">
                FAQ Services par Zone
              </h2>
              <p className="text-muted-foreground mb-6">
                Différences entre services PACA et Île-de-France
              </p>
              <Button 
                className="btn-primary"
                onClick={() => window.location.href = '/services'}
              >
                <Settings className="w-4 h-4 mr-2" />
                Nos services
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Liens rapides */}
      <section className="py-16 bg-background-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Liens Rapides
            </h2>
            <p className="text-muted-foreground text-lg">
              Accès direct aux fonctionnalités principales
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => (
              <Card key={index} className="hover:shadow-elegant transition-smooth">
                <CardContent className="p-6 text-center">
                  <div className="w-12 h-12 bg-primary-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                    <div className="text-primary">
                      {link.icon}
                    </div>
                  </div>
                  <h3 className="font-semibold text-foreground mb-2">{link.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{link.description}</p>
                  <Button 
                    variant="outline" 
                    className="w-full"
                    onClick={() => window.location.href = link.link}
                  >
                    Accéder
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact d'urgence */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-primary-muted rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Phone className="w-8 h-8 text-primary" />
              </div>
              <h2 className="text-2xl font-bold text-foreground mb-4">
                Besoin d'aide immédiate ?
              </h2>
              <p className="text-muted-foreground mb-6">
                Notre équipe d'experts Sage 100 est disponible pour vous accompagner 
                selon votre zone géographique.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="btn-primary">
                  <Phone className="w-4 h-4 mr-2" />
                  Appeler maintenant
                </Button>
                <Button variant="outline">
                  <Mail className="w-4 h-4 mr-2" />
                  Envoyer un email
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;
