import ServiceCard from "@/components/ui/ServiceCard";
import { Button } from "@/components/ui/button";
import CTAButton from "@/components/ui/CTAButton";
import { 
  Settings, 
  Zap, 
  RefreshCw, 
  GraduationCap,
  CheckCircle,
  Clock,
  Shield,
  Users
} from "lucide-react";

const ServicesPage = () => {
  const mainServices = [
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Installation Sage 100",
      description: "Installation complète et sécurisée de votre logiciel Sage 100 avec configuration optimale selon vos besoins métier.",
      features: [
        "Analyse préalable de votre infrastructure",
        "Installation sur site ou à distance",
        "Configuration des modules requis",
        "Paramétrage des droits utilisateurs",
        "Tests complets de fonctionnement",
        "Formation de prise en main incluse",
        "Documentation personnalisée",
        "Support post-installation 30 jours"
      ],
      price: "À partir de 890€",
      featured: true
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Paramétrage personnalisé",
      description: "Adaptation complète de Sage 100 aux spécificités de votre entreprise et optimisation des processus métier.",
      features: [
        "Audit de vos processus actuels",
        "Paramétrage sur mesure des modules",
        "Création de plans comptables personnalisés",
        "Configuration des articles et tarifs",
        "Modèles de documents personnalisés",
        "Automatisation des tâches répétitives",
        "Tests et validation utilisateurs",
        "Formation aux nouveaux processus"
      ],
      price: "À partir de 650€"
    },
    {
      icon: <RefreshCw className="w-6 h-6" />,
      title: "Migration de version",
      description: "Mise à jour sécurisée vers les dernières versions de Sage 100 avec préservation de toutes vos données.",
      features: [
        "Audit technique de compatibilité",
        "Sauvegarde complète sécurisée",
        "Migration progressive des données",
        "Vérification intégrité des données",
        "Test de toutes les fonctionnalités",
        "Formation aux nouvelles fonctionnalités",
        "Support prioritaire 60 jours",
        "Plan de retour en arrière si nécessaire"
      ],
      price: "À partir de 750€"
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: "Formation à distance",
      description: "Sessions de formation personnalisées pour maîtriser Sage 100 et optimiser votre productivité.",
      features: [
        "Formations individuelles ou en groupe",
        "Contenu adapté à votre niveau",
        "Support pédagogique personnalisé",
        "Exercices pratiques sur vos données",
        "Enregistrement des sessions",
        "Suivi post-formation inclus",
        "Certification de formation",
        "Support technique 15 jours"
      ],
      price: "120€/heure"
    }
  ];

  const additionalServices = [
    {
      icon: <Shield className="w-5 h-5" />,
      title: "Audit et optimisation",
      description: "Analyse complète de votre installation Sage 100 et recommandations d'amélioration.",
      price: "À partir de 450€"
    },
    {
      icon: <Users className="w-5 h-5" />,
      title: "Support technique",
      description: "Assistance technique ponctuelle ou contrat de maintenance pour votre Sage 100.",
      price: "À partir de 80€/heure"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Intervention d'urgence",
      description: "Résolution rapide des problèmes critiques en moins de 4h ouvrées.",
      price: "À partir de 150€/heure"
    }
  ];

  const processSteps = [
    {
      step: "1",
      title: "Analyse des besoins",
      description: "Évaluation gratuite de votre situation actuelle et définition des objectifs."
    },
    {
      step: "2", 
      title: "Proposition personnalisée",
      description: "Élaboration d'une solution sur mesure avec devis détaillé sous 48h."
    },
    {
      step: "3",
      title: "Réalisation",
      description: "Intervention selon planning convenu avec points d'étape réguliers."
    },
    {
      step: "4",
      title: "Formation & suivi",
      description: "Formation des utilisateurs et accompagnement post-mise en œuvre."
    }
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-br from-background to-background-secondary overflow-hidden">
        {/* Pattern Background */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 25px 25px, hsl(var(--primary)) 2px, transparent 2px)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
        
        {/* Geometric shapes */}
        <div className="absolute top-10 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-accent/10 rounded-lg rotate-45 blur-lg"></div>
        <div className="absolute bottom-20 left-1/4 w-24 h-24 bg-secondary-dark/10 rounded-full blur-2xl"></div>
        <div className="absolute bottom-32 right-1/3 w-12 h-12 bg-primary/10 rotate-12 blur-lg"></div>
        
        {/* Content */}
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
            Services professionnels Sage 100
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed mb-8">
            Des solutions complètes et personnalisées pour optimiser votre gestion 
            d'entreprise avec Sage 100. Accompagnement expert de A à Z.
          </p>
          <CTAButton variant="primary" size="lg" icon="calendar">
            Demander un devis gratuit
          </CTAButton>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Services principaux
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Que vous souhaitiez installer, paramétrer, migrer ou vous former à Sage 100, 
              je vous accompagne avec expertise et professionnalisme.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8">
            {mainServices.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-background-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ma méthode de travail
            </h2>
            <p className="text-xl text-muted-foreground">
              Un processus éprouvé pour garantir le succès de votre projet
            </p>
          </div>
          
          <div className="grid md:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-primary-foreground font-bold text-xl">
                    {step.step}
                  </span>
                </div>
                <h3 className="text-lg font-semibold mb-4">{step.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Services */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Services complémentaires
            </h2>
            <p className="text-xl text-muted-foreground">
              Solutions additionnelles pour un accompagnement complet
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {additionalServices.map((service, index) => (
              <div key={index} className="service-card text-center">
                <div className="w-12 h-12 bg-primary-muted rounded-lg flex items-center justify-center mx-auto mb-4">
                  <div className="text-primary">{service.icon}</div>
                </div>
                <h3 className="text-lg font-semibold mb-3">{service.title}</h3>
                <p className="text-muted-foreground text-sm mb-4">{service.description}</p>
                <p className="text-primary font-medium text-sm mb-6">{service.price}</p>
                <CTAButton variant="secondary" size="sm">
                  En savoir plus
                </CTAButton>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Guarantee Section */}
      <section className="py-16 bg-accent-light">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <CheckCircle className="w-16 h-16 text-accent mx-auto mb-6" />
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
            Garantie satisfaction
          </h2>
          <p className="text-lg text-muted-foreground mb-6">
            Je m'engage à votre réussite. Si vous n'êtes pas entièrement satisfait 
            de mon intervention, je m'engage à corriger tous les points jusqu'à 
            votre entière satisfaction.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center text-sm text-muted-foreground">
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>Intervention sous 48h</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>Support inclus</span>
            </div>
            <div className="flex items-center space-x-2">
              <CheckCircle className="w-4 h-4 text-accent" />
              <span>Devis gratuit</span>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à démarrer votre projet ?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8">
            Contactez-moi dès aujourd'hui pour discuter de vos besoins 
            et recevoir une proposition personnalisée sous 48h.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton variant="accent" size="lg" icon="calendar">
              Prendre rendez-vous
            </CTAButton>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              Télécharger la brochure
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesPage;