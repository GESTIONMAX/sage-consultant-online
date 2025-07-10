import { Star, Quote } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  role: string;
  company: string;
  content: string;
  rating: number;
  avatar?: string;
}

const TestimonialCard = ({ 
  name, 
  role, 
  company, 
  content, 
  rating,
  avatar 
}: TestimonialCardProps) => {
  return (
    <div className="testimonial-card h-full">
      <div className="flex items-start justify-between mb-4">
        <Quote className="w-6 h-6 text-primary/60" />
        <div className="flex space-x-1">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              className={`w-4 h-4 ${
                i < rating ? 'text-yellow-400 fill-current' : 'text-muted-foreground/30'
              }`}
            />
          ))}
        </div>
      </div>
      
      <blockquote className="text-muted-foreground mb-6 italic leading-relaxed">
        "{content}"
      </blockquote>
      
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-primary-muted flex items-center justify-center">
          {avatar ? (
            <img src={avatar} alt={name} className="w-10 h-10 rounded-full object-cover" />
          ) : (
            <span className="font-semibold text-primary text-sm">
              {name.split(' ').map(n => n[0]).join('')}
            </span>
          )}
        </div>
        <div>
          <p className="font-semibold text-foreground text-sm">{name}</p>
          <p className="text-muted-foreground text-xs">{role} • {company}</p>
        </div>
      </div>
    </div>
  );
};

export default TestimonialCard;