import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ChevronLeft, 
  ChevronRight, 
  Award, 
  Calendar,
  CheckCircle,
  Star
} from 'lucide-react';

interface Certification {
  id: string;
  title: string;
  provider: string;
  year: string;
  description: string;
  status: 'active' | 'expired' | 'renewed';
  category: string;
  icon?: React.ReactNode;
  image?: string;
}

const certifications: Certification[] = [
  {
    id: 'sage-100-comptabilite',
    title: 'Consultant Certifié',
    provider: 'Sage 100 Comptabilité',
    year: '2024 - 2025',
    description: 'Certification officielle Sage 100 Comptabilité pour la gestion comptable et financière.',
    status: 'active',
    category: 'Comptabilité',
    image: '/lovable-uploads/Certification-comptabilite-sage-100.png'
  },
  {
    id: 'sage-100-finance',
    title: 'Consultant Certifié',
    provider: 'Sage 100 Finance',
    year: '2024 - 2025',
    description: 'Certification officielle Sage 100 Finance pour l\'accompagnement et la formation des entreprises.',
    status: 'active',
    category: 'Finance',
    image: '/lovable-uploads/Cartification-finance-sage-100.png'
  },
  {
    id: 'sage-100-paie',
    title: 'Consultant Certifié',
    provider: 'Sage 100 Paie',
    year: '2024 - 2025',
    description: 'Certification officielle Sage 100 Paie pour la gestion de la paie et des ressources humaines.',
    status: 'active',
    category: 'Paie',
    image: '/lovable-uploads/certification-paie-sage-100.png'
  },
  {
    id: 'sage-100-gestion-commerciale',
    title: 'Consultant Certifié',
    provider: 'Sage 100 Gestion Commerciale',
    year: '2024 - 2025',
    description: 'Certification officielle Sage 100 Gestion Commerciale pour l\'optimisation des processus commerciaux.',
    status: 'active',
    category: 'Gestion Commerciale',
    image: '/lovable-uploads/certification-gestion-commerciale-sage-100.png'
  }
];

const statusColors = {
  active: 'bg-green-100 text-green-800 border-green-200',
  expired: 'bg-red-100 text-red-800 border-red-200',
  renewed: 'bg-blue-100 text-blue-800 border-blue-200'
};

const statusLabels = {
  active: 'Actif',
  expired: 'Expiré',
  renewed: 'Renouvelé'
};

export default function CertificationCarousel() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [isHovered, setIsHovered] = useState(false);

  // Auto-play functionality
  useEffect(() => {
    if (isAutoPlaying && !isHovered) {
      const interval = setInterval(() => {
        setCurrentIndex((prevIndex) => 
          prevIndex === certifications.length - 1 ? 0 : prevIndex + 1
        );
      }, 4000); // Change every 4 seconds

      return () => clearInterval(interval);
    }
  }, [isAutoPlaying, isHovered]);

  const nextSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === certifications.length - 1 ? 0 : prevIndex + 1
    );
  };

  const prevSlide = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? certifications.length - 1 : prevIndex - 1
    );
  };

  const goToSlide = (index: number) => {
    setCurrentIndex(index);
  };

  const toggleAutoPlay = () => {
    setIsAutoPlaying(!isAutoPlaying);
  };

  return (
    <div className="w-full">
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-foreground mb-4">
          Certifications Officielles
        </h2>
        <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
          Consultant certifié Sage avec des qualifications reconnues pour vous accompagner 
          dans votre transformation digitale.
        </p>
      </div>

      {/* Carousel Container */}
      <div 
        className="relative overflow-hidden rounded-xl"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        {/* Navigation Buttons */}
        <Button
          variant="outline"
          size="sm"
          className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg"
          onClick={prevSlide}
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>
        
        <Button
          variant="outline"
          size="sm"
          className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white/90 hover:bg-white shadow-lg"
          onClick={nextSlide}
        >
          <ChevronRight className="w-4 h-4" />
        </Button>

        {/* Carousel Track */}
        <div 
          className="flex transition-transform duration-500 ease-in-out"
          style={{ transform: `translateX(-${currentIndex * 100}%)` }}
        >
          {certifications.map((cert, index) => (
            <div key={cert.id} className="w-full flex-shrink-0 px-2">
              <Card className={`h-full border-2 hover:shadow-elegant transition-smooth ${
                cert.image ? 'border-sage-primary/30 bg-gradient-to-br from-sage-primary/5 to-sage-secondary/5' : 'border-border'
              }`}>
                <CardContent className={`p-8 text-center ${cert.image ? 'pb-6' : ''}`}>
                  {/* Certification Image/Icon */}
                  <div className="w-full flex items-center justify-center mx-auto mb-6">
                    {cert.image ? (
                      <div className="w-full max-w-sm h-32 flex items-center justify-center bg-gradient-to-br from-sage-primary/5 to-sage-secondary/5 rounded-xl p-4 border border-sage-primary/20">
                        <img 
                          src={cert.image} 
                          alt={`${cert.provider} Certification`}
                          className="w-full h-full object-contain rounded-lg shadow-lg hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 bg-sage-primary/10 rounded-full flex items-center justify-center">
                        <div className="text-sage-primary">
                          {cert.icon}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Certification Info */}
                  <div className="space-y-4">
                    <div>
                      {cert.image && (
                        <div className="flex items-center justify-center mb-3">
                          <Badge className="bg-sage-primary text-sage-white text-xs font-medium">
                            Certification Officielle
                          </Badge>
                        </div>
                      )}
                      <h3 className="text-xl font-bold text-foreground mb-2">
                        {cert.title}
                      </h3>
                      <p className="text-lg font-semibold text-sage-primary mb-2">
                        {cert.provider}
                      </p>
                      <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                        <Calendar className="w-4 h-4" />
                        <span>{cert.year}</span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <Badge 
                      variant="outline" 
                      className={`${statusColors[cert.status]} border`}
                    >
                      {statusLabels[cert.status]}
                    </Badge>

                    {/* Category */}
                    <div className="inline-block">
                      <Badge variant="secondary" className="bg-sage-primary/10 text-sage-primary">
                        {cert.category}
                      </Badge>
                    </div>

                    {/* Description */}
                    <p className={`text-muted-foreground text-sm leading-relaxed ${
                      cert.image ? 'font-medium' : ''
                    }`}>
                      {cert.description}
                    </p>
                    
                    {/* Special highlight for image certifications */}
                    {cert.image && (
                      <div className="mt-4 p-3 bg-sage-primary/10 rounded-lg border border-sage-primary/20">
                        <p className="text-sage-primary text-xs font-semibold text-center">
                          ✓ Badge officiel Sage • Vérifiable en ligne
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>

        {/* Dots Indicator */}
        <div className="flex justify-center space-x-2 mt-6">
          {certifications.map((_, index) => (
            <button
              key={index}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                index === currentIndex 
                  ? 'bg-sage-primary' 
                  : 'bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              onClick={() => goToSlide(index)}
            />
          ))}
        </div>

        {/* Controls */}
        <div className="flex justify-center space-x-4 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={toggleAutoPlay}
            className={isAutoPlaying ? 'bg-sage-primary text-sage-white' : ''}
          >
            {isAutoPlaying ? 'Pause' : 'Lecture'}
          </Button>
          
          <div className="text-sm text-muted-foreground flex items-center space-x-2">
            <span>{currentIndex + 1} / {certifications.length}</span>
          </div>
        </div>
      </div>

      {/* Additional Info */}
      <div className="mt-8 text-center">
        <p className="text-sm text-muted-foreground">
          Toutes nos certifications sont vérifiables et régulièrement mises à jour 
          pour garantir la qualité de nos services.
        </p>
      </div>
    </div>
  );
}
