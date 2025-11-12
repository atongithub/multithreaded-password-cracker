import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Upload, BarChart3, Settings, Moon, Sun, LogOut } from "lucide-react";
import { useTheme } from "next-themes";

const Dashboard = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Password Cracker</h1>
              <p className="text-xs text-muted-foreground">Security Analysis</p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
            >
              {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate("/")}
            >
              <LogOut className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8 animate-fade-in">
        {/* Hero section */}
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-4 bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent animate-cyber-scan bg-[length:200%_auto]">
            Advanced Password Analysis System
          </h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Leverage cutting-edge algorithms to analyze password security, crack encrypted files, 
            and optimize runtime efficiency with our Java-powered backend engine.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)] cursor-pointer animate-fade-in" style={{ animationDelay: "0.1s" }}>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Military-Grade Security</CardTitle>
              <CardDescription>
                Advanced encryption analysis with AES-256, RSA, and custom algorithms
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-secondary/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--secondary)/0.2)] cursor-pointer animate-fade-in" style={{ animationDelay: "0.2s" }}>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center mb-4">
                <Settings className="w-6 h-6 text-secondary" />
              </div>
              <CardTitle>Optimized Performance</CardTitle>
              <CardDescription>
                Java-powered backend with multi-threading for maximum efficiency
              </CardDescription>
            </CardHeader>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)] cursor-pointer animate-fade-in" style={{ animationDelay: "0.3s" }}>
            <CardHeader>
              <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <BarChart3 className="w-6 h-6 text-primary" />
              </div>
              <CardTitle>Real-Time Analytics</CardTitle>
              <CardDescription>
                Live metrics, runtime statistics, and comprehensive cracking reports
              </CardDescription>
            </CardHeader>
          </Card>
        </div>

        {/* Action cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          <Card className="bg-gradient-to-br from-primary/10 to-primary/5 border-primary/50 cursor-pointer hover:shadow-[0_0_40px_hsl(var(--primary)/0.3)] transition-all duration-300 animate-fade-in-up" onClick={() => navigate("/upload")}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                  <Upload className="w-7 h-7 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Upload Files</CardTitle>
                  <CardDescription>Start a new cracking session</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Drop your encrypted files and let our algorithms analyze them in real-time
              </p>
              <Button className="w-full mt-4 bg-primary hover:bg-primary/90" onClick={() => navigate("/upload")}>
                Start Analysis
              </Button>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-secondary/10 to-secondary/5 border-secondary/50 cursor-pointer hover:shadow-[0_0_40px_hsl(var(--secondary)/0.3)] transition-all duration-300 animate-fade-in-up" style={{ animationDelay: "0.1s" }} onClick={() => navigate("/results")}>
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-full bg-secondary/20 flex items-center justify-center">
                  <BarChart3 className="w-7 h-7 text-secondary" />
                </div>
                <div>
                  <CardTitle className="text-2xl">View Results</CardTitle>
                  <CardDescription>Check analysis statistics</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                View detailed metrics, runtime efficiency, and cracking success rates
              </p>
              <Button className="w-full mt-4 bg-secondary hover:bg-secondary/90" onClick={() => navigate("/results")}>
                View Dashboard
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Technical specs */}
        <Card className="mt-12 bg-card/30 backdrop-blur-sm border-border animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
          <CardHeader>
            <CardTitle>Technical Specifications</CardTitle>
            <CardDescription>Built with modern technologies for optimal performance</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center p-4 rounded-lg bg-background/50">
                <p className="text-2xl font-bold text-primary">React 18</p>
                <p className="text-xs text-muted-foreground mt-1">Frontend</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-background/50">
                <p className="text-2xl font-bold text-secondary">Java JDK</p>
                <p className="text-xs text-muted-foreground mt-1">Backend</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-background/50">
                <p className="text-2xl font-bold text-primary">AES-256</p>
                <p className="text-xs text-muted-foreground mt-1">Encryption</p>
              </div>
              <div className="text-center p-4 rounded-lg bg-background/50">
                <p className="text-2xl font-bold text-secondary">Multi-Core</p>
                <p className="text-xs text-muted-foreground mt-1">Processing</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Dashboard;
