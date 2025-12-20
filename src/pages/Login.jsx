import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Mail, Lock, LogIn } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  // Redirect if already authenticated
  React.useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'superadmin') {
        navigate('/admin');
      } else if (user.role === 'editor') {
        navigate('/editor');
      } else {
        navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    
    if (!email || !password) {
      toast({
        title: 'Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    setIsLoading(true);
    
    const result = await login(email, password);
    
    if (result.success) {
      toast({
        title: 'Welcome!',
        description: `Logged in as ${result.user.full_name || result.user.email}`,
      });
      // Redirect based on role
      if (result.user.role === 'superadmin') {
        navigate('/admin');
      } else if (result.user.role === 'editor') {
        navigate('/editor');
      } else {
        navigate('/');
      }
    } else {
      toast({
        title: 'Error',
        description: result.error,
        variant: 'destructive',
      });
    }
    
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 mb-4">
            <Building2 className="w-8 h-8 text-primary-foreground" />
          </div>
          <h1 className="text-2xl font-bold font-display text-foreground">
            Listings Manager
          </h1>
          <p className="text-muted-foreground mt-2">
            Sign in to your account
          </p>
        </div>

        {/* Auth Card */}
        <div className="bg-card border border-border rounded-2xl p-8 shadow-xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-11"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-11"
                />
              </div>
            </div>

            <Button
              type="submit"
              className="w-full btn-gradient"
              disabled={isLoading}
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4 mr-2" />
                  Sign In
                </>
              )}
            </Button>
            
            <Button
              type="button"
              variant="link"
              className="w-full text-muted-foreground hover:text-primary"
              onClick={() => navigate('/forgot-password')}
            >
              Forgot Password?
            </Button>
          </form>

          {/* Info */}
          {/* <div className="mt-6 pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground text-center mb-3">
              Contact your administrator to create an account
            </p>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="bg-muted rounded-lg p-2 text-center">
                <p className="font-medium text-foreground">Admin</p>
                <p className="text-muted-foreground">admin@gmail.com</p>
                <p className="text-muted-foreground">123</p>
              </div>
              <div className="bg-muted rounded-lg p-2 text-center">
                <p className="font-medium text-foreground">Editor</p>
                <p className="text-muted-foreground">editor@gmail.com</p>
                <p className="text-muted-foreground">123</p>
              </div>
              <div className="bg-muted rounded-lg p-2 text-center">
                <p className="font-medium text-foreground">Subscriber</p>
                <p className="text-muted-foreground">subscriber@gmail.com</p>
                <p className="text-muted-foreground">123</p>
              </div>
            </div>
          </div> */}
        </div>
      </div>
    </div>
  );
};

export default Login;
