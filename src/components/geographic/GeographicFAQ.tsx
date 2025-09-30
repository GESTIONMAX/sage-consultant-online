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
  Info
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'general' | 'technical' | 'privacy' | 'services';
  icon?: React.ReactNode;
}

const faqData: FAQItem[] = [
  {
    id: 'what-is-geolocation',
    question: 'Qu\'est-ce que la géolocalisation intelligente ?',
    answer: 'Notre système détecte automatiquement votre zone géographique (PACA ou Île-de-France) pour adapter nos services à vos besoins spécifiques. Cela nous permet de vous proposer les services les plus adaptés à votre localisation.',
    category: 'general',
    icon: <MapPin className="w-5 h-5" />
  },
  {
    id: 'how-detection-works',
    question: 'Comment fonctionne la détection automatique ?',
    answer: 'Le système utilise plusieurs méthodes : 1) Géolocalisation GPS de votre navigateur, 2) Détection par adresse IP, 3) Recherche par ville ou code postal. Si une méthode échoue, le système passe automatiquement à la suivante.',
    category: 'technical',
    icon: <Navigation className="w-5 h-5" />
  },
  {
    id: 'privacy-concerns',
    question: 'Mes données de localisation sont-elles stockées ?',
    answer: 'Non, aucune donnée de localisation n\'est stockée. Le système détecte votre zone uniquement pour adapter l\'affichage, puis oublie cette information. Nous respectons votre vie privée et le RGPD.',
    category: 'privacy',
    icon: <Shield className="w-5 h-5" />
  },
  {
    id: 'services-difference',
    question: 'Quelle est la différence entre les services PACA et Île-de-France ?',
    answer: 'PACA : Intervention sur site, formation locale, support technique régional. Île-de-France : Formation à distance, support technique, consultation. Les services sont adaptés selon votre zone pour optimiser votre expérience.',
    category: 'services',
    icon: <CheckCircle className="w-5 h-5" />
  },
  {
    id: 'manual-selection',
    question: 'Puis-je choisir manuellement ma zone ?',
    answer: 'Oui, si la détection automatique ne fonctionne pas ou si vous préférez, vous pouvez sélectionner manuellement votre zone via le bouton "Choisir manuellement" dans l\'interface.',
    category: 'general',
    icon: <Search className="w-5 h-5" />
  },
  {
    id: 'detection-fails',
    question: 'Que se passe-t-il si la détection échoue ?',
    answer: 'Le système utilise la zone PACA par défaut (notre zone principale) et vous permet de sélectionner manuellement votre zone. Vous ne perdez aucune fonctionnalité.',
    category: 'technical',
    icon: <AlertCircle className="w-5 h-5" />
  },
  {
    id: 'response-times',
    question: 'Pourquoi les délais de réponse diffèrent selon la zone ?',
    answer: 'PACA : 24-48h (déplacements physiques). Île-de-France : 24h (formation à distance). Ces délais sont réalistes et optimisés selon la distance et le type de service.',
    category: 'services',
    icon: <Clock className="w-5 h-5" />
  },
  {
    id: 'pricing-differences',
    question: 'Les tarifs sont-ils différents selon la zone ?',
    answer: 'Oui, les tarifs sont adaptés selon la zone : PACA (intervention sur site), Île-de-France (formation à distance). Cela reflète les coûts réels et la valeur du service selon la localisation.',
    category: 'services',
    icon: <Info className="w-5 h-5" />
  },
  {
    id: 'browser-compatibility',
    question: 'Le système fonctionne-t-il sur tous les navigateurs ?',
    answer: 'Oui, le système est compatible avec tous les navigateurs modernes (Chrome, Firefox, Safari, Edge). Si la géolocalisation n\'est pas disponible, le système utilise la détection IP.',
    category: 'technical',
    icon: <Navigation className="w-5 h-5" />
  },
  {
    id: 'mobile-devices',
    question: 'Fonctionne-t-il sur mobile ?',
    answer: 'Oui, le système fonctionne parfaitement sur mobile et tablette. La géolocalisation est même plus précise sur mobile grâce au GPS intégré.',
    category: 'technical',
    icon: <Phone className="w-5 h-5" />
  },
  {
    id: 'vpn-users',
    question: 'Que se passe-t-il si j\'utilise un VPN ?',
    answer: 'Le système détecte que vous utilisez un VPN et vous propose de sélectionner manuellement votre zone. Cela évite les erreurs de détection liées aux VPN.',
    category: 'technical',
    icon: <Shield className="w-5 h-5" />
  },
  {
    id: 'contact-information',
    question: 'Les informations de contact changent-elles selon la zone ?',
    answer: 'Oui, le contact affiché s\'adapte à votre zone : PACA (Antibes PACA), Île-de-France (Paris Île-de-France). Le numéro reste le même, mais l\'adresse est adaptée.',
    category: 'services',
    icon: <Mail className="w-5 h-5" />
  }
];

const categoryLabels = {
  general: 'Général',
  technical: 'Technique',
  privacy: 'Confidentialité',
  services: 'Services'
};

const categoryColors = {
  general: 'bg-blue-100 text-blue-800',
  technical: 'bg-green-100 text-green-800',
  privacy: 'bg-purple-100 text-purple-800',
  services: 'bg-orange-100 text-orange-800'
};

export default function GeographicFAQ() {
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
    ? faqData 
    : faqData.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Questions Fréquentes
        </h2>
        <p className="text-muted-foreground text-lg">
          Tout ce que vous devez savoir sur notre système de géolocalisation intelligent
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
              Notre équipe est là pour vous accompagner dans l'utilisation du système de géolocalisation.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-sage-primary text-sage-white hover:bg-sage-secondary">
                <Phone className="w-4 h-4 mr-2" />
                Nous contacter
              </Button>
              <Button variant="outline" className="border-sage-primary text-sage-primary hover:bg-sage-primary hover:text-sage-white">
                <Mail className="w-4 h-4 mr-2" />
                Envoyer un email
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
