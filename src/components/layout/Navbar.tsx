import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Menu, X, Calendar, ShieldCheck } from "lucide-react";
import { useAuthSimple as useAuth } from "../../hooks/useAuth-simple";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { user } = useAuth(); // Récupérer les informations de l'utilisateur connecté

  const navigation = [
    { name: "Accueil", href: "/" },
    { name: "À propos", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Assistance", href: "/assistance" },
    { name: "Contact", href: "/contact" },
  ];

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="fixed top-0 w-full z-50 navbar-blur">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <span className="font-bold text-xl text-sage-dark">SAS 1 GESTION</span>
            <span className="text-sm text-sage-primary font-medium hidden sm:block">Consultant Sage Certifié</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`transition-smooth px-3 py-2 rounded-md text-sm font-medium ${
                  isActive(item.href)
                    ? "text-sage-primary bg-sage-primary/10 border-b-2 border-sage-primary"
                    : "text-muted-foreground hover:text-sage-primary hover:bg-sage-primary/5"
                }`}
              >
                {item.name}
              </Link>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Bouton Admin - visible seulement pour les administrateurs */}
            {user && user.role === 'admin' && (
              <Link to="/admin">
                <Button variant="outline" size="sm" className="bg-sage-light border-sage-primary text-sage-primary hover:bg-sage-primary hover:text-sage-white">
                  <ShieldCheck className="w-4 h-4 mr-2" />
                  Admin
                </Button>
              </Link>
            )}
            <Link to="/client-login">
              <Button variant="outline" size="sm" className="border-sage-primary text-sage-primary hover:bg-sage-primary hover:text-sage-white">
                Espace Client
              </Button>
            </Link>
            <Button size="sm" className="bg-sage-primary text-sage-white hover:bg-sage-secondary">
              <Calendar className="w-4 h-4 mr-2" />
              Prendre RDV
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-sage-primary hover:bg-sage-primary/10 hover:text-sage-primary"
            >
              {isMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-background border-t border-border">
              {navigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-smooth ${
                    isActive(item.href)
                      ? "text-sage-primary bg-sage-primary/10 border-l-4 border-sage-primary"
                      : "text-muted-foreground hover:text-sage-primary hover:bg-sage-primary/5"
                  }`}
                  onClick={() => setIsMenuOpen(false)}
                >
                  {item.name}
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                {/* Bouton Admin mobile - visible seulement pour les administrateurs */}
                {user && user.role === 'admin' && (
                  <Link to="/admin">
                    <Button variant="outline" className="w-full bg-sage-light border-sage-primary text-sage-primary hover:bg-sage-primary hover:text-sage-white mb-2">
                      <ShieldCheck className="w-4 h-4 mr-2" />
                      Espace Admin
                    </Button>
                  </Link>
                )}
                <Link to="/client-login">
                  <Button variant="outline" className="w-full border-sage-primary text-sage-primary hover:bg-sage-primary hover:text-sage-white">
                    Espace Client
                  </Button>
                </Link>
                <Button className="w-full bg-sage-primary text-sage-white hover:bg-sage-secondary">
                  <Calendar className="w-4 h-4 mr-2" />
                  Prendre RDV
                </Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;