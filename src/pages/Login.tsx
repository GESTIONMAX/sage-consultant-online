import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Label } from '@/components/ui/label';

export function Login() {
  const { signInWithEmail, signUpWithEmail, signOut, user, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  
  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    
    try {
      const { error } = await signInWithEmail(email, password);
      if (error) {
        setAuthError(error.message);
      }
    } catch (err) {
      setAuthError('An unexpected error occurred');
      console.error(err);
    }
  };
  
  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    
    try {
      const { error } = await signUpWithEmail(email, password);
      if (error) {
        setAuthError(error.message);
      }
    } catch (err) {
      setAuthError('An unexpected error occurred');
      console.error(err);
    }
  };
  
  const handleSignOut = async () => {
    await signOut();
  };

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  if (user) {
    return (
      <Card className="w-[350px] mx-auto mt-20">
        <CardHeader>
          <CardTitle>Welcome</CardTitle>
          <CardDescription>You are signed in as {user.email}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Button onClick={handleSignOut} className="w-full">Sign Out</Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <div className="flex justify-center items-center min-h-screen">
      <Tabs defaultValue="signin" className="w-[350px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        
        <TabsContent value="signin">
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>Enter your credentials to access your account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignIn} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input 
                    id="password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {authError && <p className="text-sm text-red-500">{authError}</p>}
                <Button type="submit" className="w-full">Sign In</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Create an Account</CardTitle>
              <CardDescription>Enter your details to create a new account</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSignUp} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="signup-email">Email</Label>
                  <Input 
                    id="signup-email" 
                    type="email" 
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="signup-password">Password</Label>
                  <Input 
                    id="signup-password" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                {authError && <p className="text-sm text-red-500">{authError}</p>}
                <Button type="submit" className="w-full">Sign Up</Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
