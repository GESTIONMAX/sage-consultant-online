import { Button } from "@/components/ui/button";
import ServiceCard from "@/components/ui/ServiceCard";
import TestimonialCard from "@/components/ui/TestimonialCard";
import CTAButton from "@/components/ui/CTAButton";
import { 
  Settings, 
  Users, 
  Zap, 
  GraduationCap, 
  CheckCircle, 
  Star,
  Award,
  Clock,
  Shield
} from "lucide-react";

const HomePage = () => {
  const services = [
    {
      icon: <Settings className="w-6 h-6" />,
      title: "Installation Sage 100",
      description: "Installation complète et configuration optimale de votre logiciel Sage 100.",
      features: [
        "Installation sur site ou à distance",
        "Configuration des modules",
        "Tests de fonctionnement",
        "Formation de base incluse"
      ],
      price: "À partir de 890€",
      featured: true
    },
    {
      icon: <Zap className="w-6 h-6" />,
      title: "Paramétrage personnalisé",
      description: "Adaptation complète de Sage 100 aux spécificités de votre entreprise.",
      features: [
        "Analyse de vos besoins",
        "Paramétrage sur mesure",
        "Création de modèles",
        "Tests et validation"
      ],
      price: "À partir de 650€"
    },
    {
      icon: <Users className="w-6 h-6" />,
      title: "Migration de version",
      description: "Mise à jour sécurisée vers les dernières versions de Sage 100.",
      features: [
        "Sauvegarde complète",
        "Migration des données",
        "Vérification intégrité",
        "Support post-migration"
      ],
      price: "À partir de 750€"
    },
    {
      icon: <GraduationCap className="w-6 h-6" />,
      title: "Formation à distance",
      description: "Sessions de formation personnalisées pour maîtriser Sage 100.",
      features: [
        "Sessions individuelles",
        "Support pédagogique",
        "Exercices pratiques",
        "Suivi personnalisé"
      ],
      price: "120€/heure"
    }
  ];

  const testimonials = [
    {
      name: "Marie Dubois",
      role: "Directrice Administrative",
      company: "Entreprise Martin & Fils",
      content: "Installation parfaite et formation très professionnelle. Notre équipe maîtrise maintenant parfaitement Sage 100. Je recommande vivement !",
      rating: 5
    },
    {
      name: "Pierre Morel",
      role: "Gérant",
      company: "SAS TechnoPlus",
      content: "Migration réussie sans aucun problème. Service impeccable, très réactif et à l'écoute. Un vrai professionnel !",
      rating: 5
    },
    {
      name: "Sophie Laurent",
      role: "Responsable Comptabilité",
      company: "SARL InnovServices",
      content: "Les formations à distance sont excellentes, très pédagogiques. J'ai pu rapidement monter en compétence sur les modules avancés.",
      rating: 5
    }
  ];

  const stats = [
    { number: "150+", label: "Clients satisfaits" },
    { number: "8", label: "Années d'expérience" },
    { number: "98%", label: "Taux de satisfaction" },
    { number: "48h", label: "Délai d'intervention" }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="hero-gradient pt-24 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <div className="flex justify-center lg:justify-start mb-6">
                <div className="inline-flex items-center space-x-3 bg-white/10 backdrop-blur-sm rounded-full px-6 py-3 text-white">
                  <img
                    src="/sage-logo-green.svg"
                    alt="Sage Logo"
                    className="h-6 w-auto"
                  />
                  <span className="text-sm font-medium">Consultant Sage Certifié</span>
                  <Award className="w-4 h-4" />
                </div>
              </div>
              
              <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
                Expert Sage 100<br />
                <span className="text-white/90">pour votre entreprise</span>
              </h1>
              
              <p className="text-xl text-white/80 mb-8 max-w-3xl lg:max-w-none leading-relaxed">
                Installation, paramétrage, migration et formation Sage 100. 
                Un accompagnement professionnel pour optimiser votre gestion d'entreprise.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
                <CTAButton variant="accent" size="lg" icon="calendar">
                  Prendre rendez-vous gratuit
                </CTAButton>
                <Button size="lg" variant="outline" className="text-white border-white/30 hover:bg-white/10">
                  Découvrir les services
                </Button>
              </div>
            </div>
            
            <div className="relative">
              <div className="relative overflow-hidden rounded-2xl shadow-2xl">
                <img 
                  src="/lovable-uploads/9733d6d7-23f6-4351-829c-ae7d5009e901.png" 
                  alt="Consultant travaillant sur Sage 100 avec tableaux de bord"
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">
                  {stat.number}
                </div>
                <div className="text-muted-foreground">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Services professionnels
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Des solutions complètes pour tous vos besoins Sage 100, 
              de l'installation à la formation avancée.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((service, index) => (
              <ServiceCard key={index} {...service} />
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Pourquoi choisir SAS 1 GESTION ?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Award className="w-8 h-8 text-primary-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Expertise certifiée</h3>
              <p className="text-muted-foreground">
                Consultant indépendant certifié Sage avec 8 ans d'expérience 
                dans l'implémentation et la formation.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Clock className="w-8 h-8 text-accent-foreground" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Réactivité garantie</h3>
              <p className="text-muted-foreground">
                Intervention sous 48h et support continu pour assurer 
                la continuité de votre activité.
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-16 h-16 bg-secondary-dark rounded-2xl flex items-center justify-center mx-auto mb-6">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Accompagnement sur mesure</h3>
              <p className="text-muted-foreground">
                Solutions personnalisées selon vos besoins spécifiques, 
                sans passer par des intermédiaires.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Témoignages clients
            </h2>
            <p className="text-xl text-muted-foreground">
              Découvrez ce que nos clients pensent de nos services
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <TestimonialCard key={index} {...testimonial} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Prêt à optimiser votre gestion avec Sage 100 ?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8">
            Contactez-moi pour un audit gratuit de vos besoins et 
            découvrez comment je peux vous accompagner.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <CTAButton variant="accent" size="lg" icon="calendar">
              Réserver un audit gratuit
            </CTAButton>
            <Button size="lg" variant="outline" className="border-white/30 text-white hover:bg-white/10">
              <span>Voir tous les services</span>
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;