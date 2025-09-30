import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { UserPlus, Mail, Users, Trash2, RefreshCw, Send, Copy } from 'lucide-react';

interface User {
  id: string;
  email: string;
  role: 'admin' | 'client';
  full_name?: string;
  company?: string;
  status: 'active' | 'pending' | 'inactive';
  client_since: string;
  last_login?: string;
}

interface InvitationForm {
  email: string;
  role: 'admin' | 'client';
  full_name: string;
  company: string;
}

export default function AdminInvitations() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const [invitationForm, setInvitationForm] = useState<InvitationForm>({
    email: '',
    role: 'client',
    full_name: '',
    company: '1C Gestion'
  });

  const [showInviteForm, setShowInviteForm] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);

      // Essayer d'abord la fonction admin sécurisée
      const { data: adminData, error: adminError } = await supabase.rpc('get_all_profiles');

      if (!adminError && adminData) {
        setUsers(adminData);
      } else {
        // Fallback vers la requête directe
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) throw error;
        setUsers(data || []);
      }
    } catch (error: any) {
      setMessage({ type: 'error', text: `Erreur de chargement: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const sendInvitation = async () => {
    if (!invitationForm.email || !invitationForm.full_name) {
      setMessage({ type: 'error', text: 'Veuillez remplir tous les champs obligatoires' });
      return;
    }

    try {
      setLoading(true);

      // Créer l'utilisateur via fonction RPC robuste (gère toutes les erreurs)
      const { data: result, error: rpcError } = await supabase.rpc('create_profile_invitation', {
        p_email: invitationForm.email,
        p_role: invitationForm.role,
        p_full_name: invitationForm.full_name,
        p_company: invitationForm.company
      });

      if (rpcError) {
        throw new Error(`Erreur RPC: ${rpcError.message}`);
      }

      if (!result.success) {
        throw new Error(result.error);
      }

      // Utiliser les données retournées par la fonction
      const userData = {
        id: result.user_id,
        email: result.email,
        role: result.role,
        full_name: result.full_name,
        company: result.company,
        status: result.status
      };

      // Générer le lien d'activation
      const activationToken = btoa(`${userData.id}:${invitationForm.email}:${Date.now()}`);
      const activationLink = `${window.location.origin}/client-activation?token=${activationToken}`;

      // Créer les instructions d'invitation
      const invitationInstructions = `
=== INVITATION ${invitationForm.role.toUpperCase()} SAGE 100 ===

Bonjour ${invitationForm.full_name},

Vous êtes invité(e) à rejoindre la plateforme Sage 100 - 1C Gestion.

🔗 LIEN D'ACTIVATION:
${activationLink}

📧 Email: ${invitationForm.email}
👤 Rôle: ${invitationForm.role === 'admin' ? 'Administrateur' : 'Client'}
🏢 Société: ${invitationForm.company}

📋 INSTRUCTIONS:
1. Cliquez sur le lien d'activation
2. Définissez votre mot de passe
3. Accédez à votre espace ${invitationForm.role === 'admin' ? 'administrateur' : 'client'}

🔒 Ce lien expire dans 7 jours.

---
Équipe 1C Gestion
      `.trim();

      // Copier dans le presse-papier
      await navigator.clipboard.writeText(invitationInstructions);

      setMessage({
        type: 'success',
        text: `Invitation créée pour ${invitationForm.email} ! Instructions copiées dans le presse-papier.`
      });

      // Reset form
      setInvitationForm({
        email: '',
        role: 'client',
        full_name: '',
        company: '1C Gestion'
      });
      setShowInviteForm(false);

      // Reload users
      await loadUsers();

    } catch (error: any) {
      setMessage({ type: 'error', text: `Erreur d'invitation: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const deleteUser = async (userId: string, email: string) => {
    if (!confirm(`Supprimer l'utilisateur ${email} ?`)) return;

    try {
      setLoading(true);
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('id', userId);

      if (error) throw error;

      setMessage({ type: 'success', text: 'Utilisateur supprimé' });
      await loadUsers();
    } catch (error: any) {
      setMessage({ type: 'error', text: `Erreur de suppression: ${error.message}` });
    } finally {
      setLoading(false);
    }
  };

  const resendInvitation = async (user: User) => {
    const activationToken = btoa(`${user.id}:${user.email}:${Date.now()}`);
    const activationLink = `${window.location.origin}/client-activation?token=${activationToken}`;

    const invitationInstructions = `
=== RAPPEL INVITATION ${user.role.toUpperCase()} SAGE 100 ===

Bonjour ${user.full_name},

Rappel: Vous êtes invité(e) à rejoindre la plateforme Sage 100.

🔗 NOUVEAU LIEN D'ACTIVATION:
${activationLink}

📧 Email: ${user.email}
👤 Rôle: ${user.role === 'admin' ? 'Administrateur' : 'Client'}
🏢 Société: ${user.company}

Ce nouveau lien remplace le précédent.

---
Équipe 1C Gestion
    `.trim();

    await navigator.clipboard.writeText(invitationInstructions);
    setMessage({ type: 'success', text: `Nouvelle invitation copiée pour ${user.email}` });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: 'bg-green-100 text-green-800',
      pending: 'bg-yellow-100 text-yellow-800',
      inactive: 'bg-gray-100 text-gray-800'
    };

    const labels: Record<string, string> = {
      active: 'Actif',
      pending: 'En attente',
      inactive: 'Inactif'
    };

    return (
      <Badge className={variants[status] || variants.inactive}>
        {labels[status] || status}
      </Badge>
    );
  };

  const getRoleBadge = (role: string) => {
    return (
      <Badge variant={role === 'admin' ? 'destructive' : 'secondary'}>
        {role === 'admin' ? 'Admin' : 'Client'}
      </Badge>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-sage-light to-background p-6">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white rounded-2xl p-6 shadow-sage-elegant">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="bg-sage-primary/10 rounded-2xl p-3">
                <Users className="h-8 w-8 text-sage-primary" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-sage-dark">Gestion des Invitations</h1>
                <p className="text-muted-foreground">Inviter et gérer les utilisateurs</p>
              </div>
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={() => setShowInviteForm(!showInviteForm)}
                className="bg-sage-primary hover:bg-sage-dark"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Nouvel utilisateur
              </Button>
              <Button variant="outline" onClick={loadUsers} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Actualiser
              </Button>
            </div>
          </div>
        </div>

        {/* Messages */}
        {message && (
          <Alert className={message.type === 'error' ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}>
            <AlertDescription className={message.type === 'error' ? 'text-red-800' : 'text-green-800'}>
              {message.text}
            </AlertDescription>
          </Alert>
        )}

        {/* Formulaire d'invitation */}
        {showInviteForm && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Mail className="mr-2 h-5 w-5" />
                Inviter un nouvel utilisateur
              </CardTitle>
              <CardDescription>
                L'utilisateur recevra un lien d'activation pour créer son compte
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="utilisateur@entreprise.com"
                    value={invitationForm.email}
                    onChange={(e) => setInvitationForm({ ...invitationForm, email: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="role">Rôle *</Label>
                  <Select
                    value={invitationForm.role}
                    onValueChange={(value: 'admin' | 'client') =>
                      setInvitationForm({ ...invitationForm, role: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="client">Client</SelectItem>
                      <SelectItem value="admin">Administrateur</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="full_name">Nom complet *</Label>
                  <Input
                    id="full_name"
                    placeholder="Prénom Nom"
                    value={invitationForm.full_name}
                    onChange={(e) => setInvitationForm({ ...invitationForm, full_name: e.target.value })}
                  />
                </div>

                <div>
                  <Label htmlFor="company">Société</Label>
                  <Input
                    id="company"
                    placeholder="Nom de la société"
                    value={invitationForm.company}
                    onChange={(e) => setInvitationForm({ ...invitationForm, company: e.target.value })}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button variant="outline" onClick={() => setShowInviteForm(false)}>
                  Annuler
                </Button>
                <Button onClick={sendInvitation} disabled={loading}>
                  <Send className="mr-2 h-4 w-4" />
                  {loading ? 'Envoi...' : 'Envoyer l\'invitation'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Liste des utilisateurs */}
        <Card>
          <CardHeader>
            <CardTitle>Utilisateurs ({users.length})</CardTitle>
            <CardDescription>Liste de tous les utilisateurs et invitations</CardDescription>
          </CardHeader>
          <CardContent>
            {loading && users.length === 0 ? (
              <div className="text-center py-8">Chargement...</div>
            ) : users.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                Aucun utilisateur trouvé
              </div>
            ) : (
              <div className="space-y-3">
                {users.map((user) => (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium">{user.full_name || user.email}</span>
                          {getRoleBadge(user.role)}
                          {getStatusBadge(user.status)}
                        </div>
                        <div className="text-sm text-muted-foreground space-y-1">
                          <p>📧 {user.email}</p>
                          {user.company && <p>🏢 {user.company}</p>}
                          <p>📅 Inscrit le {new Date(user.client_since).toLocaleDateString()}</p>
                          {user.last_login && (
                            <p>🕒 Dernière connexion: {new Date(user.last_login).toLocaleString()}</p>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center space-x-2">
                      {user.status === 'pending' && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => resendInvitation(user)}
                        >
                          <Copy className="h-4 w-4 mr-1" />
                          Renvoyer
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => deleteUser(user.id, user.email)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}