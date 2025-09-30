import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  MapPin, 
  Shield, 
  Clock,
  Phone,
  Mail,
  Navigation,
  Search,
  CheckCircle,
  AlertCircle,
  Info,
  Settings,
  Users
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'geolocation' | 'services' | 'technical' | 'business';
  icon?: React.ReactNode;
}

const generalFAQ: FAQItem[] = [
  {
    id: 'geolocation-benefits',
    question: 'Pourquoi le site détecte-t-il ma localisation ?',
    answer: 'Notre système de géolocalisation intelligent adapte automatiquement nos services à votre zone géographique (PACA ou Île-de-France). Cela nous permet de vous proposer les services les plus adaptés à votre localisation et d\'optimiser votre expérience.',
    category: 'geolocation',
    icon: <MapPin className="w-5 h-5" />
  },
  {
    id: 'services-adaptation',
    question: 'Comment les services s\'adaptent-ils à ma zone ?',
    answer: 'PACA : Intervention sur site, formation locale, support technique régional. Île-de-France : Formation à distance, support technique, consultation. Les services, tarifs et délais sont automatiquement ajustés selon votre zone.',
    category: 'services',
    icon: <Settings className="w-5 h-5" />
  },
  {
    id: 'privacy-protection',
    question: 'Mes données de localisation sont-elles protégées ?',
    answer: 'Oui, nous respectons strictement le RGPD. Aucune donnée de localisation n\'est stockée. Le système détecte votre zone uniquement pour adapter l\'affichage, puis oublie cette information. Votre vie privée est préservée.',
    category: 'technical',
    icon: <Shield className="w-5 h-5" />
  },
  {
    id: 'manual-zone-selection',
    question: 'Puis-je choisir manuellement ma zone ?',
    answer: 'Absolument ! Si la détection automatique ne fonctionne pas ou si vous préférez, vous pouvez sélectionner manuellement votre zone via l\'interface. Le système vous propose toujours cette option.',
    category: 'geolocation',
    icon: <Navigation className="w-5 h-5" />
  },
  {
    id: 'pricing-differences',
    question: 'Les tarifs diffèrent-ils selon la zone ?',
    answer: 'Oui, les tarifs sont adaptés selon la zone : PACA (intervention sur site sur devis), Île-de-France (formation à distance à partir de 100€/h). Cela reflète les coûts réels et la valeur du service selon la localisation.',
    category: 'business',
    icon: <Info className="w-5 h-5" />
  },
  {
    id: 'response-times',
    question: 'Pourquoi les délais de réponse diffèrent ?',
    answer: 'PACA : 24-48h (déplacements physiques). Île-de-France : 24h (formation à distance). Ces délais sont réalistes et optimisés selon la distance et le type de service proposé.',
    category: 'services',
    icon: <Clock className="w-5 h-5" />
  },
  {
    id: 'teamviewer-usage',
    question: 'Qu\'est-ce que TeamViewer et pourquoi l\'utiliser ?',
    answer: 'TeamViewer permet une assistance technique à distance sécurisée. Nous pouvons nous connecter à votre poste pour résoudre vos problèmes Sage 100 en temps réel, sans vous déplacer. C\'est plus rapide et efficace.',
    category: 'technical',
    icon: <Users className="w-5 h-5" />
  },
  {
    id: 'sage-expertise',
    question: 'Quelle est votre expertise Sage 100 ?',
    answer: 'Consultant certifié Sage ligne 100, je suis spécialisé dans l\'installation, le paramétrage, la migration et la formation. J\'interviens en PACA et propose des formations à distance pour l\'Île-de-France.',
    category: 'business',
    icon: <CheckCircle className="w-5 h-5" />
  },
  {
    id: 'contact-methods',
    question: 'Comment vous contacter selon ma zone ?',
    answer: 'PACA : Intervention sur site, contact local (Antibes PACA). Île-de-France : Formation à distance, contact adapté (Paris Île-de-France). Le numéro reste le même (06 61 32 41 46) mais l\'adresse s\'adapte.',
    category: 'services',
    icon: <Phone className="w-5 h-5" />
  },
  {
    id: 'browser-compatibility',
    question: 'Le système fonctionne-t-il sur tous les navigateurs ?',
    answer: 'Oui, le système est compatible avec tous les navigateurs modernes (Chrome, Firefox, Safari, Edge). Si la géolocalisation n\'est pas disponible, le système utilise la détection IP ou la sélection manuelle.',
    category: 'technical',
    icon: <Search className="w-5 h-5" />
  },
  {
    id: 'mobile-compatibility',
    question: 'Fonctionne-t-il sur mobile ?',
    answer: 'Oui, le système fonctionne parfaitement sur mobile et tablette. La géolocalisation est même plus précise sur mobile grâce au GPS intégré. L\'interface s\'adapte automatiquement.',
    category: 'technical',
    icon: <Navigation className="w-5 h-5" />
  },
  {
    id: 'emergency-support',
    question: 'Y a-t-il un support d\'urgence ?',
    answer: 'Oui, nous proposons un support d\'urgence pour les situations critiques. Contactez-nous directement par téléphone (06 61 32 41 46) pour les urgences. Les tarifs d\'urgence sont sur devis selon la zone.',
    category: 'services',
    icon: <AlertCircle className="w-5 h-5" />
  }
];

