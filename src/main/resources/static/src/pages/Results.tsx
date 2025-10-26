import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Clock, TrendingUp, CheckCircle2, Moon, Sun, ArrowLeft, BarChart3 } from "lucide-react";
import { useTheme } from "next-themes";
import { Progress } from "@/components/ui/progress";

const Results = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  // Mock data
  const stats = {
    totalAttempts: 1847293,
    successRate: 87.4,
    runtime: "2m 34s",
    efficiency: 94.2,
    cracked: 234,
    failed: 34,
    algorithmsUsed: ["Brute Force", "Dictionary", "Hybrid", "Rainbow Table"]
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-card/50 backdrop-blur-xl sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate("/dashboard")}>
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
              <Shield className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Analysis Results</h1>
              <p className="text-xs text-muted-foreground">Performance Dashboard</p>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          >
            {theme === "dark" ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </Button>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        {/* Success banner */}
        <Card className="mb-8 bg-gradient-to-br from-primary/10 to-primary/5 border-primary/50 animate-fade-in">
          <CardContent className="pt-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-full bg-primary/20 flex items-center justify-center animate-glow-pulse">
                <CheckCircle2 className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Analysis Complete</h2>
                <p className="text-muted-foreground">Password cracking process finished successfully</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)] animate-fade-in-up">
            <CardHeader className="pb-3">
              <CardDescription>Total Attempts</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <BarChart3 className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">{stats.totalAttempts.toLocaleString()}</p>
                  <p className="text-xs text-muted-foreground mt-1">Password combinations</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-secondary/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--secondary)/0.2)] animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
            <CardHeader className="pb-3">
              <CardDescription>Success Rate</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <TrendingUp className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-secondary">{stats.successRate}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Cracking efficiency</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-primary/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--primary)/0.2)] animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <CardHeader className="pb-3">
              <CardDescription>Runtime</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-primary">{stats.runtime}</p>
                  <p className="text-xs text-muted-foreground mt-1">Processing time</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border hover:border-secondary/50 transition-all duration-300 hover:shadow-[0_0_30px_hsl(var(--secondary)/0.2)] animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
            <CardHeader className="pb-3">
              <CardDescription>Efficiency Score</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-lg bg-secondary/10 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-secondary" />
                </div>
                <div>
                  <p className="text-3xl font-bold text-secondary">{stats.efficiency}%</p>
                  <p className="text-xs text-muted-foreground mt-1">Optimization level</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Detailed metrics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <Card className="bg-card/50 backdrop-blur-sm border-border animate-fade-in-up" style={{ animationDelay: "0.4s" }}>
            <CardHeader>
              <CardTitle>Cracking Results</CardTitle>
              <CardDescription>Breakdown of password analysis</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Successfully Cracked</span>
                  <span className="text-sm font-bold text-primary">{stats.cracked}</span>
                </div>
                <Progress value={(stats.cracked / (stats.cracked + stats.failed)) * 100} className="h-2" />
              </div>
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-sm font-medium">Failed Attempts</span>
                  <span className="text-sm font-bold text-destructive">{stats.failed}</span>
                </div>
                <Progress value={(stats.failed / (stats.cracked + stats.failed)) * 100} className="h-2" />
              </div>
              <div className="pt-4 border-t border-border">
                <p className="text-sm text-muted-foreground">
                  Total passwords analyzed: <span className="font-bold text-foreground">{stats.cracked + stats.failed}</span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card/50 backdrop-blur-sm border-border animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
            <CardHeader>
              <CardTitle>Algorithms Used</CardTitle>
              <CardDescription>Cracking methods deployed</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {stats.algorithmsUsed.map((algo, index) => (
                  <div
                    key={algo}
                    className="flex items-center gap-3 p-3 rounded-lg bg-background/50 border border-border animate-fade-in"
                    style={{ animationDelay: `${0.5 + index * 0.1}s` }}
                  >
                    <div className="w-2 h-2 rounded-full bg-primary animate-glow-pulse" />
                    <span className="font-medium">{algo}</span>
                    <span className="ml-auto text-xs text-muted-foreground font-mono">Active</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Performance insights */}
        <Card className="bg-gradient-to-br from-card/50 to-card/30 backdrop-blur-sm border-border animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <CardHeader>
            <CardTitle>Performance Insights</CardTitle>
            <CardDescription>Optimization metrics and recommendations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm font-medium mb-1">CPU Utilization</p>
                <p className="text-2xl font-bold text-primary">89%</p>
                <p className="text-xs text-muted-foreground mt-1">Multi-core processing</p>
              </div>
              <div className="p-4 rounded-lg bg-secondary/5 border border-secondary/20">
                <p className="text-sm font-medium mb-1">Memory Usage</p>
                <p className="text-2xl font-bold text-secondary">2.4 GB</p>
                <p className="text-xs text-muted-foreground mt-1">Peak allocation</p>
              </div>
              <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
                <p className="text-sm font-medium mb-1">Throughput</p>
                <p className="text-2xl font-bold text-primary">12K/sec</p>
                <p className="text-xs text-muted-foreground mt-1">Passwords tested</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex flex-wrap gap-4 mt-8 justify-center animate-fade-in-up" style={{ animationDelay: "0.7s" }}>
          <Button onClick={() => navigate("/upload")} className="bg-primary hover:bg-primary/90">
            Start New Analysis
          </Button>
          <Button variant="outline" onClick={() => window.print()}>
            Export Results
          </Button>
        </div>
      </main>
    </div>
  );
};

export default Results;
