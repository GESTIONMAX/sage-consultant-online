import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronDown, 
  ChevronUp, 
  HelpCircle, 
  Monitor, 
  Shield, 
  Clock,
  Phone,
  Mail,
  Download,
  ExternalLink,
  CheckCircle,
  AlertCircle,
  Info,
  Wifi
} from 'lucide-react';

interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: 'teamviewer' | 'services' | 'technical' | 'pricing';
  icon?: React.ReactNode;
}

const assistanceFAQ: FAQItem[] = [
  {
    id: 'teamviewer-download',
    question: 'Comment télécharger TeamViewer ?',
    answer: 'Cliquez sur le bouton "Télécharger TeamViewer" sur cette page. Le téléchargement se fait directement depuis le site officiel TeamViewer. Une fois installé, nous pourrons nous connecter à votre poste de manière sécurisée.',
    category: 'teamviewer',
    icon: <Download className="w-5 h-5" />
  },
  {
    id: 'teamviewer-security',
    question: 'TeamViewer est-il sécurisé ?',
    answer: 'Oui, TeamViewer utilise un chiffrement de niveau bancaire (AES 256-bit). Chaque session est protégée par un mot de passe unique généré automatiquement. Vous gardez le contrôle total et pouvez interrompre la session à tout moment.',
    category: 'teamviewer',
    icon: <Shield className="w-5 h-5" />
  },
  {
    id: 'session-control',
    question: 'Puis-je contrôler la session TeamViewer ?',
    answer: 'Absolument ! Vous voyez tout ce que nous faisons en temps réel. Vous pouvez reprendre le contrôle à tout moment, interrompre la session, ou masquer votre écran. Vous gardez une visibilité complète de nos actions.',
    category: 'teamviewer',
    icon: <Monitor className="w-5 h-5" />
  },
  {
    id: 'paca-services',
    question: 'Quels services sont disponibles en PACA ?',
    answer: 'En PACA : Intervention sur site, formation locale, support technique régional, audit et optimisation, migration Sage 100, paramétrage personnalisé. Nous nous déplaçons dans toute la région pour vous accompagner.',
    category: 'services',
    icon: <CheckCircle className="w-5 h-5" />
  },
  {
    id: 'idf-services',
    question: 'Quels services sont disponibles en Île-de-France ?',
    answer: 'En Île-de-France : Formation à distance, support technique, consultation Sage 100, migration assistée, formation utilisateurs, audit comptable. Nous privilégions la formation à distance pour cette zone.',
    category: 'services',
    icon: <Wifi className="w-5 h-5" />
  },
  {
    id: 'response-times',
    question: 'Quels sont les délais de réponse selon la zone ?',
    answer: 'PACA : 24-48h (déplacements physiques). Île-de-France : 24h (formation à distance). Ces délais sont optimisés selon la distance et le type de service. Les urgences sont traitées en priorité.',
    category: 'services',
    icon: <Clock className="w-5 h-5" />
  },
  {
    id: 'pricing-differences',
    question: 'Les tarifs diffèrent-ils selon la zone ?',
    answer: 'Oui, les tarifs sont adaptés selon la zone : PACA (intervention sur site sur devis), Île-de-France (formation à distance à partir de 100€/h). Cela reflète les coûts réels et la valeur du service selon la localisation.',
    category: 'pricing',
    icon: <Info className="w-5 h-5" />
  },
  {
    id: 'emergency-support',
    question: 'Y a-t-il un support d\'urgence ?',
    answer: 'Oui, nous proposons un support d\'urgence pour les situations critiques. Contactez-nous directement par téléphone (06 61 32 41 46) pour les urgences. Les tarifs d\'urgence sont sur devis selon la zone.',
    category: 'services',
    icon: <AlertCircle className="w-5 h-5" />
  },
  {
    id: 'technical-requirements',
    question: 'Quels sont les prérequis techniques ?',
    answer: 'Pour TeamViewer : Windows 7+, connexion internet stable. Pour la formation à distance : navigateur moderne, micro/casque, webcam optionnelle. Pour l\'intervention sur site : accès physique à votre serveur Sage 100.',
    category: 'technical',
    icon: <Monitor className="w-5 h-5" />
  },
  {
    id: 'data-protection',
    question: 'Mes données sont-elles protégées ?',
    answer: 'Absolument ! Nous respectons le RGPD et la confidentialité de vos données. Aucune donnée sensible n\'est stockée. Les sessions TeamViewer sont chiffrées et nous signons des accords de confidentialité si nécessaire.',
    category: 'technical',
    icon: <Shield className="w-5 h-5" />
  },
  {
    id: 'scheduling',
    question: 'Comment planifier une session ?',
    answer: 'Utilisez le bouton "Prendre rendez-vous" sur cette page ou contactez-nous directement. Nous planifions selon votre disponibilité et la zone géographique. Les créneaux sont adaptés selon la distance.',
    category: 'services',
    icon: <Clock className="w-5 h-5" />
  },
  {
    id: 'follow-up',
    question: 'Y a-t-il un suivi après la session ?',
    answer: 'Oui, nous fournissons un rapport détaillé de l\'intervention, des recommandations personnalisées, et un suivi gratuit pendant 30 jours. Nous restons disponibles pour toute question complémentaire.',
    category: 'services',
    icon: <CheckCircle className="w-5 h-5" />
  }
];

const categoryLabels = {
  teamviewer: 'TeamViewer',
  services: 'Services',
  technical: 'Technique',
  pricing: 'Tarifs'
};

const categoryColors = {
  teamviewer: 'bg-blue-100 text-blue-800',
  services: 'bg-green-100 text-green-800',
  technical: 'bg-purple-100 text-purple-800',
  pricing: 'bg-orange-100 text-orange-800'
};

export default function AssistanceFAQ() {
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
    ? assistanceFAQ 
    : assistanceFAQ.filter(item => item.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="text-center">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          FAQ Assistance Technique
        </h2>
        <p className="text-muted-foreground text-lg">
          Réponses aux questions les plus fréquentes sur nos services d'assistance
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
              Besoin d'aide personnalisée ?
            </h3>
            <p className="text-muted-foreground mb-4">
              Notre équipe d'experts Sage 100 est disponible pour vous accompagner selon votre zone géographique.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button className="bg-sage-primary text-sage-white hover:bg-sage-secondary">
                <Phone className="w-4 h-4 mr-2" />
                Appeler maintenant
              </Button>
              <Button variant="outline" className="border-sage-primary text-sage-primary hover:bg-sage-primary hover:text-sage-white">
                <Mail className="w-4 h-4 mr-2" />
                Envoyer un email
              </Button>
              <Button variant="outline" className="border-sage-dark text-sage-dark hover:bg-sage-dark hover:text-sage-white">
                <Download className="w-4 h-4 mr-2" />
                Télécharger TeamViewer
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
