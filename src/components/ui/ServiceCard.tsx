import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

interface ServiceCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  features: string[];
  price?: string;
  href?: string;
  featured?: boolean;
}

const ServiceCard = ({ 
  icon, 
  title, 
  description, 
  features, 
  price, 
  href = "/contact", 
  featured = false 
}: ServiceCardProps) => {
  return (
    <div className={`service-card ${featured ? 'ring-2 ring-sage-primary/30 bg-sage-light/50' : ''}`}>
      {/* Logo Sage en header */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center space-x-3">
          <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
            featured ? 'bg-sage-primary text-sage-white' : 'bg-sage-light text-sage-primary'
          }`}>
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-lg text-foreground">{title}</h3>
            {price && <p className="text-sage-primary font-medium">{price}</p>}
          </div>
        </div>
        <img
          src="/sage-logo-green.svg"
          alt="Sage 100"
          className="h-6 w-auto opacity-60"
        />
      </div>
      
      <p className="text-muted-foreground mb-4">{description}</p>
      
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start space-x-2 text-sm">
            <div className="w-1.5 h-1.5 bg-sage-primary rounded-full mt-2 flex-shrink-0" />
            <span className="text-muted-foreground">{feature}</span>
          </li>
        ))}
      </ul>
      
      <div className="mt-auto pt-4 space-y-3">
        <Link to={href}>
          <Button className={`w-full ${featured ? 'btn-primary' : 'btn-secondary'}`}>
            En savoir plus
            <ArrowRight className="w-4 h-4 ml-2" />
          </Button>
        </Link>
        <Link to="/contact">
          <Button variant="outline" className="w-full">
            Prendre rendez-vous
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default ServiceCard;