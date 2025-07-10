import { Button } from "@/components/ui/button";
import { ArrowRight, Calendar, Mail } from "lucide-react";
import { Link } from "react-router-dom";

interface CTAButtonProps {
  variant?: "primary" | "secondary" | "accent";
  size?: "sm" | "default" | "lg";
  children: React.ReactNode;
  href?: string;
  icon?: "arrow" | "calendar" | "mail";
  external?: boolean;
  className?: string;
}

const CTAButton = ({ 
  variant = "primary", 
  size = "default", 
  children, 
  href = "/contact",
  icon = "arrow",
  external = false,
  className = ""
}: CTAButtonProps) => {
  const iconMap = {
    arrow: ArrowRight,
    calendar: Calendar,
    mail: Mail,
  };
  
  const IconComponent = iconMap[icon];
  
  const buttonClasses = {
    primary: "btn-primary hover-glow",
    secondary: "btn-secondary",
    accent: "btn-accent hover-lift",
  };
  
  const button = (
    <Button 
      size={size} 
      className={`${buttonClasses[variant]} ${className} transition-bounce`}
    >
      {children}
      <IconComponent className="w-4 h-4 ml-2" />
    </Button>
  );
  
  if (external) {
    return (
      <a href={href} target="_blank" rel="noopener noreferrer">
        {button}
      </a>
    );
  }
  
  return (
    <Link to={href}>
      {button}
    </Link>
  );
};

export default CTAButton;