const categoryLabels = {
  geolocation: 'Géolocalisation',
  services: 'Services',
  technical: 'Technique',
  business: 'Business'
};

const categoryColors = {
  geolocation: 'bg-blue-100 text-blue-800',
  services: 'bg-green-100 text-green-800',
  technical: 'bg-purple-100 text-purple-800',
  business: 'bg-orange-100 text-orange-800'
};

export default function GeneralFAQ() {
  const [openItems, setOpenItems] = useState<string[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const toggleItem = (itemId: string) => {
    setOpenItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const filteredFAQs = selectedCategory === 'all' 
    ? generalFAQ 
    : generalFAQ.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Questions Fréquentes
        </h2>
        <p className="text-muted-foreground text-lg">
          Tout ce que vous devez savoir sur nos services et notre système intelligent
        </p>
      </div>

      {/* Filtres par catégorie */}
      <div className="flex flex-wrap gap-2 justify-center">
        <Button
          variant={selectedCategory === 'all' ? 'default' : 'outline'}
          size="sm"
          onClick={() => setSelectedCategory('all')}
        >
          Toutes les questions
        </Button>
        {Object.entries(categoryLabels).map(([key, label]) => (
          <Button
            key={key}
            variant={selectedCategory === key ? 'default' : 'outline'}
            size="sm"
            onClick={() => setSelectedCategory(key)}
          >
            {label}
          </Button>
        ))}
      </div>

      {/* FAQ Items */}
      <div className="space-y-4">
        {filteredFAQs.map((item) => (
          <Card key={item.id} className="hover:shadow-elegant transition-smooth">
            <CardHeader 
              className="cursor-pointer"
              onClick={() => toggleItem(item.id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  {item.icon}
                  <CardTitle className="text-lg">{item.question}</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <Badge 
                    variant="secondary" 
                    className={categoryColors[item.category]}
                  >
                    {categoryLabels[item.category]}
                  </Badge>
                  {openItems.includes(item.id) ? (
                    <ChevronUp className="w-5 h-5 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="w-5 h-5 text-muted-foreground" />
                  )}
                </div>
              </div>
            </CardHeader>
            
            {openItems.includes(item.id) && (
              <CardContent className="pt-0">
                <div className="prose prose-sm max-w-none">
                  <p className="text-muted-foreground leading-relaxed">
                    {item.answer}
                  </p>
                </div>
              </CardContent>
            )}
          </Card>
        ))}
      </div>

      {/* Section d'aide supplémentaire */}
      <Card className="border-primary/20 bg-primary/5">
        <CardContent className="p-6">
          <div className="text-center">
            <HelpCircle className="w-12 h-12 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-foreground mb-2">
              Besoin d'aide supplémentaire ?
            </h3>
            <p className="text-muted-foreground mb-4">
              Notre équipe d'experts Sage 100 est disponible pour vous accompagner selon votre zone géographique.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="btn-primary">
                <Phone className="w-4 h-4 mr-2" />
                Nous contacter
              </Button>
              <Button variant="outline">
                <Mail className="w-4 h-4 mr-2" />
                Envoyer un email
              </Button>
              <Button variant="outline">
                <Navigation className="w-4 h-4 mr-2" />
                Test géolocalisation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
