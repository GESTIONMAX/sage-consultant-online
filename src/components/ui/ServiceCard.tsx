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
    <div className={`service-card ${featured ? 'ring-2 ring-primary/20 bg-primary-muted/50' : ''}`}>
      <div className="flex items-center space-x-3 mb-4">
        <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
          featured ? 'bg-primary text-primary-foreground' : 'bg-primary-muted text-primary'
        }`}>
          {icon}
        </div>
        <div>
          <h3 className="font-semibold text-lg text-foreground">{title}</h3>
          {price && <p className="text-primary font-medium">{price}</p>}
        </div>
      </div>
      
      <p className="text-muted-foreground mb-4">{description}</p>
      
      <ul className="space-y-2 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start space-x-2 text-sm">
            <div className="w-1.5 h-1.5 bg-accent rounded-full mt-2 flex-shrink-0" />
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