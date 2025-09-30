import { Link } from "react-router-dom";
import { Mail, Phone, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-background-secondary border-t border-border">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand avec Logo Sage */}
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-3 mb-4">
              <img
                src="/sage-logo-green.svg"
                alt="Sage Logo"
                className="h-10 w-auto"
              />
              <div>
                <span className="font-bold text-xl text-sage-dark block">SAS 1 GESTION</span>
                <span className="text-sm text-sage-primary font-medium">Consultant Sage Certifié</span>
              </div>
            </div>
            <p className="text-muted-foreground max-w-md mb-4">
              Consultant indépendant certifié Sage ligne 100. Spécialisé dans l'installation, 
              le paramétrage, la migration et la formation pour optimiser votre gestion d'entreprise.
            </p>
            <div className="space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center space-x-2">
                <Mail className="w-4 h-4" />
                <span>briane@1cgestion.fr</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="w-4 h-4" />
                <span>06 61 32 41 46</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4" />
                <span>Antibes PACA</span>
              </div>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Services</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/services" className="hover:text-foreground transition-smooth">Installation Sage 100</Link></li>
              <li><Link to="/services" className="hover:text-foreground transition-smooth">Paramétrage</Link></li>
              <li><Link to="/services" className="hover:text-foreground transition-smooth">Migration</Link></li>
              <li><Link to="/services" className="hover:text-foreground transition-smooth">Formation à distance</Link></li>
            </ul>
          </div>

          {/* Liens utiles */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Liens utiles</h3>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link to="/about" className="hover:text-foreground transition-smooth">À propos</Link></li>
              <li><Link to="/assistance" className="hover:text-foreground transition-smooth">Assistance</Link></li>
              <li><Link to="/blog" className="hover:text-foreground transition-smooth">Trucs & Astuces</Link></li>
              <li><Link to="/contact" className="hover:text-foreground transition-smooth">Contact</Link></li>
              <li><Link to="/client" className="hover:text-foreground transition-smooth">Espace Client</Link></li>
            </ul>
          </div>
        </div>

        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm text-muted-foreground">
              © 2024 SAS 1 GESTION. Tous droits réservés.
            </p>
            <div className="mt-4 md:mt-0 flex space-x-6 text-sm text-muted-foreground">
              <Link to="/legal" className="hover:text-foreground transition-smooth">Mentions légales</Link>
              <Link to="/privacy" className="hover:text-foreground transition-smooth">Confidentialité</Link>
              <Link to="/terms" className="hover:text-foreground transition-smooth">CGV</Link>
              <Link to="/admin-login" className="hover:text-foreground transition-smooth opacity-50 hover:opacity-100">Admin</Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;