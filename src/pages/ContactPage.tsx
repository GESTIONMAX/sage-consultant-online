import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import CTAButton from "@/components/ui/CTAButton";
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Calendar,
  MessageSquare,
  Send
} from "lucide-react";

const ContactPage = () => {
  const { toast } = useToast();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    revendeur: "",
    numeroLicenceSage: "",
    serviceType: "",
    message: "",
    urgency: "normal"
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulation d'envoi du formulaire
    toast({
      title: "Message envoyé !",
      description: "Je vous répondrai dans les 24h. Merci de votre confiance.",
    });

    // Reset du formulaire
    setFormData({
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      company: "",
      revendeur: "",
      numeroLicenceSage: "",
      serviceType: "",
      message: "",
      urgency: "normal"
    });
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const contactInfo = [
    {
      icon: <Mail className="w-5 h-5" />,
      title: "Email",
      value: "briane@1cgestion.fr",
      description: "Réponse sous 24h"
    },
    {
      icon: <Phone className="w-5 h-5" />,
      title: "Téléphone", 
      value: "06 61 32 41 46",
      description: "Du lundi au vendredi, 9h-18h"
    },
    {
      icon: <MapPin className="w-5 h-5" />,
      title: "Zone d'intervention",
      value: "Antibes PACA",
      description: "Intervention sur site ou à distance"
    },
    {
      icon: <Clock className="w-5 h-5" />,
      title: "Disponibilité",
      value: "Intervention sous 48h",
      description: "Urgences traitées en priorité"
    }
  ];

  const serviceTypes = [
    "Installation Sage 100",
    "Paramétrage personnalisé", 
    "Migration de version",
    "Formation à distance",
    "Support technique",
    "Audit et optimisation",
    "Autre demande"
  ];

  return (
    <div className="min-h-screen pt-16">
      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-background to-background-secondary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-center lg:text-left">
              <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-6">
                Contactez-moi
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                Discutons de votre projet Sage 100. Je vous réponds personnellement 
                et vous propose une solution adaptée à vos besoins.
              </p>
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

      {/* Contact Info */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {contactInfo.map((info, index) => (
              <div key={index} className="text-center">
                <div className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <div className="text-primary-foreground">
                    {info.icon}
                  </div>
                </div>
                <h3 className="font-semibold text-foreground mb-2">{info.title}</h3>
                <p className="text-primary font-medium mb-1">{info.value}</p>
                <p className="text-muted-foreground text-sm">{info.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="py-20 bg-background-secondary">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Décrivez-moi votre projet
            </h2>
            <p className="text-lg text-muted-foreground">
              Plus votre demande est détaillée, plus je pourrai vous proposer 
              une solution précise et adaptée.
            </p>
          </div>

          <div className="bg-card border border-border rounded-2xl p-8 shadow-elegant">
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Informations personnelles */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Prénom *</Label>
                  <Input
                    id="firstName"
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => handleInputChange("firstName", e.target.value)}
                    required
                    placeholder="Votre prénom"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nom *</Label>
                  <Input
                    id="lastName"
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => handleInputChange("lastName", e.target.value)}
                    required
                    placeholder="Votre nom"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange("email", e.target.value)}
                    required
                    placeholder="votre@email.fr"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange("phone", e.target.value)}
                    placeholder="06 61 32 41 46"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="company">Entreprise</Label>
                <Input
                  id="company"
                  type="text"
                  value={formData.company}
                  onChange={(e) => handleInputChange("company", e.target.value)}
                  placeholder="Nom de votre entreprise"
                />
              </div>

              {/* Informations Sage */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="revendeur">Revendeur</Label>
                  <Input
                    id="revendeur"
                    type="text"
                    value={formData.revendeur}
                    onChange={(e) => handleInputChange("revendeur", e.target.value)}
                    placeholder="Nom de votre revendeur Sage"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="numeroLicenceSage">N° de licence SAGE</Label>
                  <Input
                    id="numeroLicenceSage"
                    type="text"
                    value={formData.numeroLicenceSage}
                    onChange={(e) => handleInputChange("numeroLicenceSage", e.target.value)}
                    placeholder="Numéro de licence Sage 100"
                  />
                </div>
              </div>

              {/* Type de service */}
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="serviceType">Type de service *</Label>
                  <Select value={formData.serviceType} onValueChange={(value) => handleInputChange("serviceType", value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionnez un service" />
                    </SelectTrigger>
                    <SelectContent>
                      {serviceTypes.map((service) => (
                        <SelectItem key={service} value={service}>
                          {service}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="urgency">Urgence</Label>
                  <Select value={formData.urgency} onValueChange={(value) => handleInputChange("urgency", value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="low">Pas d'urgence</SelectItem>
                      <SelectItem value="normal">Normal (48h)</SelectItem>
                      <SelectItem value="high">Urgent (24h)</SelectItem>
                      <SelectItem value="critical">Critique (4h)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Message */}
              <div className="space-y-2">
                <Label htmlFor="message">Décrivez votre besoin *</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => handleInputChange("message", e.target.value)}
                  required
                  placeholder="Décrivez votre projet, vos besoins, votre contexte actuel, vos contraintes..."
                  rows={6}
                />
              </div>

              {/* Submit */}
              <div className="pt-4">
                <Button type="submit" size="lg" className="w-full btn-primary">
                  <Send className="w-4 h-4 mr-2" />
                  Envoyer ma demande
                </Button>
                <p className="text-muted-foreground text-sm mt-3 text-center">
                  Je vous réponds personnellement sous 24h avec une proposition détaillée
                </p>
              </div>
            </form>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
              Besoin d'une réponse rapide ?
            </h2>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center p-6 bg-card border border-border rounded-xl hover:shadow-elegant transition-smooth">
              <Calendar className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-3">Prendre rendez-vous</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Planifiez un appel gratuit de 30 minutes pour discuter de votre projet
              </p>
              <CTAButton variant="primary" size="sm" icon="calendar">
                Réserver un créneau
              </CTAButton>
            </div>
            
            <div className="text-center p-6 bg-card border border-border rounded-xl hover:shadow-elegant transition-smooth">
              <Phone className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="font-semibold mb-3">Appel téléphonique</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Joignez-moi directement pour une première discussion
              </p>
              <Button variant="outline" size="sm" className="w-full">
                06 61 32 41 46
              </Button>
            </div>
            
            <div className="text-center p-6 bg-card border border-border rounded-xl hover:shadow-elegant transition-smooth">
              <MessageSquare className="w-12 h-12 text-secondary-dark mx-auto mb-4" />
              <h3 className="font-semibold mb-3">Question rapide</h3>
              <p className="text-muted-foreground text-sm mb-4">
                Posez-moi votre question par email pour une réponse sous 2h
              </p>
              <Button variant="outline" size="sm" className="w-full">
                <Mail className="w-4 h-4 mr-2" />
                Email express
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;