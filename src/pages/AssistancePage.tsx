import { Button } from "@/components/ui/button";
import CTAButton from "@/components/ui/CTAButton";
import AssistanceFAQ from "@/components/geographic/AssistanceFAQ";
import { 
  Monitor, 
  Download,
  ExternalLink,
  Headphones,
  BookOpen,
  Video,
  ArrowRight,
  Shield,
  Database,
  Settings,
  HelpCircle,
  Clock,
  CheckCircle
} from "lucide-react";

const AssistancePage = () => {
  const assistanceServices = [
    {
      title: "TeamViewer - Prise en main à distance",
      description: "Assistance technique en temps réel pour résoudre vos problèmes rapidement",
      icon: <Monitor className="w-8 h-8" />,
      features: [
        "Connexion sécurisée à votre poste",
        "Résolution de problèmes en direct",
        "Formation personnalisée",
        "Support technique avancé"
      ],
      downloadLink: "https://www.teamviewer.com/fr/download/windows/",
      isPrimary: true
    },
    {
      title: "BI Reporting - Aide en ligne",
      description: "Ressources et documentation pour maîtriser BI Reporting",
      icon: <Database className="w-8 h-8" />,
      features: [
        "Documentation complète",
        "Tutoriels vidéo",
        "FAQ et dépannage",
        "Communauté d'experts"
      ],
      helpLink: "https://help.sage.fr/sage-100-gestion-commerciale/",
      isPrimary: false
    },
    {
      title: "SAGE 100 - Support technique",
      description: "Accès aux ressources officielles et aide en ligne SAGE 100",
      icon: <Settings className="w-8 h-8" />,
      features: [
        "Base de connaissances",
        "Guides d'utilisation",
        "Mises à jour et nouveautés",
        "Support technique SAGE"
      ],
      helpLink: "https://help.sage.fr/sage-100-gestion-commerciale/",
      isPrimary: false
    }
  ];

  const quickActions = [
    {
      title: "Télécharger TeamViewer",
      description: "Installer TeamViewer pour Windows",
      icon: <Download className="w-6 h-6" />,
      action: "download",
      link: "https://www.teamviewer.com/fr/download/windows/"
    },
    {
      title: "Aide BI Reporting",
      description: "Documentation et tutoriels",
      icon: <BookOpen className="w-6 h-6" />,
      action: "help",
      link: "https://help.sage.fr/sage-100-gestion-commerciale/"
    },
    {
      title: "Support SAGE 100",
      description: "Ressources officielles SAGE",
      icon: <HelpCircle className="w-6 h-6" />,
      action: "help",
      link: "https://help.sage.fr/sage-100-gestion-commerciale/"
    },
    {
      title: "Prendre RDV",
      description: "Assistance personnalisée",
      icon: <Clock className="w-6 h-6" />,
      action: "appointment",
      link: "/contact"
    }
  ];

  const supportSteps = [
    {
      step: "1",
      title: "Téléchargez TeamViewer",
      description: "Installez TeamViewer sur votre poste Windows pour permettre la connexion à distance"
    },
    {
      step: "2", 
      title: "Contactez-nous",
      description: "Prenez rendez-vous ou contactez-nous pour planifier votre session d'assistance"
    },
    {
      step: "3",
      title: "Session d'assistance",
      description: "Nous nous connectons à votre poste de manière sécurisée pour vous aider"
    },
    {
      step: "4",
      title: "Résolution",
      description: "Problème résolu ! Vous recevez un rapport détaillé de l'intervention"
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-background to-background-secondary overflow-hidden">
        {/* Pattern Background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, hsl(var(--primary)) 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Geometric shapes */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary/30 rounded-full blur-xl"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-accent/25 rounded-lg rotate-45 blur-lg"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-muted/40 rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 right-1/3 w-12 h-12 bg-primary/25 rotate-12 blur-lg"></div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Assistance Technique
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed max-w-3xl mx-auto">
            Support technique professionnel pour Sage 100, BI Reporting et TeamViewer. 
            Résolution rapide de vos problèmes avec notre expertise certifiée.
          </p>
        </div>
      </section>

      {/* Services d'assistance */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Nos services d'assistance
            </h2>
            <p className="text-muted-foreground text-lg">
              Choisissez le type d'assistance qui correspond à vos besoins
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {assistanceServices.map((service, index) => (
              <div key={index} className={`bg-card border border-border rounded-xl p-6 hover:shadow-elegant transition-smooth hover-lift ${
                service.isPrimary ? 'ring-2 ring-primary' : ''
              }`}>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                  service.isPrimary ? 'bg-primary text-primary-foreground' : 'bg-primary-muted text-primary'
                }`}>
                  {service.icon}
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-3">
                  {service.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {service.description}
                </p>
                
                <ul className="space-y-2 mb-6">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                      <CheckCircle className="w-4 h-4 text-primary mr-2 flex-shrink-0" />
                      {feature}
                    </li>
                  ))}
                </ul>
                
                <div className="space-y-2">
                  {service.downloadLink && (
                    <Button 
                      className="w-full bg-sage-primary text-sage-white hover:bg-sage-secondary"
                      onClick={() => window.open(service.downloadLink, '_blank')}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Télécharger TeamViewer
                    </Button>
                  )}
                  {service.helpLink && (
                    <Button 
                      variant="outline" 
                      className="w-full border-sage-primary text-sage-primary hover:bg-sage-primary hover:text-sage-white"
                      onClick={() => window.open(service.helpLink, '_blank')}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Aide en ligne
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Actions rapides */}
      <section className="py-16 bg-background-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Actions rapides
            </h2>
            <p className="text-muted-foreground text-lg">
              Accès direct aux ressources et outils d'assistance
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <div key={index} className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-elegant transition-smooth">
                <div className="w-12 h-12 bg-primary-muted rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <div className="text-primary">
                    {action.icon}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {action.title}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4">
                  {action.description}
                </p>
                
                <Button 
                  variant="outline" 
                  size="sm"
                  className="w-full border-sage-dark text-sage-dark hover:bg-sage-dark hover:text-sage-white"
                  onClick={() => {
                    if (action.action === 'appointment') {
                      window.location.href = action.link;
                    } else {
                      window.open(action.link, '_blank');
                    }
                  }}
                >
                  {action.action === 'download' && <Download className="w-4 h-4 mr-2" />}
                  {action.action === 'help' && <ExternalLink className="w-4 h-4 mr-2" />}
                  {action.action === 'appointment' && <Clock className="w-4 h-4 mr-2" />}
                  {action.action === 'download' ? 'Télécharger' : 
                   action.action === 'help' ? 'Accéder' : 'Prendre RDV'}
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Processus d'assistance */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Comment ça marche ?
            </h2>
            <p className="text-muted-foreground text-lg">
              Processus simple et sécurisé pour votre assistance technique
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {supportSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Informations de sécurité */}
      <section className="py-16 bg-background-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-card border border-border rounded-2xl p-8">
            <div className="w-16 h-16 bg-primary-muted rounded-2xl flex items-center justify-center mx-auto mb-6">
              <Shield className="w-8 h-8 text-primary" />
            </div>
            
            <h2 className="text-2xl font-bold text-foreground mb-4">
              Sécurité garantie
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Toutes nos sessions d'assistance sont sécurisées et chiffrées. 
              Nous respectons votre confidentialité et ne conservons aucune donnée sensible.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 text-sm">
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Connexion chiffrée</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Confidentialité respectée</span>
              </div>
              <div className="flex items-center justify-center space-x-2">
                <CheckCircle className="w-4 h-4 text-primary" />
                <span>Session contrôlée</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Besoin d'assistance immédiate ?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8">
            Contactez-nous dès maintenant pour une assistance technique personnalisée 
            et professionnelle.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton variant="accent" size="lg" icon="calendar">
              Prendre rendez-vous
            </CTAButton>
            <Button 
              variant="outline" 
              size="lg"
              className="bg-transparent border-sage-white text-sage-white hover:bg-sage-white hover:text-sage-primary"
              onClick={() => window.open('https://www.teamviewer.com/fr/download/windows/', '_blank')}
            >
              <Download className="w-4 h-4 mr-2" />
              Télécharger TeamViewer
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <AssistanceFAQ />
        </div>
      </section>
    </div>
  );
};

export default AssistancePage;
