import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import CTAButton from "@/components/ui/CTAButton";
import {
  Download,
  Calendar,
  Clock,
  FileText,
  MessageSquare,
  Settings,
  User,
  Phone,
  Mail
} from "lucide-react";

const ClientDashboard = () => {
  const [user] = useState({
    name: "Marie Dubois",
    company: "Entreprise Martin & Fils",
    email: "marie.dubois@martin-fils.fr",
    phone: "01 23 45 67 89",
    clientSince: "Janvier 2023"
  });

  const services = [
    {
      id: 1,
      title: "Installation Sage 100 Comptabilité",
      status: "Terminé",
      date: "15 janvier 2023",
      description: "Installation complète avec formation équipe comptable",
      documents: [
        { name: "Guide utilisateur personnalisé", type: "PDF" },
        { name: "Attestation d'installation", type: "PDF" }
      ]
    },
    {
      id: 2,
      title: "Formation avancée Gestion Commerciale",
      status: "En cours",
      date: "5 mars 2024",
      description: "Sessions de formation personnalisées (3/4 sessions réalisées)",
      documents: [
        { name: "Support de formation", type: "PDF" },
        { name: "Exercices pratiques", type: "PDF" }
      ]
    },
    {
      id: 3,
      title: "Migration vers Sage 100 v16",
      status: "Planifié",
      date: "15 avril 2024",
      description: "Mise à jour prévue avec sauvegarde complète",
      documents: []
    }
  ];

  const meetings = [
    {
      date: "25 mars 2024",
      time: "14:00",
      title: "Formation Sage 100 - Session 4",
      type: "Visioconférence",
      status: "À venir"
    },
    {
      date: "15 avril 2024", 
      time: "09:00",
      title: "Migration vers v16 - Intervention",
      type: "Sur site",
      status: "Planifié"
    }
  ];

  const messages = [
    {
      date: "20 mars 2024",
      title: "Question sur paramétrage TVA",
      status: "Répondu",
      preview: "Bonjour, j'ai une question concernant le paramétrage..."
    },
    {
      date: "10 mars 2024",
      title: "Demande de support - Édition état",
      status: "Résolu", 
      preview: "Problème résolu lors de notre session de formation..."
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Terminé": return "bg-accent text-accent-foreground";
      case "En cours": return "bg-warning text-warning-foreground";
      case "Planifié": return "bg-primary text-primary-foreground";
      case "Répondu": return "bg-accent text-accent-foreground";
      case "Résolu": return "bg-accent text-accent-foreground";
      default: return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="min-h-screen pt-16 bg-background-secondary">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">
            Espace Client
          </h1>
          <p className="text-muted-foreground">
            Bienvenue {user.name}, retrouvez ici tous vos services et documents.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            
            {/* Services */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Mes services</span>
                </CardTitle>
                <CardDescription>
                  Suivi de vos projets et interventions Sage 100
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  {services.map((service) => (
                    <div key={service.id} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="font-semibold text-foreground mb-1">
                            {service.title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {service.description}
                          </p>
                        </div>
                        <Badge className={getStatusColor(service.status)}>
                          {service.status}
                        </Badge>
                      </div>
                      
                      <div className="flex items-center text-sm text-muted-foreground mb-4">
                        <Calendar className="w-4 h-4 mr-1" />
                        <span>{service.date}</span>
                      </div>
                      
                      {service.documents.length > 0 && (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-foreground">Documents :</p>
                          {service.documents.map((doc, index) => (
                            <Button key={index} variant="outline" size="sm" className="mr-2">
                              <Download className="w-4 h-4 mr-2" />
                              {doc.name}
                            </Button>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Messages */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <MessageSquare className="w-5 h-5" />
                  <span>Messages récents</span>
                </CardTitle>
                <CardDescription>
                  Historique de nos échanges
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {messages.map((message, index) => (
                    <div key={index} className="border border-border rounded-lg p-4">
                      <div className="flex items-start justify-between mb-2">
                        <h3 className="font-medium text-foreground">
                          {message.title}
                        </h3>
                        <Badge className={getStatusColor(message.status)}>
                          {message.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-2">
                        {message.preview}
                      </p>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Clock className="w-3 h-3 mr-1" />
                        <span>{message.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <CTAButton variant="primary" size="sm">
                    Nouveau message
                  </CTAButton>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            
            {/* Profile */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <User className="w-5 h-5" />
                  <span>Mon profil</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3 text-sm">
                  <div>
                    <p className="font-medium text-foreground">{user.name}</p>
                    <p className="text-muted-foreground">{user.company}</p>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Mail className="w-4 h-4" />
                    <span>{user.email}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-muted-foreground">
                    <Phone className="w-4 h-4" />
                    <span>{user.phone}</span>
                  </div>
                  <div className="pt-2 border-t border-border">
                    <p className="text-muted-foreground">
                      Client depuis {user.clientSince}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Upcoming Meetings */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5" />
                  <span>Prochains RDV</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {meetings.map((meeting, index) => (
                    <div key={index} className="border border-border rounded-lg p-3">
                      <h3 className="font-medium text-foreground text-sm mb-1">
                        {meeting.title}
                      </h3>
                      <div className="flex items-center text-xs text-muted-foreground mb-1">
                        <Calendar className="w-3 h-3 mr-1" />
                        <span>{meeting.date} à {meeting.time}</span>
                      </div>
                      <p className="text-xs text-muted-foreground">
                        {meeting.type}
                      </p>
                    </div>
                  ))}
                </div>
                <div className="mt-4">
                  <CTAButton variant="secondary" size="sm" icon="calendar">
                    Nouveau RDV
                  </CTAButton>
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions rapides</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <FileText className="w-4 h-4 mr-2" />
                    Télécharger factures
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <MessageSquare className="w-4 h-4 mr-2" />
                    Poser une question
                  </Button>
                  <Button variant="outline" size="sm" className="w-full justify-start">
                    <Phone className="w-4 h-4 mr-2" />
                    Demander un rappel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientDashboard;