import { Button } from "@/components/ui/button";
import CTAButton from "@/components/ui/CTAButton";
import { Award, Users, Clock, Target, BookOpen, Handshake } from "lucide-react";

const AboutPage = () => {
  const certifications = [
    {
      title: "Sage 100 Comptabilité",
      year: "2019",
      level: "Expert"
    },
    {
      title: "Sage 100 Gestion Commerciale", 
      year: "2020",
      level: "Expert"
    },
    {
      title: "Sage 100 Paie",
      year: "2021", 
      level: "Certifié"
    }
  ];

  const experiences = [
    {
      company: "Cabinet comptable Durand & Associés",
      role: "Consultant ERP Senior",
      period: "2019 - 2023",
      description: "Responsable de l'implémentation Sage 100 pour +50 clients PME/TPE"
    },
    {
      company: "SAS TechConseil",
      role: "Formateur Sage agréé",
      period: "2017 - 2019", 
      description: "Formation et accompagnement utilisateurs sur l'ensemble de la gamme Sage"
    },
    {
      company: "Groupe INFORMATECH",
      role: "Technicien ERP",
      period: "2016 - 2017",
      description: "Support technique et maintenance des installations Sage"
    }
  ];

  const values = [
    {
      icon: <Target className="w-6 h-6" />,
      title: "Expertise",
      description: "Une connaissance approfondie de Sage 100 acquise sur le terrain"
    },
    {
      icon: <Handshake className="w-6 h-6" />,
      title: "Proximité",
      description: "Un accompagnement personnalisé et un contact direct avec le consultant"
    },
    {
      icon: <BookOpen className="w-6 h-6" />,
      title: "Pédagogie",
      description: "Des formations adaptées à votre niveau et vos besoins métier"
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
            À propos de votre consultant
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Consultant indépendant spécialisé en solutions Sage 100, 
            je vous accompagne dans l'optimisation de votre gestion d'entreprise 
            avec un service personnalisé et professionnel.
          </p>
        </div>
      </section>

      {/* Profile Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-6">
                Briane LEFEBVRE
              </h2>
              <p className="text-lg text-muted-foreground mb-6 leading-relaxed">
                Passionné par les systèmes d'information et fort de 8 années d'expérience 
                dans l'écosystème Sage, j'ai décidé de créer SAS 1 GESTION pour offrir 
                aux entreprises un service de proximité et d'expertise.
              </p>
              <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                Mon objectif est simple : vous faire gagner du temps et optimiser votre 
                productivité grâce à une utilisation experte de Sage 100. Chaque projet 
                est unique, c'est pourquoi j'adapte mes interventions à vos besoins spécifiques.
              </p>
              
              <div className="grid grid-cols-2 gap-6 mb-8">
                <div className="text-center p-4 bg-primary-muted rounded-lg">
                  <div className="text-2xl font-bold text-primary mb-1">150+</div>
                  <div className="text-sm text-muted-foreground">Projets réalisés</div>
                </div>
                <div className="text-center p-4 bg-accent-light rounded-lg">
                  <div className="text-2xl font-bold text-accent mb-1">8</div>
                  <div className="text-sm text-muted-foreground">Années d'expérience</div>
                </div>
              </div>
              
              <CTAButton variant="primary" icon="calendar">
                Prendre rendez-vous
              </CTAButton>
            </div>
            
            <div className="lg:order-first">
              <div className="bg-gradient-to-br from-primary to-accent rounded-2xl p-8 text-white">
                <div className="w-24 h-24 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Award className="w-12 h-12" />
                </div>
                <h3 className="text-xl font-semibold text-center mb-4">
                  Consultant Certifié Sage
                </h3>
                <div className="space-y-3">
                  {certifications.map((cert, index) => (
                    <div key={index} className="flex justify-between items-center bg-white/10 rounded-lg p-3">
                      <div>
                        <div className="font-medium">{cert.title}</div>
                        <div className="text-sm opacity-80">{cert.level}</div>
                      </div>
                      <div className="text-sm font-medium">{cert.year}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-background-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Mes valeurs
            </h2>
            <p className="text-lg text-muted-foreground">
              Les principes qui guident mon approche professionnelle
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <div className="text-primary-foreground">
                    {value.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-4">{value.title}</h3>
                <p className="text-muted-foreground leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Parcours professionnel
            </h2>
            <p className="text-lg text-muted-foreground">
              Une expérience solide au service de votre projet
            </p>
          </div>
          
          <div className="space-y-8">
            {experiences.map((exp, index) => (
              <div key={index} className="bg-card border border-border rounded-lg p-6 hover:shadow-elegant transition-smooth">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground">{exp.role}</h3>
                    <p className="text-primary font-medium">{exp.company}</p>
                  </div>
                  <div className="text-muted-foreground font-medium mt-2 md:mt-0">
                    {exp.period}
                  </div>
                </div>
                <p className="text-muted-foreground leading-relaxed">
                  {exp.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Discutons de votre projet
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8">
            Chaque entreprise est unique. Échangeons sur vos besoins spécifiques 
            et trouvons ensemble la meilleure solution.
          </p>
          <CTAButton variant="accent" size="lg" icon="calendar">
            Planifier un échange gratuit
          </CTAButton>
        </div>
      </section>
    </div>
  );
};

export default AboutPage;