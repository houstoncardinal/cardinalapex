import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { BarChart3, Mail, Lock, User, ArrowRight, Loader2, UserCircle, Sparkles } from "lucide-react";
import { z } from "zod";

const authSchema = z.object({
  email: z.string().email("Please enter a valid email"),
  password: z.string().min(6, "Password must be at least 6 characters"),
});

const Auth = () => {
  const [searchParams] = useSearchParams();
  const [isSignUp, setIsSignUp] = useState(searchParams.get("mode") === "signup");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading] = useState(false);
  const [guestLoading, setGuestLoading] = useState(false);
  
  const { signIn, signUp, signInAsGuest, user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    if (user) {
      navigate("/dashboard");
    }
  }, [user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const validation = authSchema.safeParse({ email, password });
      if (!validation.success) {
        toast({
          title: "Validation Error",
          description: validation.error.errors[0].message,
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      if (isSignUp) {
        const { error } = await signUp(email, password, fullName);
        if (error) {
          if (error.message.includes("already registered")) {
            toast({
              title: "Account exists",
              description: "This email is already registered. Try signing in instead.",
              variant: "destructive",
            });
          } else {
            toast({
              title: "Sign up failed",
              description: error.message,
              variant: "destructive",
            });
          }
        } else {
          toast({
            title: "Welcome to TradeFlow!",
            description: "Your AI trading bots are ready. Let's make some money!",
          });
        }
      } else {
        const { error } = await signIn(email, password);
        if (error) {
          toast({
            title: "Sign in failed",
            description: "Invalid email or password. Please try again.",
            variant: "destructive",
          });
        }
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Something went wrong. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGuestSignIn = async () => {
    setGuestLoading(true);
    try {
      const { error } = await signInAsGuest();
      if (error) {
        toast({
          title: "Guest sign-in failed",
          description: error.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "Welcome, Guest Trader!",
          description: "Explore the platform with $10,000 demo balance. Sign up anytime to save your progress.",
        });
      }
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to sign in as guest. Please try again.",
        variant: "destructive",
      });
    } finally {
      setGuestLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-secondary/30 items-center justify-center p-12 relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-accent/20 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
        </div>
        
        <div className="relative z-10 max-w-md">
          <div className="flex items-center gap-3 mb-8">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/20">
              <BarChart3 className="h-7 w-7 text-primary" />
            </div>
            <span className="text-2xl font-bold text-foreground">TradeFlow</span>
          </div>
          
          <h1 className="text-4xl font-bold text-foreground mb-4">
            {isSignUp ? "Start Your AI Trading Journey" : "Welcome Back, Trader"}
          </h1>
          
          <p className="text-lg text-muted-foreground mb-8">
            {isSignUp 
              ? "Create your account in seconds and deploy AI trading bots that work 24/7 to grow your portfolio."
              : "Your AI agents have been busy. Let's see how much they've made you."}
          </p>

          <div className="space-y-4">
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/20">
                <span className="text-success text-sm">✓</span>
              </div>
              <span>$10,000 demo balance included</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/20">
                <span className="text-success text-sm">✓</span>
              </div>
              <span>Aggressive AI bot pre-configured</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-success/20">
                <span className="text-success text-sm">✓</span>
              </div>
              <span>Trade crypto & stocks instantly</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="lg:hidden flex items-center gap-2 justify-center mb-8">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/20">
              <BarChart3 className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold text-foreground">TradeFlow</span>
          </div>

          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold text-foreground">
              {isSignUp ? "Create your account" : "Sign in to your account"}
            </h2>
            <p className="text-muted-foreground mt-2">
              {isSignUp 
                ? "Get started with AI-powered trading in 30 seconds"
                : "Enter your credentials to access your dashboard"}
            </p>
          </div>

          {/* Guest Sign-In Button */}
          <Button
            type="button"
            variant="outline"
            size="lg"
            className="w-full h-14 border-2 border-dashed border-primary/40 hover:border-primary hover:bg-primary/5 transition-all group"
            onClick={handleGuestSignIn}
            disabled={guestLoading}
          >
            {guestLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                <UserCircle className="h-5 w-5 mr-2 text-primary group-hover:scale-110 transition-transform" />
                <span className="text-foreground">Continue as Guest</span>
                <Sparkles className="h-4 w-4 ml-2 text-primary" />
              </>
            )}
          </Button>

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-4 text-muted-foreground">Or continue with email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {isSignUp && (
              <div className="space-y-2">
                <Label htmlFor="fullName" className="text-foreground">Full Name</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                  <Input
                    id="fullName"
                    type="text"
                    placeholder="John Doe"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="pl-10 h-12 bg-secondary/50 border-border"
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email" className="text-foreground">Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="pl-10 h-12 bg-secondary/50 border-border"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="text-foreground">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="pl-10 h-12 bg-secondary/50 border-border"
                />
              </div>
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full h-12 glow-primary"
              disabled={loading}
            >
              {loading ? (
                <Loader2 className="h-5 w-5 animate-spin" />
              ) : (
                <>
                  {isSignUp ? "Create Account & Start Trading" : "Sign In"}
                  <ArrowRight className="h-5 w-5 ml-2" />
                </>
              )}
            </Button>
          </form>

          <div className="text-center">
            <button
              type="button"
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-primary hover:underline text-sm"
            >
              {isSignUp 
                ? "Already have an account? Sign in"
                : "Don't have an account? Create one"}
            </button>
          </div>

          <p className="text-xs text-center text-muted-foreground">
            By continuing, you agree to TradeFlow's Terms of Service and Privacy Policy.
            Trading involves risk. Past performance doesn't guarantee future results.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
