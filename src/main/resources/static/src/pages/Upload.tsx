import { useState, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Upload as UploadIcon, FileText, CheckCircle2, Moon, Sun, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useTheme } from "next-themes";

const Upload = () => {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { theme, setTheme } = useTheme();

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setUploadedFile(files[0]);
      toast({
        title: "File Uploaded",
        description: `${files[0].name} is ready for analysis`,
      });
    }
  }, [toast]);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      setUploadedFile(files[0]);
      toast({
        title: "File Selected",
        description: `${files[0].name} is ready for analysis`,
      });
    }
  };

  const handleStartAnalysis = () => {
    if (!uploadedFile) {
      toast({
        title: "No File Selected",
        description: "Please upload a file first",
        variant: "destructive"
      });
      return;
    }

    toast({
      title: "Analysis Started",
      description: "Processing your file...",
    });

    // Simulate processing
    setTimeout(() => {
      navigate("/results");
    }, 2000);
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
              <h1 className="text-xl font-bold">File Upload</h1>
              <p className="text-xs text-muted-foreground">Password Analysis</p>
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
      <main className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="text-center mb-8 animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold mb-3 bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Upload Encrypted Files
          </h2>
          <p className="text-muted-foreground">
            Drop your password-protected files for analysis
          </p>
        </div>

        {/* Upload area */}
        <Card className="mb-6 animate-fade-in-up">
          <CardContent className="pt-6">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`
                relative border-2 border-dashed rounded-lg p-12 text-center transition-all duration-300
                ${isDragging 
                  ? 'border-primary bg-primary/5 shadow-[0_0_30px_hsl(var(--primary)/0.3)]' 
                  : 'border-border hover:border-primary/50 hover:bg-primary/5'
                }
              `}
            >
              {uploadedFile ? (
                <div className="space-y-4 animate-fade-in">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                    <CheckCircle2 className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold flex items-center justify-center gap-2">
                      <FileText className="w-5 h-5" />
                      {uploadedFile.name}
                    </p>
                    <p className="text-sm text-muted-foreground mt-1">
                      {(uploadedFile.size / 1024).toFixed(2)} KB
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    onClick={() => setUploadedFile(null)}
                    className="mt-4"
                  >
                    Remove File
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center mx-auto animate-float">
                    <UploadIcon className="w-10 h-10 text-primary" />
                  </div>
                  <div>
                    <p className="text-xl font-semibold mb-2">
                      Drop your file here
                    </p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse
                    </p>
                  </div>
                  <input
                    type="file"
                    onChange={handleFileSelect}
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  />
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Supported formats */}
        <Card className="mb-6 animate-fade-in-up" style={{ animationDelay: "0.1s" }}>
          <CardHeader>
            <CardTitle>Supported Formats</CardTitle>
            <CardDescription>Compatible file types for password analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {['.zip', '.rar', '.7z', '.pdf', '.docx', '.xlsx', '.txt', 'Custom'].map((format, i) => (
                <div
                  key={format}
                  className="text-center p-3 rounded-lg bg-background/50 border border-border hover:border-primary/50 transition-all duration-300 animate-fade-in"
                  style={{ animationDelay: `${0.1 + i * 0.05}s` }}
                >
                  <p className="font-mono text-sm font-semibold text-primary">{format}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Action button */}
        <Button
          onClick={handleStartAnalysis}
          disabled={!uploadedFile}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-lg py-6 transition-all duration-300 hover:shadow-[0_0_40px_hsl(var(--primary)/0.5)] disabled:opacity-50 animate-fade-in-up"
          style={{ animationDelay: "0.2s" }}
        >
          <UploadIcon className="w-5 h-5 mr-2" />
          Start Analysis
        </Button>

        {/* Info card */}
        <Card className="mt-6 bg-card/30 backdrop-blur-sm border-border animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
          <CardHeader>
            <CardTitle className="text-lg">Analysis Process</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <p>• Files are processed using advanced cryptographic algorithms</p>
            <p>• Multi-threaded Java backend ensures optimal performance</p>
            <p>• Real-time progress tracking and efficiency metrics</p>
            <p>• Secure processing with automatic cleanup</p>
          </CardContent>
        </Card>
      </main>
    </div>
  );
};

export default Upload;
