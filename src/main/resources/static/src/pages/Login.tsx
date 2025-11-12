import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import { Shield, Lock } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (email && password) {
      toast({
        title: "Access Granted",
        description: "Welcome to Password Cracker",
      });
      navigate("/dashboard");
    } else {
      toast({
        title: "Access Denied",
        description: "Please enter valid credentials",
        variant: "destructive"
      });
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4 overflow-hidden relative">
      {/* Animated background grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,hsl(var(--border))_1px,transparent_1px),linear-gradient(to_bottom,hsl(var(--border))_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_70%,transparent_110%)] opacity-20" />
      
      {/* Glowing orbs */}
      <div className="absolute top-20 left-20 w-72 h-72 bg-primary/30 rounded-full blur-[128px] animate-float" />
      <div className="absolute bottom-20 right-20 w-96 h-96 bg-secondary/30 rounded-full blur-[128px] animate-float" style={{ animationDelay: "1s" }} />

      <div className="w-full max-w-md relative z-10 animate-fade-in-up">
        {/* Logo and title */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-primary/10 mb-4 animate-glow-pulse">
            <Shield className="w-10 h-10 text-primary" />
          </div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent mb-2">
            Password Cracker
          </h1>
          <p className="text-muted-foreground">Advanced Security Analysis System</p>
        </div>

        {/* Login form */}
        <div className="bg-card/50 backdrop-blur-xl border border-border rounded-lg p-8 shadow-2xl">
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Email
              </Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-background/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password" className="flex items-center gap-2">
                <Lock className="w-4 h-4 text-primary" />
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-background/50"
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.5)]"
            >
              Access System
            </Button>
          </form>

          <div className="mt-6 text-center text-sm text-muted-foreground">
            <p>Demo credentials: any email and password</p>
          </div>
        </div>

        {/* Footer text */}
        <p className="text-center text-xs text-muted-foreground mt-8">
          Encrypted • Secure • Advanced Analysis
        </p>
      </div>
    </div>
  );
};

export default Login;
