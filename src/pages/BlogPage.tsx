import { Button } from "@/components/ui/button";
import CTAButton from "@/components/ui/CTAButton";
import { 
  Calendar, 
  Clock, 
  Download,
  BookOpen,
  FileText,
  Video,
  ArrowRight
} from "lucide-react";

const BlogPage = () => {
  const articles = [
    {
      title: "Guide complet : Bien choisir sa version Sage 100",
      excerpt: "Comparatif détaillé des différentes versions de Sage 100 pour vous aider à faire le bon choix selon vos besoins.",
      category: "Guide",
      readTime: "8 min",
      date: "15 mars 2024",
      featured: true
    },
    {
      title: "Migration Sage 100 : les étapes clés pour réussir",
      excerpt: "Découvrez la méthodologie éprouvée pour migrer en toute sécurité vers une nouvelle version de Sage 100.",
      category: "Migration",
      readTime: "6 min", 
      date: "28 février 2024"
    },
    {
      title: "Optimiser sa comptabilité avec Sage 100",
      excerpt: "Conseils pratiques pour gagner du temps et améliorer votre productivité en comptabilité.",
      category: "Productivité",
      readTime: "5 min",
      date: "12 février 2024"
    },
    {
      title: "Sauvegardes Sage 100 : bonnes pratiques",
      excerpt: "Les règles d'or pour sécuriser vos données et éviter les mauvaises surprises.",
      category: "Sécurité", 
      readTime: "4 min",
      date: "30 janvier 2024"
    },
    {
      title: "Paramétrage initial : éviter les erreurs courantes",
      excerpt: "Les pièges à éviter lors du premier paramétrage de votre Sage 100.",
      category: "Paramétrage",
      readTime: "7 min",
      date: "18 janvier 2024"
    },
    {
      title: "Formation utilisateurs : méthodes efficaces",
      excerpt: "Comment former efficacement vos équipes à l'utilisation de Sage 100.",
      category: "Formation",
      readTime: "6 min",
      date: "5 janvier 2024"
    }
  ];

  const resources = [
    {
      title: "Checklist pré-installation Sage 100",
      description: "Liste complète des prérequis techniques et organisationnels",
      type: "PDF",
      icon: <FileText className="w-5 h-5" />
    },
    {
      title: "Guide de démarrage rapide",
      description: "Premier paramétrage et prise en main en 30 minutes", 
      type: "PDF",
      icon: <BookOpen className="w-5 h-5" />
    },
    {
      title: "Webinaire : Nouveautés Sage 100 2024",
      description: "Présentation des dernières fonctionnalités",
      type: "Vidéo",
      icon: <Video className="w-5 h-5" />
    }
  ];

  const categories = [
    "Tous les articles",
    "Guide", 
    "Migration",
    "Productivité", 
    "Sécurité",
    "Paramétrage",
    "Formation"
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
            Blog & Ressources
          </h1>
          <p className="text-xl text-muted-foreground leading-relaxed">
            Conseils d'expert, guides pratiques et ressources gratuites 
            pour optimiser votre utilisation de Sage 100.
          </p>
        </div>
      </section>

      {/* Featured Article */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-gradient-to-r from-primary to-accent rounded-2xl p-8 md:p-12 text-white">
            <div className="max-w-3xl">
              <div className="inline-flex items-center space-x-2 bg-white/20 rounded-full px-3 py-1 text-sm mb-6">
                <span className="w-2 h-2 bg-white rounded-full"></span>
                <span>Article en vedette</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-4">
                {articles[0].title}
              </h2>
              <p className="text-white/80 text-lg mb-6 leading-relaxed">
                {articles[0].excerpt}
              </p>
              <div className="flex items-center space-x-6 text-white/70 text-sm mb-8">
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>{articles[0].date}</span>
                </div>
                <div className="flex items-center space-x-1">
                  <Clock className="w-4 h-4" />
                  <span>{articles[0].readTime} de lecture</span>
                </div>
              </div>
              <Button className="bg-white text-primary hover:bg-white/90">
                Lire l'article
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-4">
                Derniers articles
              </h2>
              <p className="text-muted-foreground">
                Conseils pratiques et expertise Sage 100
              </p>
            </div>
            
            {/* Category Filter */}
            <div className="flex flex-wrap gap-2 mt-6 md:mt-0">
              {categories.slice(0, 4).map((category) => (
                <Button 
                  key={category} 
                  variant="outline" 
                  size="sm"
                  className={category === "Tous les articles" ? "bg-primary text-primary-foreground" : ""}
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {articles.slice(1).map((article, index) => (
              <article key={index} className="bg-card border border-border rounded-xl p-6 hover:shadow-elegant transition-smooth hover-lift">
                <div className="mb-4">
                  <span className="inline-block bg-primary-muted text-primary text-xs font-medium px-2 py-1 rounded-full">
                    {article.category}
                  </span>
                </div>
                
                <h3 className="text-xl font-semibold text-foreground mb-3 leading-tight">
                  {article.title}
                </h3>
                
                <p className="text-muted-foreground mb-4 leading-relaxed">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between text-sm text-muted-foreground mb-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4" />
                    <span>{article.date}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="w-4 h-4" />
                    <span>{article.readTime}</span>
                  </div>
                </div>
                
                <Button variant="ghost" className="p-0 h-auto text-primary hover:text-primary-glow">
                  Lire la suite
                  <ArrowRight className="w-4 h-4 ml-1" />
                </Button>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Resources Section */}
      <section className="py-20 bg-background-secondary">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Ressources gratuites
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Téléchargez nos guides, checklists et outils pour optimiser 
              votre installation et utilisation de Sage 100.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {resources.map((resource, index) => (
              <div key={index} className="bg-card border border-border rounded-xl p-6 text-center hover:shadow-elegant transition-smooth">
                <div className="w-16 h-16 bg-primary-muted rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <div className="text-primary">
                    {resource.icon}
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold text-foreground mb-3">
                  {resource.title}
                </h3>
                
                <p className="text-muted-foreground text-sm mb-4">
                  {resource.description}
                </p>
                
                <div className="inline-flex items-center text-xs text-muted-foreground bg-background-muted px-2 py-1 rounded-full mb-6">
                  {resource.type}
                </div>
                
                <Button className="w-full btn-secondary">
                  <Download className="w-4 h-4 mr-2" />
                  Télécharger
                </Button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <div className="bg-card border border-border rounded-2xl p-8 md:p-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Restez informé des dernières actualités
            </h2>
            <p className="text-muted-foreground mb-8">
              Recevez chaque mois nos conseils d'expert, nouveautés Sage 100 
              et offres exclusives directement dans votre boîte mail.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 max-w-md mx-auto mb-6">
              <input 
                type="email" 
                placeholder="Votre adresse email"
                className="flex-1 px-4 py-3 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <Button className="btn-primary px-6">
                S'abonner
              </Button>
            </div>
            
            <p className="text-muted-foreground text-xs">
              Pas de spam, désinscription en un clic. Vos données restent privées.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary text-primary-foreground">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold mb-6">
            Une question spécifique ?
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8">
            N'hésitez pas à me contacter pour tout conseil personnalisé 
            sur votre projet Sage 100.
          </p>
          <CTAButton variant="accent" size="lg" icon="calendar">
            Prendre rendez-vous gratuit
          </CTAButton>
        </div>
      </section>
    </div>
  );
};

export default BlogPage;